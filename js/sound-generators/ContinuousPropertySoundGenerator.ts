// Copyright 2019-2023, University of Colorado Boulder

/**
 * ContinuousPropertySoundGenerator is a sound generator that alters the playback rate of a sound clip based on the
 * value of a continuous numerical Property.  It is specifically designed to work with sound clips and does not support
 * other types of sound production, such as oscillators.  It is implemented such that the sound fades in when changes
 * occur in the Property's value and fades out out when the value doesn't change for some (configurable) amount of time.
 * This was generalized from GRAVITY_FORCE_LAB_BASICS/ForceSoundGenerator, see
 * https://github.com/phetsims/tambo/issues/76.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import tambo from '../tambo.js';
import SoundClip, { SoundClipOptions } from './SoundClip.js';
import WrappedAudioBuffer from '../WrappedAudioBuffer.js';
import optionize from '../../../phet-core/js/optionize.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Range from '../../../dot/js/Range.js';

type SelfOptions = {

  // number of octaves that the playback rate will span, larger numbers increase pitch range
  playbackRateSpanOctaves?: number;

  // time to wait before starting fade out if no activity, in seconds
  fadeStartDelay?: number;

  // duration of fade out, in seconds
  fadeTime?: number;

  // amount of time in seconds from full fade to stop of sound, done to avoid sonic glitches
  delayBeforeStop?: number;

  // Center offset of playback rate, positive numbers move the pitch range up, negative numbers move it down, and a
  // value of zero indicates no offset, so the pitch range will center around the inherent pitch of the source loop.
  // This offset is added to the calculated playback rate, so a value of 1 would move the range up an octave, -1 would
  // move it down an octave, 0.5 would move it up a perfect fifth, etc.
  playbackRateCenterOffset?: number;

  // If provided, this is used to prevent sound from being played during a reset, since the value of the provided
  // Property will often change then, and sound generation may not be desired.
  resetInProgressProperty?: BooleanProperty | null;
};
export type ContinuousPropertySoundGeneratorOptions = SelfOptions & SoundClipOptions;

class ContinuousPropertySoundGenerator extends SoundClip {

  // duration of inactivity fade out
  private readonly fadeTime: number;

  // see docs in options type declaration
  private readonly delayBeforeStop: number;

  // the output level before fade out starts
  private readonly nonFadedOutputLevel: number;

  // countdown time used for fade out
  private remainingFadeTime: number;

  private readonly disposeContinuousPropertySoundGenerator: () => void;

  /**
   * @param property
   * @param sound - returned by the import directive, should be optimized for good continuous looping, which
   * may require it to be a .wav file, since .mp3 files generally have a bit of silence at the beginning.
   * @param range - the range of values that the provided property can take on
   * @param [providedOptions]
   */
  public constructor( property: NumberProperty,
               sound: WrappedAudioBuffer,
               range: Range,
               providedOptions?: ContinuousPropertySoundGeneratorOptions ) {

    assert && assert(
      !providedOptions || !providedOptions.loop,
      'loop option should be supplied by ContinuousPropertySoundGenerator'
    );

    const options = optionize<ContinuousPropertySoundGeneratorOptions, SelfOptions, SoundClipOptions>()( {
      initialOutputLevel: 0.7,
      loop: true,
      trimSilence: true,
      fadeStartDelay: 0.2,
      fadeTime: 0.15,
      delayBeforeStop: 0.1,
      playbackRateSpanOctaves: 2,
      playbackRateCenterOffset: 0,
      resetInProgressProperty: null
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

      // Update the sound generation when the value changes.
      if ( !options.resetInProgressProperty || !options.resetInProgressProperty.value ) {

        // calculate the playback rate
        const normalizedValue = Math.log( value / range.min ) / Math.log( range.max / range.min );
        const playbackRate = Math.pow( 2, ( normalizedValue - 0.5 ) * options.playbackRateSpanOctaves ) +
                             options.playbackRateCenterOffset;

        this.setPlaybackRate( playbackRate );
        this.setOutputLevel( this.nonFadedOutputLevel );
        if ( !this.isPlaying ) {
          this.play();
        }

        // reset the fade countdown
        this.remainingFadeTime = options.fadeStartDelay + options.fadeTime + this.delayBeforeStop;
      }
    };
    property.lazyLink( listener );

    // dispose function
    this.disposeContinuousPropertySoundGenerator = () => property.unlink( listener );
  }

  public override dispose(): void {
    this.disposeContinuousPropertySoundGenerator();
    super.dispose();
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

tambo.register( 'ContinuousPropertySoundGenerator', ContinuousPropertySoundGenerator );

export default ContinuousPropertySoundGenerator;