// Copyright 2018, University of Colorado Boulder

/**
 * Utility object that provides a method for decoding soundInfo objects.  These objects are how PhET specifies audio,
 * and generally provide either a URL to a sound or a base64 encoded audio string.
 */
define( function( require ) {
  'use strict';

  // modules
  var tambo = require( 'TAMBO/tambo' );

  // create an HTML DOM audio object that can be used to test sound formats
  var soundElement = document.createElement( 'audio' );

  /**
   * definition of the soundInfoDecoder object
   */
  var soundInfoDecoder = {

    /**
     * TODO: Finish doc
     * @param soundInfo
     * @param audioContext
     * @param onSuccess
     * @param onError
     */
    decode: function( soundInfo, audioContext, onSuccess, onError ) {

      // parameter checking
      assert && assert( typeof(soundInfo) === 'object' && (soundInfo.url || soundInfo.base64) );

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

      // Determine whether this audio format is supported.  This comes up more often than one might expect because
      // phatomjs, which is used for automated headless testing of sims, doesen't support audio.
      if ( soundElement.canPlayType && soundElement.canPlayType( audioFormat ) ) {
        supportedFormatFound = true;
      }
      else {
        console.log( 'Warning: audio format not supported, sound will not be played.' );
      }

      // decode the audio information
      if ( supportedFormatFound ) {

        if ( soundInfo.base64 ) {

          // We're working with base64 data, so we need to decode it. The regular expression removes the mime header.
          var soundData = (soundInfo.base64 ? soundInfo.base64 : this.sound.getAttribute( 'src' )).replace( new RegExp( '^.*,' ), '' );
          var byteChars = window.atob( soundData );
          var byteArray = new window.Uint8Array( byteChars.length );
          for ( var j = 0; j < byteArray.length; j++ ) {
            byteArray[ j ] = byteChars.charCodeAt( j ); // need check to make sure this cast doesn't give problems?
          }
          audioContext.decodeAudioData( byteArray.buffer, onSuccess, onError );
        }
        else {

          // load the sound via URL
          var request = new XMLHttpRequest();
          request.open( 'GET', soundInfo.url, true );
          request.responseType = 'arraybuffer';
          request.onload = function() {

            // decode the audio data asynchronously
            audioContext.decodeAudioData( request.response, onSuccess, onError );
          };
          request.onerror = function() {
            console.log( 'Error occurred on attempt to obtain sound data.' );
          };
          request.send();
        }
      }
    }
  };

  tambo.register( 'soundInfoDecoder', soundInfoDecoder );

  return soundInfoDecoder;
} );