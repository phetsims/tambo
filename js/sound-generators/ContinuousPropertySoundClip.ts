// Copyright 2019-2024, University of Colorado Boulder

/**
 * ContinuousPropertySoundClip is a sound generator that alters the playback rate of a sound clip based on the
 * value of a continuous numerical Property.  It is specifically designed to work with sound clips and does not support
 * other types of sound production, such as oscillators.  It is implemented such that the sound fades in when changes
 * occur in the Property's value and fades out when the value doesn't change for some (configurable) amount of time.
 * This was generalized from GRAVITY_FORCE_LAB_BASICS/ForceSoundGenerator, see
 * https://github.com/phetsims/tambo/issues/76.
 *
 * NOTE: This SoundClip is inherently tied to a Properties changes instead of user input. This can lead to undesirable
 * situations where this can play based on internal model changes and not from user interaction (the best example of this
 * is during reset). Please make sure to use `enableControlProperties` to silence sound during these cases (like model reset!)
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import tambo from '../tambo.js';
import SoundClip, { SoundClipOptions } from './SoundClip.js';
import WrappedAudioBuffer from '../WrappedAudioBuffer.js';
import optionize from '../../../phet-core/js/optionize.js';
import Range from '../../../dot/js/Range.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import isSettingPhetioStateProperty from '../../../tandem/js/isSettingPhetioStateProperty.js';
import soundConstants from '../soundConstants.js';

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

  // If true, we will stop() when the sound is disabled. The stop uses the DEFAULT_LINEAR_GAIN_CHANGE_TIME as its delay
  // to match the fullyEnabledProperty link logic in SoundGenerator.
  stopOnDisabled?: boolean;
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

  private readonly disposeContinuousPropertySoundClip: () => void;

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

    //TODO https://github.com/phetsims/tambo/issues/188 Support range.min === 0
    assert && assert( range.min !== 0, 'range.min of 0 will result in divide-by-zero error' );
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
      playbackRateSpanOctaves: 2,
      playbackRateCenterOffset: 0,
      enableControlProperties: [],
      stopOnDisabled: false
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

        // calculate the playback rate
        const normalizedValue = Math.log( value / range.min ) / Math.log( range.max / range.min );
        const playbackRate = Math.pow( 2, ( normalizedValue - 0.5 ) * options.playbackRateSpanOctaves ) +
                             options.playbackRateCenterOffset;

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

    if ( options.stopOnDisabled ) {
      this.fullyEnabledProperty.lazyLink( enabled => {
        !enabled && this.stop( soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME );
      } );
    }

    // dispose function
    this.disposeContinuousPropertySoundClip = () => property.unlink( listener );
  }

  public override dispose(): void {
    this.disposeContinuousPropertySoundClip();
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

tambo.register( 'ContinuousPropertySoundClip', ContinuousPropertySoundClip );

export default ContinuousPropertySoundClip;