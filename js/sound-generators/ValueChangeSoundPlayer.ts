// Copyright 2022-2023, University of Colorado Boulder

/**
 * ValueChangeSoundPlayer plays sounds based on changes to a numerical value.  It was initially created for supporting
 * sound generation in PhET's Slider class and variations thereof, but it may have other applications.
 *
 * This class does not extend SoundGenerator and is not itself added to the sound manager.  It is instead a player of
 * a set of sounds, each of which should be registered with the sound manager elsewhere.
 *
 * Because the sounds should only be produced when users directly change a value, and not in side-effect-ish situations
 * (such as a reset), this class does not monitor a Property.  Instead, it provides methods that can be used to evaluate
 * changes in a value and potentially play sounds (or not, if the change doesn't warrant sound generation), and it is
 * the client's responsibility to know the situations in which these methods should be called.  Often these methods will
 * be called in drag handlers and other code that handles user input.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import optionize from '../../../phet-core/js/optionize.js';
import generalBoundaryBoop_mp3 from '../../sounds/generalBoundaryBoop_mp3.js';
import generalSoftClick_mp3 from '../../sounds/generalSoftClick_mp3.js';
import TSoundPlayer from '../TSoundPlayer.js';
import phetAudioContext from '../phetAudioContext.js';
import generalBoundaryBoopSoundPlayer from '../shared-sound-players/generalBoundaryBoopSoundPlayer.js';
import generalSoftClickSoundPlayer from '../shared-sound-players/generalSoftClickSoundPlayer.js';
import nullSoundPlayer from '../shared-sound-players/nullSoundPlayer.js';
import tambo from '../tambo.js';
import SoundClip from './SoundClip.js';
import SoundClipPlayer from './SoundClipPlayer.js';

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

// Define a default constraint function.  See the docs for the associated option for more info.  The interval value used
// here was empirically determined.
const DEFAULT_VALUE_CONSTRAINT = ( value: number ) => Utils.roundToInterval( value, 0.000000001 );

// A "no-op" function for mapping pitch values.  Always returns one, which signifies no change to the playback rate.
const NO_PLAYBACK_RATE_CHANGE = () => 1;

// A function for a stubbed sound player, see usage.
const STUB_SOUND_PLAYER_FUNCTION = (): void => {
  assert && assert( false, 'Code error: This is a stubbed function and should never be invoked.' );
};

export type ValueChangeSoundPlayerOptions = {

  // The sound player for movement in the middle of the range in the up direction.
  middleMovingUpSoundPlayer?: TSoundPlayer | SoundClip;

  // The sound player for movement in the middle of the range in the down direction.
  middleMovingDownSoundPlayer?: TSoundPlayer | SoundClip;

  // Functions that, if provided, will alter the playback rates of the middle sounds based on the provided value.
  middleMovingUpPlaybackRateMapper?: ( value: number ) => number;
  middleMovingDownPlaybackRateMapper?: ( value: number ) => number;

  // The number of thresholds that, when reached or crossed, will cause a sound to be played when checking value changes
  // against thresholds.  In other words, this is the number of thresholds that exist between the min and max values.
  // This assumes symmetric spacing of the thresholds, and is not compatible with explicitly setting of the 'delta'
  // value.
  numberOfMiddleThresholds?: number | null;

  // The delta value between thresholds that are used to determine when sounds are played.  This is an alternative way
  // to specify the thresholds and should only be used when numberOfMiddleThresholds can't, which is generally when a
  // very specific delta is required and having perfectly even thresholds isn't completely desirable.  Note that this
  // approach will often lead to a situation where the distance between the last threshold and the end of the range
  // isn't the same as the distance between all the other thresholds.  This was initially added to support
  // NumberControl, see https://github.com/phetsims/sun/issues/697.  This is incompatible with specifying
  // numberOfMiddleThresholds.
  interThresholdDelta?: number | null;

  // This function is used to constrain the values used for thresholds and value comparisons.  Without this, there can
  // sometimes be cases where slight value differences, such as those caused by floating point inaccuracies, can cause
  // sounds not to be generated when they should.  Use _.identity for a "no-op" if no constraint is needed.  This is
  // used for multiple values, but is called "constrainValue" rather than "constrainValues" to match the pre-existing
  // option name in the Slider class.  See https://github.com/phetsims/sun/issues/697#issuecomment-1066850181.
  constrainValue?: ( n: number ) => number;

  // The sound player that is used to indicate the minimum value.
  minSoundPlayer?: TSoundPlayer;

  // The sound player that is used to indicate the maximum value.
  maxSoundPlayer?: TSoundPlayer;

  // The minimum amount of time that must pass after a middle sound is played before another can be played.  This is
  // helpful when a lot of value changes can occur rapidly and thus create an overwhelming amount of sound.
  minimumInterMiddleSoundTime?: number;
};

class ValueChangeSoundPlayer {

  // The distance between the threshold values at which sounds will be played.
  private readonly interThresholdDistance: number;

  // range of values that this should expect to handle
  private readonly valueRange: Range;

  // sound player for movement in the middle of the range (i.e. not at min or max) and moving up
  private readonly middleMovingUpSoundPlayer: TSoundPlayer | SoundClip;

  // sound player for movement in the middle of the range (i.e. not at min or max) and moving down
  private readonly middleMovingDownSoundPlayer: TSoundPlayer | SoundClip;

  // playback rate mapper for middle sounds and upward value changes
  private readonly middleMovingUpPlaybackRateMapper: ( value: number ) => number;

  // playback rate mapper for middle sounds and downward value changes
  private readonly middleMovingDownPlaybackRateMapper: ( value: number ) => number;

  // Sound players for the min and max values.  If nothing is provided a default will be used.  If the flag
  // USE_MIDDLE_SOUND is provided, the sound player for the middle range will be used.
  private readonly minSoundPlayer: TSoundPlayer;
  private readonly maxSoundPlayer: TSoundPlayer;

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
  public constructor( valueRange: Range, providedOptions?: ValueChangeSoundPlayerOptions ) {

    const options = optionize<ValueChangeSoundPlayerOptions>()( {
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
      options.middleMovingUpSoundPlayer instanceof SoundClip,
      'a sound player that supports playback rate changes is required when a playback rate mapper is used'
    );
    assert && assert(
      options.middleMovingDownPlaybackRateMapper === NO_PLAYBACK_RATE_CHANGE ||
      options.middleMovingDownSoundPlayer instanceof SoundClip,
      'a sound player that supports playback rate changes is required when a playback rate mapper is used'
    );

    // Set default number of middle thresholds if necessary.
    if ( options.numberOfMiddleThresholds === null && options.interThresholdDelta === null ) {
      options.numberOfMiddleThresholds = DEFAULT_NUMBER_OF_MIDDLE_THRESHOLDS;
    }

    if ( options.numberOfMiddleThresholds !== null ) {
      this.interThresholdDistance = valueRange.getLength() / ( options.numberOfMiddleThresholds + 1 );
    }
    else if ( options.interThresholdDelta !== null ) {
      this.interThresholdDistance = options.interThresholdDelta;
    }
    else {
      assert && assert( false, 'should never get here, it is a logic error if we do' );
      this.interThresholdDistance = valueRange.getLength() / 2; // avoid uninitialized compile-time error
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
   * Check if the new value has reached or crossed a threshold and, if so, play the appropriate sound.  If no threshold
   * has been reached or crossed and the new value is not at the min or max, no sound will be played.
   */
  public playSoundIfThresholdReached( newValue: number, oldValue: number ): void {

    if ( newValue !== oldValue ) {

      const constrainedNewValue = this.constrainValue( newValue );
      const constrainedOldValue = this.constrainValue( oldValue );

      const oldValueSurroundingThresholds = this.getSurroundingThresholds( constrainedOldValue );
      const newValueSurroundingThresholds = this.getSurroundingThresholds( constrainedNewValue );

      const thresholdCrossed = ( oldValueSurroundingThresholds.length === 1 &&
                                 newValueSurroundingThresholds.length === 1 &&
                                 Math.abs( oldValueSurroundingThresholds[ 0 ] - newValueSurroundingThresholds[ 0 ] ) > this.interThresholdDistance
                               ) ||
                               ( oldValueSurroundingThresholds.length === 1 &&
                                 newValueSurroundingThresholds.length === 2 &&
                                 oldValueSurroundingThresholds[ 0 ] !== newValueSurroundingThresholds[ 0 ] &&
                                 oldValueSurroundingThresholds[ 0 ] !== newValueSurroundingThresholds[ 1 ]
                               ) ||
                               (
                                 oldValueSurroundingThresholds.length === 2 &&
                                 newValueSurroundingThresholds.length === 1 &&
                                 newValueSurroundingThresholds[ 0 ] !== oldValueSurroundingThresholds[ 0 ] &&
                                 newValueSurroundingThresholds[ 0 ] !== oldValueSurroundingThresholds[ 1 ]
                               ) ||
                               (
                                 oldValueSurroundingThresholds.length === 2 &&
                                 newValueSurroundingThresholds.length === 2 &&
                                 newValueSurroundingThresholds[ 0 ] !== oldValueSurroundingThresholds[ 0 ]
                               );
      const thresholdReached = newValueSurroundingThresholds.length === 1 &&
                               ( oldValueSurroundingThresholds.length === 2 ||
                                 oldValueSurroundingThresholds[ 0 ] !== newValueSurroundingThresholds[ 0 ] );

      if ( thresholdCrossed ||
           thresholdReached ||
           constrainedNewValue === this.valueRange.min ||
           constrainedNewValue === this.valueRange.max
      ) {
        this.playSoundForValueChange( newValue, oldValue );
      }
    }
  }

  /**
   * Play the appropriate sound for the change in value indicated by the provided new and old values.  This will almost
   * always play a sound, but there are some exceptions.  See the code and comments for details.
   */
  public playSoundForValueChange( newValue: number, oldValue: number ): void {
    const constrainedNewValue = this.constrainValue( newValue );
    const constrainedOldValue = this.constrainValue( oldValue );
    if ( constrainedNewValue !== constrainedOldValue ||
         ( oldValue !== newValue && ( newValue === this.valueRange.min || newValue === this.valueRange.max ) ) ) {

      if ( newValue === this.valueRange.min && this.minSoundPlayer !== ValueChangeSoundPlayer.USE_MIDDLE_SOUND ) {
        this.minSoundPlayer.play();
      }
      else if ( newValue === this.valueRange.max && this.maxSoundPlayer !== ValueChangeSoundPlayer.USE_MIDDLE_SOUND ) {
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
   * Get an array that contains the next lowest and next highest thresholds for the provided value.  If the provided
   * value is exactly equal to a threshold, only the single threshold value is returned in the array.
   */
  private getSurroundingThresholds( value: number ): number[] {

    // A note to future maintainers: JavaScript's floating point implementation was causing all manner of problems with
    // this method.  For instance, when the inter-threshold distance was 0.1 and the provided value was 0.3, JS says
    // that 0.3/0.1 is 2.9999999999999996, so it was tricky to tell that the value was at a threshold and not below it.
    // Therefore, the code below does rounding to intervals that were empirically determined to correct for the floating
    // point problems.  This worked in all test cases, but may not stand the test of time if some unusual slider
    // configurations are needed.  One idea might be to make the rounding interval for this calculation an option to the
    // class, but that felt like overkill at the time of this writing.
    const roundingInterval = 1E-7;

    const segment = Math.floor(
      Utils.roundToInterval( ( value - this.valueRange.min ) / this.interThresholdDistance, roundingInterval )
    );

    const lowerThreshold = Utils.roundToInterval(
      segment * this.interThresholdDistance + this.valueRange.min,
      roundingInterval
    );
    const thresholdArray = [ lowerThreshold ];
    if ( lowerThreshold !== value ) {

      // The provided value wasn't exactly at a threshold.  Since the preceding calculation provided the lower
      // threshold, add the upper one now.
      const upperThreshold = Math.min(
        Utils.roundToInterval( lowerThreshold + this.interThresholdDistance, roundingInterval ),
        this.valueRange.max
      );

      // This may seem like an odd test, so here's the story: There are some rare but possible cases where the
      // calculation above doesn't actually yield a higher value due to floating point errors.  When testing in Dec
      // 2022, this was only seen on the Wave Packet Center slider in Fourier Making Waves.  So, only add the upper
      // threshold if it's actually higher than the lower one.  If the upper threshold isn't added, this essentially
      // says that the lower threshold was an exact match for one of the crossing thresholds, which is approximately
      // true and has worked fine in all test cases thus far.
      if ( upperThreshold > lowerThreshold ) {
        thresholdArray.push( upperThreshold );
      }
    }
    return thresholdArray;
  }

  /**
   * A static instance that makes no sound.  This is generally used as an option value to turn off sound generation.
   */
  public static readonly NO_SOUND = new ValueChangeSoundPlayer( new Range( 0, 1 ), {
    middleMovingUpSoundPlayer: nullSoundPlayer,
    minSoundPlayer: nullSoundPlayer,
    maxSoundPlayer: nullSoundPlayer
  } );

  /**
   * A static TSoundPlayer instance that is intended to be used as a flag for the min and max sound players to
   * indicate that the middle sound player should be used.
   */
  public static readonly USE_MIDDLE_SOUND: TSoundPlayer = {
    play: STUB_SOUND_PLAYER_FUNCTION,
    stop: STUB_SOUND_PLAYER_FUNCTION
  };
}

tambo.register( 'ValueChangeSoundPlayer', ValueChangeSoundPlayer );

export default ValueChangeSoundPlayer;