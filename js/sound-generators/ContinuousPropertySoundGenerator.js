// Copyright 2019-2020, University of Colorado Boulder

/**
 * Sound generator that plays a pitch related to a Property value.  Fades out when the Property value is not changing.
 * Generalized from GRAVITY_FORCE_LAB_BASICS/ForceSoundGenerator.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import tambo from '../tambo.js';
import SoundClip from './SoundClip.js';

class ContinuousPropertySoundGenerator extends SoundClip {

  /**
   * @param {Property.<number>} property
   * @param {Object} sound - returned by the sound! plugin, should be optimized for good continuous looping, which may
   * require it to be a .wav file, since .mp3 files generally have a bit of silence at the beginning.
   * @param {Range} range
   * @param {Property.<boolean>} resetInProgressProperty
   * @param {Object} [options]
   * @constructor
   */
  constructor( property, sound, range, resetInProgressProperty, options ) {
    assert && assert( !options || !options.hasOwnProperty( 'loop' ), 'loop option should be supplied by' +
                                                                     ' ContinuousPropertySoundGenerator' );

    options = merge( {
      initialOutputLevel: 0.7,
      loop: true,
      trimSilence: false,
      pitchRangeInSemitones: 36,
      pitchCenterOffset: 2,
      fadeStartDelay: 0.2, // in seconds, time to wait before starting fade
      fadeTime: 0.15, // in seconds, duration of fade out
      delayBeforeStop: 0.1, // in seconds, amount of time from full fade to stop of sound, done to avoid glitches

      // {number} - number of octaves that the playback rate will span, larger numbers increase pitch range
      playbackRateSpanOctaves: 2,

      // {number} - Center offset of playback rate, positive numbers move the pitch range up, negative numbers move it
      // down, and a value of zero indicates no offset, so the pitch range will center around the inherent pitch of
      // the source loop.  This offset is added to the calculated playback rate, so a value of 1 would move the range
      // up an octave, -1 would move it down an octave, 0.5 would move it up a perfect fifth, etc.
      playbackRateCenterOffset: 0

    }, options );

    super( sound, options );

    // @private {number} - see docs at options declaration
    this.fadeTime = options.fadeTime;

    // @private {number} - see docs at options declaration
    this.delayBeforeStop = options.delayBeforeStop;

    // @private {number} - the output level before fade out starts
    this.nonFadedOutputLevel = options.initialOutputLevel;

    // @private {number} - countdown time used for fade out
    this.remainingFadeTime = 0;

    // start with the output level at zero so that the initial sound generation has a bit of fade in
    this.setOutputLevel( 0, 0 );

    // function for starting the sound or adjusting the volume
    const listener = value => {

      if ( !resetInProgressProperty.value && !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // calculate the playback rate based on the amount of force, see the design document for detailed explanation
        const normalizedValue = Math.log( value / range.min ) / Math.log( range.max / range.min );
        const playbackRate = Math.pow( 2, ( normalizedValue - 0.5 ) * options.playbackRateSpanOctaves ) +
                             options.playbackRateCenterOffset;

        this.setPlaybackRate( playbackRate );
        this.setOutputLevel( this.nonFadedOutputLevel );
        if ( !this.playing ) {
          this.play();
        }

        // reset the fade countdown
        this.remainingFadeTime = options.fadeStartDelay + options.fadeTime + this.delayBeforeStop;
      }
    };
    property.lazyLink( listener );

    // @private {function}
    this.disposeContinuousPropertySoundGenerator = () => property.unlink( listener );
  }

  /**
   * @public
   */
  dispose() {
    this.disposeContinuousPropertySoundGenerator();
    super.dispose();
  }

  /**
   * Step this sound generator, used for fading out the sound in the absence change.
   * @param {number} dt
   * @public
   */
  step( dt ) {
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
   * @public
   */
  reset() {
    this.stop( 0 );
    this.remainingFadeTime = 0;
  }
}

tambo.register( 'ContinuousPropertySoundGenerator', ContinuousPropertySoundGenerator );

export default ContinuousPropertySoundGenerator;