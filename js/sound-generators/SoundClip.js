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
  var SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  var tambo = require( 'TAMBO/tambo' );

  /**
   * @param {Object} soundInfo - An object that includes *either* a url that points to the sound to be played *or* a
   * base64-encoded version of the sound data.  The former is generally used when a sim is running in RequireJS mode,
   * the latter is used in built versions.
   * @param {Object} options
   * @constructor
   */
  function SoundClip( soundInfo, options ) {

    var self = this;
    SoundGenerator.call( this, options );

    // parameter checking
    assert && assert( typeof(soundInfo) === 'object' && (soundInfo.url || soundInfo.base64) );

    var soundElement = document.createElement( 'audio' );
    var supportedFormatFound = false;

    // identify the audio format
    var audioFormat;
    if ( soundInfo.url ) {
      audioFormat = 'audio/' + soundInfo.url.slice( soundInfo.url.lastIndexOf( '.' ) + 1,
        soundInfo.url.lastIndexOf( '?' ) >= 0 ? soundInfo.url.lastIndexOf( '?' ) : soundInfo.url.length
      );
    }
    else {
      audioFormat = soundInfo.base64.slice( soundInfo.base64.indexOf( ':' ) + 1, soundInfo.base64.indexOf( ';' ) );
    }

    // determine whether this audio format is supported (doesn't exist for phantomjs, which is used in automated testing)
    if ( soundElement.canPlayType && soundElement.canPlayType( audioFormat ) ) {
      supportedFormatFound = true;
    }
    else {
      console.log( 'Warning: audio format not supported, sound will not be played.' );
    }

    // @protected {AudioBufferSourceNode} - sound data in a form that is ready to play with Web Audio
    this.soundBuffer = null;

    // @protected {function} - function to be invoked when sound buffer finishes loading
    this.loadCompleteAction = null;

    function handleDecodedAudioData( decodedAudioData ) {
      self.soundBuffer = decodedAudioData;
      self.loadCompleteAction && self.loadCompleteAction();
      self.loadCompleteAction = null;
    }

    function handleAudioDecodeError() {

      // not sure what else to do here, will need to figure it out if it happens
      console.log( 'Error: Unable to decode audio data.' );
    }

    // load the sound into memory
    if ( supportedFormatFound ) {

      if ( soundInfo.base64 ) {

        // We're working with base64 data, so we need to decode it. The regular expression removes the mime header.
        var soundData = (soundInfo.base64 ? soundInfo.base64 : this.sound.getAttribute( 'src' )).replace( new RegExp( '^.*,' ), '' );
        var byteChars = window.atob( soundData );
        var byteArray = new window.Uint8Array( byteChars.length );
        for ( var j = 0; j < byteArray.length; j++ ) {
          byteArray[ j ] = byteChars.charCodeAt( j ); // need check to make sure this cast doesn't give problems?
        }

        this.audioContext.decodeAudioData( byteArray.bufferBuffer, handleDecodedAudioData, handleAudioDecodeError );
      }
      else {

        // load the sound via URL
        var request = new XMLHttpRequest();
        request.open( 'GET', soundInfo.url, true );
        request.responseType = 'arraybuffer';
        request.onload = function() {

          // decode the audio data asynchronously
          self.audioContext.decodeAudioData( request.response, handleDecodedAudioData, handleAudioDecodeError );
        };
        request.onerror = function() {
          console.log( 'Error occurred on attempt to obtain sound data.' );
        };
        request.send();
      }
    }

    // @protected {number} - rate at which clip is being played back
    this.playbackRate = 1;
  }

  tambo.register( 'SoundClip', SoundClip );

  return inherit( SoundGenerator, SoundClip, {

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
} );