// Copyright 2019-2024, University of Colorado Boulder

/**
 * ContinuousPropertySoundClip is a sound generator that alters the playback rate of a sound clip based on the
 * value of a continuous numerical Property.  It is specifically designed to work with sound clips and does not support
 * other types of sound production, such as oscillators.  It is implemented such that the sound fades in when changes
 * occur in the Property's value and fades out when the value doesn't change for some (configurable) amount of time.
 * This was generalized from GRAVITY_FORCE_LAB_BASICS/ForceSoundGenerator, see
 * https://github.com/phetsims/tambo/issues/76.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import stepTimer from '../../../axon/js/stepTimer.js';
import { TReadOnlyEmitter } from '../../../axon/js/TEmitter.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../dot/js/Range.js';
import optionize from '../../../phet-core/js/optionize.js';
import isSettingPhetioStateProperty from '../../../tandem/js/isSettingPhetioStateProperty.js';
import soundConstants from '../soundConstants.js';
import tambo from '../tambo.js';
import WrappedAudioBuffer from '../WrappedAudioBuffer.js';
import SoundClip, { SoundClipOptions } from './SoundClip.js';

type SelfOptions = {

  // time to wait before starting fade out if no activity, in seconds
  fadeStartDelay?: number;

  // duration of fade out, in seconds
  fadeTime?: number;

  // amount of time in seconds from full fade to stop of sound, done to avoid sonic glitches
  delayBeforeStop?: number;

  // This option defines the range of playback rates used when mapping the provided Property value to a pitch.  A value
  // of 1 indicates the nominal playback rate, 0.5 is half speed (an octave lower), 2 is double speed (an octave
  // higher).  So, a range of 1 to 2 would go from the nominal playback rate of the sound to one octave higher.  Values
  // of 0 or less are invalid.
  playbackRateRange?: Range;

  // The exponent used when mapping a normalized value to a playback rate.  See code for exactly how this is used, but
  // the basic idea is that a value of 1 (the default) should be used for a linear mapping across the range, a value
  // above 1 for smaller changes at the lower portion of the range and greater changes towards the top, and a value
  // below 1 for greater changes in the lower portion of the range and smaller changes towards the top.
  normalizationMappingExponent?: number;

  // If true, we will stop() when the sound is disabled. The stop uses the DEFAULT_LINEAR_GAIN_CHANGE_TIME as its delay
  // to match the fullyEnabledProperty link logic in SoundGenerator.
  stopOnDisabled?: boolean;

  // An emitter that can be provided to step the time-driven behavior of this sound generator.  By default, this uses
  // the globally available stepTimer instance.  If set to null, nothing will be hooked up, and it will be up to the
  // client to step the instance directly.
  stepEmitter?: TReadOnlyEmitter<[ number ]> | null;
};
export type ContinuousPropertySoundClipOptions = SelfOptions & SoundClipOptions;

class ContinuousPropertySoundClip extends SoundClip {

  // duration of inactivity fade out
  private readonly fadeTime: number;

  // see docs in options type declaration
  private readonly delayBeforeStop: number;

  // the output level before fade out starts
  private readonly nonFadedOutputLevel: number;

  // countdown time used for fade out
  private remainingFadeTime: number;

  /**
   * @param property
   * @param range - the range of values that the provided property can take on
   * @param sound - returned by the import directive, should be optimized for good continuous looping, which
   *   may require it to be a .wav file, since .mp3 files generally have a bit of silence at the beginning.
   * @param [providedOptions]
   */
  public constructor( property: TReadOnlyProperty<number>,
                      range: Range,
                      sound: WrappedAudioBuffer,
                      providedOptions?: ContinuousPropertySoundClipOptions ) {

    assert && assert(
      !providedOptions || !providedOptions.loop,
      'loop option should be supplied by ContinuousPropertySoundClip'
    );

    const options = optionize<ContinuousPropertySoundClipOptions, SelfOptions, SoundClipOptions>()( {
      initialOutputLevel: 0.7,
      loop: true,
      trimSilence: true,
      fadeStartDelay: 0.2,
      fadeTime: 0.15,
      delayBeforeStop: 0.1,
      playbackRateRange: new Range( 0.5, 2 ), // 2 octaves, one below and one above the provided sound's inherent pitch
      normalizationMappingExponent: 1, // linear mapping by default
      stopOnDisabled: false,
      stepEmitter: stepTimer
    }, providedOptions );

    super( sound, options );

    this.fadeTime = options.fadeTime;
    this.delayBeforeStop = options.delayBeforeStop;
    this.nonFadedOutputLevel = options.initialOutputLevel === undefined ? 1 : options.initialOutputLevel;
    this.remainingFadeTime = 0;

    // start with the output level at zero so that the initial sound generation has a bit of fade in
    this.setOutputLevel( 0, 0 );

    // function for starting the sound or adjusting the volume
    const listener = ( value: number ) => {

      // Update the sound generation when the value changes, but only if we enabled. This prevents the play() from
      // occurring at all.
      if ( this.fullyEnabled ) {

        // Calculate the playback rate.  This is done by first normalizing the value over the provided range, then
        // mapping that value using an exponential function that can be used to create a non-linear mapping to emphasize
        // certain portions of the range.
        const normalizedValue = range.getNormalizedValue( value );
        const mappedNormalizedValueNew = Math.pow( normalizedValue, options.normalizationMappingExponent );
        const playbackRate = options.playbackRateRange.expandNormalizedValue( mappedNormalizedValueNew );

        // Update the parameters of the sound clip based on the new value.
        this.setPlaybackRate( playbackRate );
        this.setOutputLevel( this.nonFadedOutputLevel );
        if ( !this.isPlaying && !isSettingPhetioStateProperty.value ) {
          this.play();
        }

        // reset the fade countdown
        this.remainingFadeTime = options.fadeStartDelay + options.fadeTime + this.delayBeforeStop;
      }
    };
    property.lazyLink( listener );
    this.disposeEmitter.addListener( () => property.unlink( listener ) );

    if ( options.stopOnDisabled ) {
      this.fullyEnabledProperty.lazyLink( enabled => {
        !enabled && this.stop( soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME );
      } );
    }

    // Hook up the time-driven behavior.
    if ( options.stepEmitter ) {
      const stepEmitterListener = ( dt: number ) => this.step( dt );
      options.stepEmitter.addListener( stepEmitterListener );

      // Remove step emitter listener on disposal.
      this.disposeEmitter.addListener( () => options.stepEmitter?.removeListener( stepEmitterListener ) );
    }
  }

  /**
   * Step this sound generator, used for fading out the sound in the absence of change.
   * @param dt - change in time (i.e. delta time) in seconds
   */
  public step( dt: number ): void {
    if ( this.remainingFadeTime > 0 ) {
      this.remainingFadeTime = Math.max( this.remainingFadeTime - dt, 0 );

      if ( ( this.remainingFadeTime < this.fadeTime + this.delayBeforeStop ) && this.outputLevel > 0 ) {

        // the sound is fading out, adjust the output level
        const outputLevel = Math.max( ( this.remainingFadeTime - this.delayBeforeStop ) / this.fadeTime, 0 );
        this.setOutputLevel( outputLevel * this.nonFadedOutputLevel );
      }

      // fade out complete, stop playback
      if ( this.remainingFadeTime === 0 && this.isPlaying ) {
        this.stop( 0 );
      }
    }
  }

  /**
   * stop any in-progress sound generation
   */
  public reset(): void {
    this.stop( 0 );
    this.remainingFadeTime = 0;
  }
}

tambo.register( 'ContinuousPropertySoundClip', ContinuousPropertySoundClip );

export default ContinuousPropertySoundClip;