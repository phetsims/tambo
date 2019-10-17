// Copyright 2019, University of Colorado Boulder

/**
 * Sound generator that plays a pitch related to a Property value.  Fades out when the Property is not changing.
 * Ported from GRAVITY_FORCE_LAB_BASICS/ForceSoundGenerator
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  class ContinuousPropertySoundGenerator extends SoundClip {

    /**
     * @param {Property.<number>} property
     * @param {Object} sound - returned by the sound! plugin
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
        delayBeforeStop: 0.1 // in seconds, amount of time from full fade to stop of sound, done to avoid glitches
      }, options );

      // TODO: there was a note in ForceSoundGenerator:
      // TODO: The saturated sine loop is precisely optimized for good looping, which is why it is a .wav and not a
      // TODO  *.mp3 file.
      // TODO: Some of our sounds are mp3 and have a "hitch" where no sound plays momentarily
      // TODO: Would that maybe be fixed if we used *.wav?

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

        if ( !resetInProgressProperty.value ) {

          // calculate the playback rate based on the value
          const normalizedValue = Math.log( value / range.min ) / Math.log( range.max / range.min );
          const centerValue = normalizedValue - 0.5;
          const midiNote = options.pitchRangeInSemitones / 2 * centerValue + options.pitchCenterOffset;
          const playbackRate = Math.pow( 2, midiNote / 12 );

          this.setPlaybackRate( playbackRate );
          this.setOutputLevel( this.nonFadedOutputLevel );
          if ( !this.playing ) {
            this.play();
          }

          // reset the fade countdown
          // TODO: Would this be clearer if we call it elapsedFadeTime and count up?
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

  return ContinuousPropertySoundGenerator;
} );