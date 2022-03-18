// Copyright 2022, University of Colorado Boulder

/**
 * ValueChangeSoundGenerator is used to produce sounds based on changes to a numerical value.  It was initially created
 * for supporting PhET's Slider class and variations thereof, but it may have other applications.
 *
 * Because the sounds should only be produced when direct interactions from the user change a value, and not in other
 * situations (e.g. a reset), this class does not monitor a Property.  Instead, it provides methods that can be used to
 * evaluate changes in value and potentially play sounds, and it is the client's responsibility to know the situations
 * in which these methods should be called.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import optionize from '../../../phet-core/js/optionize.js';
import generalBoundaryBoopSoundPlayer from '../shared-sound-players/generalBoundaryBoopSoundPlayer.js';
import generalSoftClickSoundPlayer from '../shared-sound-players/generalSoftClickSoundPlayer.js';
import SoundPlayer from '../SoundPlayer.js';
import tambo from '../tambo.js';
import ISoundPlayer from '../ISoundPlayer.js';
import SoundGenerator, { SoundGeneratorOptions } from './SoundGenerator.js';
import phetAudioContext from '../phetAudioContext.js';
import SoundClipPlayer from './SoundClipPlayer.js';
import generalBoundaryBoop_mp3 from '../../sounds/generalBoundaryBoop_mp3.js';
import generalSoftClick_mp3 from '../../sounds/generalSoftClick_mp3.js';
import Utils from '../../../dot/js/Utils.js';
import SoundClip from './SoundClip.js';

// constants
const DEFAULT_NUMBER_OF_MIDDLE_THRESHOLDS = 5; // fairly arbitrary
const DEFAULT_MIN_SOUND_PLAYER = new SoundClipPlayer( generalBoundaryBoop_mp3, {
  soundClipOptions: {
    initialOutputLevel: 0.2,
    initialPlaybackRate: 1 / Math.pow( 2, 1 / 6 ) // a major second lower
  },
  soundManagerOptions: { categoryName: 'user-interface' }
} );
const DEFAULT_MIDDLE_MOVING_DOWN_SOUND_PLAYER = new SoundClipPlayer( generalSoftClick_mp3, {
  soundClipOptions: {
    initialOutputLevel: 0.2,
    initialPlaybackRate: 1 / Math.pow( 2, 1 / 6 ) // a major second lower
  },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

// Define a default constraint function.  During the development of this class, it was found to be needed to do some
// constraining of the values by default to avoid problems with floating point errors.  The interval value used here is
// somewhat arbitrary, but was found to work in all the test cases at the time.
const DEFAULT_VALUE_CONSTRAINT = ( value: number ) => Utils.roundToInterval( value, 0.000000001 );

// A "no-op" function for mapping pitch values.  Always returns one, which signifies no change to the playback rate.
const NO_PLAYBACK_RATE_CHANGE = ( value: number ) => 1;

type SelfOptions = {

  // The sound player for movement in the middle of the range in the up direction.
  middleMovingUpSoundPlayer?: ISoundPlayer | SoundClip;

  // The sound player for movement in the middle of the range in the down direction.
  middleMovingDownSoundPlayer?: ISoundPlayer | SoundClip;

  // Functions that, if provided, will alter the playback rates of the middle sounds based on the provided value.
  middleMovingUpPlaybackRateMapper?: ( value: number ) => number;
  middleMovingDownPlaybackRateMapper?: ( value: number ) => number;

  // The number of thresholds that, when reached or crossed, will cause a sound to be played when checking value changes
  // against thresholds.  In other words, this is the number of thresholds that exist between the min and max values.
  // This assumes symmetric spacing of the thresholds, and is not compatible with explicitly setting of the 'delta'
  // value.
  numberOfMiddleThresholds?: number | null;

  // The delta value between thresholds that are used to determine when sounds are played.  This is an alternative way
  // to specify the thresholds and should only be used when they need to be asymmetric.  This was initially added to
  // support NumberControl, see https://github.com/phetsims/sun/issues/697.  This is incompatible with specifying
  // numberOfMiddleThresholds.
  interThresholdDelta?: number | null;

  // This function is used to constrain the values used for thresholds and value comparisons.  Without this, there can
  // sometimes be cases where slight value differences, such as those caused by floating point inaccuracies, can cause
  // sounds not to be generated when they should.  Use _.identity for a "no-op" if needed.  This is used for multiple
  // values, but is called "constrainValue" rather than "constrainValues" to match the pre-existing option name in the
  // Slider class.  See https://github.com/phetsims/sun/issues/697#issuecomment-1066850181.
  constrainValue?: ( n: number ) => number;

  // The sound player that is used to indicate the minimum value.
  minSoundPlayer?: ISoundPlayer;

  // The sound player that is used to indicate the maximum value.
  maxSoundPlayer?: ISoundPlayer;

  // The minimum amount of time that must pass after a middle sound is played before another can be played.  This is
  // helpful when a lot of value changes can occur rapidly and thus create an overwhelming amount of sound.
  minimumInterMiddleSoundTime?: number,
};

export type ValueChangeSoundGeneratorOptions = SelfOptions & SoundGeneratorOptions;

class ValueChangeSoundGenerator extends SoundGenerator {

  // thresholds that will be used to decide when to play sounds in some cases
  private readonly thresholds: number[]

  // range of values that this should expect to handle
  private readonly valueRange: Range;

  // sound player for movement in the middle of the range (i.e. not at min or max) and moving up
  private readonly middleMovingUpSoundPlayer: ISoundPlayer | SoundClip;

  // sound player for movement in the middle of the range (i.e. not at min or max) and moving down
  private readonly middleMovingDownSoundPlayer: ISoundPlayer | SoundClip;

  // playback rate mapper for middle sounds and upward value changes
  private readonly middleMovingUpPlaybackRateMapper: ( value: number ) => number;

  // playback rate mapper for middle sounds and upward value changes
  private readonly middleMovingDownPlaybackRateMapper: ( value: number ) => number;

  // sound player for min values
  private readonly minSoundPlayer: ISoundPlayer;

  // sound player for max values
  private readonly maxSoundPlayer: ISoundPlayer;

  // min time between playing one middle sound and the next
  private readonly minimumInterMiddleSoundTime: number;

  // function to constrain the values used for thresholds and comparisons
  private readonly constrainValue: ( n: number ) => number;

  // time of most recently played middle sound, used to moderate the rate at which these sounds are played
  private timeOfMostRecentMiddleSound: number;

  /**
   * @param valueRange - the range of values expected and over which sounds will be played
   * @param [providedOptions]
   */
  constructor( valueRange: Range, providedOptions?: ValueChangeSoundGeneratorOptions ) {

    const options = optionize<ValueChangeSoundGeneratorOptions, SelfOptions, SoundGeneratorOptions>( {
      middleMovingUpSoundPlayer: generalSoftClickSoundPlayer,
      middleMovingDownSoundPlayer: DEFAULT_MIDDLE_MOVING_DOWN_SOUND_PLAYER,
      middleMovingUpPlaybackRateMapper: NO_PLAYBACK_RATE_CHANGE,
      middleMovingDownPlaybackRateMapper: NO_PLAYBACK_RATE_CHANGE,
      numberOfMiddleThresholds: null,
      interThresholdDelta: null,
      constrainValue: DEFAULT_VALUE_CONSTRAINT,
      minSoundPlayer: DEFAULT_MIN_SOUND_PLAYER,
      maxSoundPlayer: generalBoundaryBoopSoundPlayer,
      minimumInterMiddleSoundTime: 0.035 // empirically determined
    }, providedOptions );

    // option validity checks
    assert && assert(
    options.minimumInterMiddleSoundTime >= 0 && options.minimumInterMiddleSoundTime < 1,
      `unreasonable value for minimumInterMiddleSoundTime: ${options.minimumInterMiddleSoundTime}`
    );
    assert && assert(
      options.numberOfMiddleThresholds === null || options.interThresholdDelta === null,
      'cannot specify both the number of middle thresholds and the inter-threshold delta'
    );
    assert && assert(
      options.numberOfMiddleThresholds === null || Number.isInteger( options.numberOfMiddleThresholds ),
      'numberOfMiddleThresholds must be an integer if specified'
    );

    // If a playback rate mapper is provided for a middle threshold sound, the provided sound player must support
    // setting a different playback rate.  It should NOT be a SoundClipPlayer, since those are designed to be shared, so
    // the playback rate should never be changed.  The following assertions are intended to verify that these options
    // are set in a compatible way.
    assert && assert(
      options.middleMovingUpPlaybackRateMapper === NO_PLAYBACK_RATE_CHANGE ||
      // @ts-ignore
      options.middleMovingUpSoundPlayer.setPlaybackRate,
      'a sound player that supports playback rate changes is required when a playback rate mapper is used'
    );
    assert && assert(
      options.middleMovingDownPlaybackRateMapper === NO_PLAYBACK_RATE_CHANGE ||
      // @ts-ignore
      options.middleMovingDownSoundPlayer.setPlaybackRate,
      'a sound player that supports playback rate changes is required when a playback rate mapper is used'
    );

    // Set default number of middle thresholds if necessary.
    if ( options.numberOfMiddleThresholds === null && options.interThresholdDelta === null ) {
      options.numberOfMiddleThresholds = DEFAULT_NUMBER_OF_MIDDLE_THRESHOLDS;
    }

    super( options );

    this.thresholds = [];
    if ( options.numberOfMiddleThresholds !== null ) {
      const interThresholdDistance = valueRange.getLength() / ( options.numberOfMiddleThresholds + 1 );
      _.times( options.numberOfMiddleThresholds, index => {
        this.thresholds.push( options.constrainValue( valueRange.min + ( index + 1 ) * interThresholdDistance ) );
      } );

      // Make sure that the constraint function didn't constrain the thresholds too much.
      assert && assert(
        _.uniq( this.thresholds ).length === options.numberOfMiddleThresholds,
        'not enough unique thresholds were produced - is the constraint function too constraining?'
      );
    }
    else if ( options.interThresholdDelta !== null ) {
      _.times( Math.floor( valueRange.getLength() / options.interThresholdDelta ), index => {
        this.thresholds.push(
          options.constrainValue( valueRange.min + ( index + 1 ) * options.interThresholdDelta! )
        );
      } );
    }

    this.valueRange = valueRange;
    this.middleMovingUpSoundPlayer = options.middleMovingUpSoundPlayer;
    this.middleMovingDownSoundPlayer = options.middleMovingDownSoundPlayer;
    this.middleMovingUpPlaybackRateMapper = options.middleMovingUpPlaybackRateMapper;
    this.middleMovingDownPlaybackRateMapper = options.middleMovingDownPlaybackRateMapper;
    this.minSoundPlayer = options.minSoundPlayer;
    this.maxSoundPlayer = options.maxSoundPlayer;
    this.minimumInterMiddleSoundTime = options.minimumInterMiddleSoundTime;
    this.timeOfMostRecentMiddleSound = 0;
    this.constrainValue = options.constrainValue;
  }

  /**
   * Check if the new value has reached threshold and, if so, play the appropriate sound.  If no threshold has been
   * reached or crossed and the new value is not at the min or max, no sound will be played.
   */
  playSoundIfThresholdReached( newValue: number, oldValue: number ) {
    if ( newValue !== oldValue ) {
      const constrainedNewValue = this.constrainValue( newValue );
      const constrainedOldValue = this.constrainValue( oldValue );
      const crossedOrReachedThreshold = this.thresholds.find( threshold =>
        constrainedOldValue < threshold && constrainedNewValue >= threshold ||
        constrainedOldValue > threshold && constrainedNewValue <= threshold
      );
      if ( crossedOrReachedThreshold !== undefined ||
           newValue === this.valueRange.min ||
           newValue === this.valueRange.max ) {
        this.playSoundForValueChange( newValue, oldValue );
      }
    }
  }

  /**
   * Play the appropriate sound for the change in value indicated by the provided new and old values.  This will almost
   * always play a sound, but there are some exceptions.  See the code and comments for details.
   */
  playSoundForValueChange( newValue: number, oldValue: number ) {
    const constrainedNewValue = this.constrainValue( newValue );
    const constrainedOldValue = this.constrainValue( oldValue );
    if ( constrainedNewValue !== constrainedOldValue ||
         ( oldValue !== newValue && ( newValue === this.valueRange.min || newValue === this.valueRange.max ) ) ) {

      if ( newValue === this.valueRange.min ) {
        this.minSoundPlayer.play();
      }
      else if ( newValue === this.valueRange.max ) {
        this.maxSoundPlayer.play();
      }
      else {

        // Play a middle-range sound, but only if enough time has passed since the last one was played.
        const now = phetAudioContext.currentTime;
        if ( now - this.timeOfMostRecentMiddleSound > this.minimumInterMiddleSoundTime ) {
          let playbackRateMapper;
          let soundPlayer;
          if ( constrainedNewValue > constrainedOldValue ) {
            playbackRateMapper = this.middleMovingUpPlaybackRateMapper;
            soundPlayer = this.middleMovingUpSoundPlayer;
          }
          else {
            playbackRateMapper = this.middleMovingUpPlaybackRateMapper;
            soundPlayer = this.middleMovingDownSoundPlayer;
          }

          if ( playbackRateMapper !== NO_PLAYBACK_RATE_CHANGE ) {

            // Adjust the playback rate based on the provided new value.  It should be safe to cast this here because of
            // the assertion checks that occur during construction.
            ( soundPlayer as SoundClip ).setPlaybackRate( playbackRateMapper( newValue ) );
          }
          soundPlayer.play();
          this.timeOfMostRecentMiddleSound = now;
        }
      }
    }
  }

  /**
   * Static instance that makes no sound.  This is generally used as an option value to turn off sound generation.
   */
  static NO_SOUND = new ValueChangeSoundGenerator( new Range( 0, 1 ), {
    middleMovingUpSoundPlayer: SoundPlayer.NO_SOUND,
    minSoundPlayer: SoundPlayer.NO_SOUND,
    maxSoundPlayer: SoundPlayer.NO_SOUND
  } )
}

tambo.register( 'ValueChangeSoundGenerator', ValueChangeSoundGenerator );

export default ValueChangeSoundGenerator;