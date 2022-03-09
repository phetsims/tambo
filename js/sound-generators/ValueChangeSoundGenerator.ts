// Copyright 2022, University of Colorado Boulder

/**
 * ValueChangeSoundGenerator is used to produce sounds based on changes to a numerical value.  It was initially created
 * for supporting PhET's Slider class and variations thereof, but it may have other applications.
 *
 * Because the sounds should only be produced when direct interactions from the user change a value, and not in other
 * situations (e.g. a reset), this class does not monitor a Property.  Instead, it provides methods that can be used to
 * play sounds based on changes to a value, and it is the client's responsibility to know *when* those sounds should be
 * played.
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

type SelfOptions = {

  // The sound player that will potentially be played when changes occur that are not to the min or max values.
  middleMovementSoundPlayer?: ISoundPlayer;

  // The number of thresholds that, when reached or crossed, will cause a sound to be played when checking value changes
  // against thresholds.  In other words, this is the number of thresholds that exist between the min and max values.
  numberOfMiddleThresholds?: number;

  // This function is used to constrain the threshold values that are used to decide when to play
  // sounds.  This was found to be needed in cases where the length of the provided range and the number of
  // thresholds led to floating point errors that could cause sounds not to be played when they should be.
  // This should only be used when needed, and comes up most often when using constrained slider values.  It may be
  // possible to use the same constraint function in such cases.
  constrainThresholds?: ( n: number ) => number;

  // The sound played when a min or max value is hit.
  minMaxSoundPlayer?: ISoundPlayer;

  // The minimum amount of time that must pass after a middle sound is played before another can be played.  This is
  // helpful when a lot of value changes can occur rapidly and thus create an overwhelming amount of sound.
  minimumInterMiddleSoundTime?: number
};

export type ValueChangeSoundGeneratorOptions = SelfOptions & SoundGeneratorOptions;

class ValueChangeSoundGenerator extends SoundGenerator {

  // thresholds that will be used to decide when to play sounds in some cases
  private readonly thresholds: number[]

  // range of values that this should expect to handle
  private readonly valueRange: Range;

  // sound player for movement above the min and below the max
  private readonly middleMovementSoundPlayer: ISoundPlayer;

  // sound player for the max and min values
  private readonly minMaxSoundPlayer: ISoundPlayer;

  // min time between playing one middle sound and the next
  private readonly minimumInterMiddleSoundTime: number;

  // time of most recently played middle sound, used to moderate the rate at which these sounds are played
  private timeOfMostRecentMiddleSound: number;

  /**
   * @param valueRange - the range of values expected and over which sounds will be played
   * @param [providedOptions]
   */
  constructor( valueRange: Range, providedOptions?: ValueChangeSoundGeneratorOptions ) {

    const options = optionize<ValueChangeSoundGeneratorOptions, SelfOptions, SoundGeneratorOptions>( {
      middleMovementSoundPlayer: generalSoftClickSoundPlayer,
      numberOfMiddleThresholds: 9,
      constrainThresholds: _.identity,
      minMaxSoundPlayer: generalBoundaryBoopSoundPlayer,
      minimumInterMiddleSoundTime: 0.035 // empirically determined
    }, providedOptions );

    // option validity checks
    assert && assert( SoundPlayer.isSoundPlayer( options.middleMovementSoundPlayer ) );
    assert && assert( SoundPlayer.isSoundPlayer( options.minMaxSoundPlayer ) );
    assert && assert( Number.isInteger( options.numberOfMiddleThresholds ), 'numberOfMiddleThresholds must be an integer' );

    super( options );

    this.thresholds = [];
    const interThresholdDistance = valueRange.getLength() / ( options.numberOfMiddleThresholds + 1 );
    _.times( options.numberOfMiddleThresholds, index => {
      this.thresholds.push( options.constrainThresholds( valueRange.min + ( index + 1 ) * interThresholdDistance ) );
    } );

    // Make sure that the constraint function didn't constrain the thresholds too much.
    assert && assert(
      _.uniq( this.thresholds ).length === options.numberOfMiddleThresholds,
      'not enough unique thresholds were produced - is the constraint function too constraining?'
    );

    this.valueRange = valueRange;
    this.middleMovementSoundPlayer = options.middleMovementSoundPlayer;
    this.minMaxSoundPlayer = options.minMaxSoundPlayer;
    this.minimumInterMiddleSoundTime = options.minimumInterMiddleSoundTime;
    this.timeOfMostRecentMiddleSound = 0;
  }

  /**
   * Check if the new value has reached threshold and, if so, play the appropriate sound.
   */
  playSoundIfThresholdReached( newValue: number, oldValue: number ) {
    if ( newValue !== oldValue ) {
      const crossedOrReachedThreshold = this.thresholds.find( threshold =>
        oldValue < threshold && newValue >= threshold || oldValue > threshold && newValue <= threshold
      );
      if ( crossedOrReachedThreshold || newValue === this.valueRange.min || newValue === this.valueRange.max ) {
        this.playSoundForValueChange( newValue, oldValue );
      }
    }
  }

  /**
   * Play the appropriate sound for the change in value indicated by the provided new and old values.
   */
  playSoundForValueChange( newValue: number, oldValue: number ) {
    if ( newValue !== oldValue ) {
      if ( newValue === this.valueRange.min || newValue === this.valueRange.max ) {
        this.minMaxSoundPlayer.play();
      }
      else {

        // Play a middle-range sound, but only if enough time has passed since the last one was played.
        const now = phetAudioContext.currentTime;
        if ( now - this.timeOfMostRecentMiddleSound > this.minimumInterMiddleSoundTime ) {
          this.middleMovementSoundPlayer.play();
          this.timeOfMostRecentMiddleSound = now;
        }
      }
    }
  }

  /**
   * Static instance that makes no sound.  This is generally used as an option value to turn off sound generation.
   */
  static NO_SOUND = new ValueChangeSoundGenerator( new Range( 0, 1 ), {
    middleMovementSoundPlayer: SoundPlayer.NO_SOUND,
    minMaxSoundPlayer: SoundPlayer.NO_SOUND
  } )
}

tambo.register( 'ValueChangeSoundGenerator', ValueChangeSoundGenerator );

export default ValueChangeSoundGenerator;