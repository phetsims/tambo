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

type SelfOptions = {

  // The sound player that will potentially be played when changes occur that are not to the min or max values.
  middleMovementSoundPlayer?: ISoundPlayer;

  // The number of thresholds where the sound will be played during mouse- or touch-based dragging.
  numberOfMiddleThresholds?: number;

  // This function is used to constrain the threshold values that are used to decide when to play
  // sounds.  This was found to be needed in cases where the length of the provided range and the number of
  // thresholds led to floating point errors that could cause sounds not to be played when they should be.
  // This should only be used when needed, and comes up most often when using constrained slider values.  It may be
  // possible to use the same constraint function in such cases.
  constrainThresholds?: ( n: number ) => number;

  // The sound played when a min or max value is hit.
  minMaxSoundPlayer?: ISoundPlayer;
};

export type ValueChangeSoundGeneratorOptions = SelfOptions & SoundGeneratorOptions;

class ValueChangeSoundGenerator extends SoundGenerator {

  // thresholds that will be used to decide when to play sounds in some cases
  private thresholds: number[]

  // values necessary for the methods to do their things
  private valueRange: Range;
  private middleMovementSoundPlayer: ISoundPlayer;
  private minMaxSoundPlayer: ISoundPlayer;

  /**
   * @param valueRange - the range of values expected and over which sounds will be played
   * @param [providedOptions]
   */
  constructor( valueRange: Range, providedOptions?: ValueChangeSoundGeneratorOptions ) {

    const options = optionize<ValueChangeSoundGeneratorOptions, SelfOptions, SoundGeneratorOptions>( {
      middleMovementSoundPlayer: generalSoftClickSoundPlayer,
      numberOfMiddleThresholds: 9,
      constrainThresholds: _.identity,
      minMaxSoundPlayer: generalBoundaryBoopSoundPlayer
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
        this.middleMovementSoundPlayer.play();
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