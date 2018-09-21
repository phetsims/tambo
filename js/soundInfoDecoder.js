// Copyright 2018, University of Colorado Boulder

/**
 * Singleton utility object that provides a method for decoding soundInfo objects.  This is intended to simplify the
 * process of decoding audio that is provided through the sound plugin created and used by PhET.  The objects provided
 * by the sound plugin generally provide either a URL to a sound or a base64 encoded audio string, and the code in this
 * file can handle either format.
 */
define( function( require ) {
  'use strict';

  // modules
  const tambo = require( 'TAMBO/tambo' );

  // {HTMLAudioElement} - HTML DOM audio object that can be used to test sound formats
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
      assert && assert(
      typeof( soundInfo ) === 'object' && ( soundInfo.url || soundInfo.base64 ),
        'soundInfo must be an object and must have either a url or a base64 field'
      );

      // Identify the audio format.  The URL is generally used when running in RequireJS mode, base64 is used when
      // running single-html-file (aka "built") simulations.
      let audioFormat;
      if ( soundInfo.url ) {

        // this determines the format based on the file type, e.g. ouch.mp3 is identified as an mp3 file
        audioFormat = 'audio/' + soundInfo.url.slice( soundInfo.url.lastIndexOf( '.' ) + 1,
          soundInfo.url.lastIndexOf( '?' ) >= 0 ? soundInfo.url.lastIndexOf( '?' ) : soundInfo.url.length
        );
      }
      else {

        // The base64 encoding includes type information at the beginning that specifies the format, e.g.
        // "data:audio/mpeg;base64".  This code extracts that information to determine the audio format.
        audioFormat = soundInfo.base64.slice( soundInfo.base64.indexOf( ':' ) + 1, soundInfo.base64.indexOf( ';' ) );
      }

      // Test if format is supported and, if so, decode the audio information.  The unspported format situation comes up
      // more often than one might think, because phantomjs doesn't support sound generation at all, and it's used to
      // support "headless" automated testing of the sims.
      if ( soundElement.canPlayType && soundElement.canPlayType( audioFormat ) ) {

        if ( soundInfo.url ) {

          // load the sound via URL
          const request = new XMLHttpRequest();
          request.open( 'GET', soundInfo.url, true );
          request.responseType = 'arraybuffer';
          request.onload = function() {

            // decode the audio data asynchronously
            audioContext.decodeAudioData( request.response, onSuccess, onError );
          };
          request.onerror = function( err ) {
            console.error( 'unable to obtain sound data, url = ' + soundInfo.url + ', err = ' + err );
          };
          request.send();
        }
        else {

          // The sound info object contains base64 data, so we need to decode it into binary data before we can decode
          // the audio data.
          const soundData = soundInfo.base64.replace( new RegExp( '^.*,' ), '' ); // remove the mime header
          const byteChars = atob( soundData );
          const byteArray = new Uint8Array( byteChars.length );
          for ( let j = 0; j < byteArray.length; j++ ) {

            // A note to future maintainers of this code: The line below, strictly speaking, seems to disregard the
            // highest 8 bits of the character code, since strings in JavaScript are UTF-16.  This seems a little odd,
            // but testing showed that the decoded base64 data never had values above 255, so it worked.  This code was
            // leveraged from examples found on the web, and has worked through all our testing, so perhaps the upper
            // bits are simply never used in this decoding process.  That seems like the best explanation.  However, if
            // we one day run into issues with sound decoding in built versions, this might warrant further scrutiny.
            byteArray[ j ] = byteChars.charCodeAt( j );
          }
          audioContext.decodeAudioData( byteArray.buffer, onSuccess, onError );
        }
      }
      else {
        console.warn( 'audio format not supported, sound will not be played, format = ' + audioFormat );
      }
    }
  };

  tambo.register( 'soundInfoDecoder', soundInfoDecoder );

  return soundInfoDecoder;
} );