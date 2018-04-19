// Copyright 2018, University of Colorado Boulder

/**
 * abstract base class for a sound generator that uses recorded sounds
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var platform = require( 'PHET_CORE/platform' );
  var SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  var soundInfoDecoder = require( 'TAMBO/soundInfoDecoder' );
  var tambo = require( 'TAMBO/tambo' );

  // audio
  // var emptySound = require( 'audio!TAMBO/empty.mp3' );
  var emptySound = require( 'audio!TAMBO/bright-marimba.mp3' );

  /**
   * @param {Object} soundInfo - An object that includes *either* a url that points to the sound to be played *or* a
   * base64-encoded version of the sound data.  The former is generally used when a sim is running in RequireJS mode,
   * the latter is used in built versions.
   * @param {Object} [options]
   * @constructor
   */
  function SoundClip( soundInfo, options ) {

    var self = this;
    SoundGenerator.call( this, options );

    // @protected {AudioBufferSourceNode} - sound data in a form that is ready to play with Web Audio
    this.soundBuffer = null;

    // @protected {function} - function to be invoked when sound buffer finishes loading
    this.loadCompleteAction = null;

    // decode the audio data and place it in a sound buffer so it can be easily played
    soundInfoDecoder.decode(
      soundInfo,
      this.audioContext,
      function( decodedAudioData ) {
        self.soundBuffer = decodedAudioData;
        self.loadCompleteAction && self.loadCompleteAction();
        self.loadCompleteAction = null;
      },
      function() {
        // we haven't seen this happen, so for now a message is logged to the console and that's it
        console.log( 'Error: Unable to decode audio data.' );
      }
    );

    // @protected {number} - rate at which clip is being played back
    this.playbackRate = 1;
  }

  tambo.register( 'SoundClip', SoundClip );

  inherit( SoundGenerator, SoundClip, {

    /**
     * play sound and change the speed as playback occurs
     * @param {number} playbackRate - desired playback speed, 1 = normal speed
     * @param {number} [timeConstant] -  time-constant value of first-order filter (exponential) approach to the target
     * value. The larger this value is, the slower the transition will be.
     */
    setPlaybackRate: function( playbackRate, timeConstant ) {
      timeConstant = timeConstant || SoundGenerator.DEFAULT_TIME_CONSTANT;
      if ( this.source ) {
        this.source.playbackRate.setTargetAtTime( playbackRate, this.audioContext.currentTime, timeConstant );
      }
      this.playbackRate = playbackRate;
    }
  } );

  // Workaround for iOS+Safari: In this situation, we must play an audio file from a thread initiated by a user event
  // such as touchstart before any sounds will play. This is not possible with scenery, since all scenery events are
  // batched and dispatched from the animation loop.
  //
  // See http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api
  //
  // Note: This requires the user to touch the screen before audio can be played.
  if ( platform.mobileSafari ) {
    var silence = new SoundClip( emptySound );
    var playSilence = function() {
      silence.play();
      window.removeEventListener( 'touchstart', playSilence );
    };
    window.addEventListener( 'touchstart', playSilence );
  }

  return SoundClip;
} );