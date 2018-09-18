// Copyright 2018, University of Colorado Boulder

/**
 * Utility object that provides a method for decoding soundInfo objects.  This is intended to simplify the process of
 * decoding audio that is provided through the sound plugin created and used by PhET.  The objects provided by the sound
 * plugin generally provide either a URL to a sound or a base64 encoded audio string, and the code in this file can
 * handle either format.
 */
define( function( require ) {
  'use strict';

  // modules
  const tambo = require( 'TAMBO/tambo' );

  // create an HTML DOM audio object that can be used to test sound formats
  const soundElement = document.createElement( 'audio' );

  /**
   * definition of the soundInfoDecoder object
   */
  const soundInfoDecoder = {

    /**
     * @param {Object} soundInfo - an object that contains either a URL for a sound resource or a base64 encoded sound
     * @param {AudioContext} audioContext - a Web Audio audio context that will be used to decode the audio data
     * @param {function} onSuccess
     * @param {function} onError
     */
    decode: function( soundInfo, audioContext, onSuccess, onError ) {

      // parameter checking
      assert && assert( typeof( soundInfo ) === 'object' && ( soundInfo.url || soundInfo.base64 ) );

      let supportedFormatFound = false;

      // Identify the audio format.  The URL is generally used when running in RequieJS mode, base64 is used when
      // running single-html-file (aka "built") simulations.
      let audioFormat;
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
          const soundData = ( soundInfo.base64 ? soundInfo.base64 : this.sound.getAttribute( 'src' ) ).replace( new RegExp( '^.*,' ), '' );
          const byteChars = window.atob( soundData );
          const byteArray = new window.Uint8Array( byteChars.length );
          for ( let j = 0; j < byteArray.length; j++ ) {
            byteArray[ j ] = byteChars.charCodeAt( j ); // need check to make sure this cast doesn't give problems?
          }
          audioContext.decodeAudioData( byteArray.buffer, onSuccess, onError );
        }
        else {

          // load the sound via URL
          const request = new XMLHttpRequest();
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