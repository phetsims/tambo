// Copyright 2018-2020, University of Colorado Boulder

/**
 * The soundInfoDecoder is a singleton utility object that provides a method for decoding soundInfo objects.  This is
 * intended to simplify the process of decoding the SoundInfo objects that are obtained through the PhET sound plugin.
 * The objects provided by the sound plugin generally provide either a URL to a sound or a base64 encoded audio string,
 * and the code in this file can handle either format.
 *
 * This object caches decoded data and decode requests so that each sound file or Base64 sound is only decoded once,
 * thus saving memory and initialization time.
 */

import packageJSON from '../../joist/js/packageJSON.js';
import shortSilenceSoundInfo from '../sounds/short-silence_wav.js';
import tambo from './tambo.js';

// constants

// {boolean} - true if sound is supported, used to minimize impact of sound loading when sound is not in use
const SOUND_SUPPORTED = packageJSON.phet.supportsSound || phet.chipper.queryParameters.supportsSound;

// {HTMLAudioElement} - HTML DOM audio object that can be used to test sound formats
const DOM_AUDIO_ELEMENT = document.createElement( 'audio' );

// sounds

/**
 * Map where previously decoded audio is cached.  This maps either sound URLs or sound base64 references to an object
 * {
 *   postDecodeSuccessCallbacks: {function[]},
 *   postDecodeFailureCallbacks: {function[]},
 *   decodedAudioData: {ArrayBuffer}
 * }
 * This is used to determine if a given soundInfo URL or base64 definition has already been requested and, if so,
 * either provide the data immediately (if it's already decoded) or queue up the callback (if it's not).
 */
const audioDataCache = new Map();

/**
 * definition of the soundInfoDecoder object
 */
const soundInfoDecoder = {

  /**
   * @param {SoundInfo} soundInfo - an object that contains either a URL for a sound resource or a base64 encoded sound
   * @param {AudioContext} audioContext - a Web Audio audio context that will be used to decode the audio data
   * @param {function} onSuccess
   * @param {function} onError
   */
  decode: function( soundInfo, audioContext, onSuccess, onError ) {

    // If sound is not supported, substitute silence for the sound info object.  This reduces memory usage and load
    // time versus decoding the soundInfo object and not playing it.
    if ( !SOUND_SUPPORTED ) {
      soundInfo = shortSilenceSoundInfo;
    }

    // parameter checking
    assert && assert(
    typeof ( soundInfo ) === 'object' && ( soundInfo.url || soundInfo.base64 ),
      'soundInfo must be an object and must have either a url or a base64 field'
    );

    // the sound name will act as the key to cache entries for decoded sounds
    const cacheKey = soundInfo.name;

    // see if a cached version of the decoded sound is available or in the process of being decoded
    if ( audioDataCache.has( cacheKey ) ) {

      const audioDataCacheEntry = audioDataCache.get( cacheKey );
      if ( audioDataCacheEntry.decodedAudioData ) {

        // the data is already available, invoke the callback now
        onSuccess( audioDataCacheEntry.decodedAudioData );
      }
      else {

        // the data has been requested before now, but it not yet decoded, so queue the callbacks
        audioDataCacheEntry.postDecodeSuccessCallbacks.push( onSuccess );
        audioDataCacheEntry.postDecodeFailureCallbacks.push( onError );
      }
    }
    else {

      // This is the first request to decode this sound.  Test if format is supported and, if so, initiate the decode
      // of the audio information.  The unsupported format situation comes up more often than one might think, because
      // phantomjs doesn't support sound decoding at all, and it's used to support "headless" automated testing of
      // the sims.
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

      if ( DOM_AUDIO_ELEMENT.canPlayType && DOM_AUDIO_ELEMENT.canPlayType( audioFormat ) ) {

        // create a cache entry for this sound
        const audioDataCacheEntry = {
          postDecodeSuccessCallbacks: [ onSuccess ],
          postDecodeFailureCallbacks: [ onError ]
        };
        audioDataCache.set( cacheKey, audioDataCacheEntry );

        // define the callback to use on decode success
        const onDecodeSuccess = decodedAudio => {

          // cache the decoded audio data
          audioDataCacheEntry.decodedAudioData = decodedAudio;

          // invoke all callbacks that were waiting for this data to be decoded
          audioDataCacheEntry.postDecodeSuccessCallbacks.forEach( onSuccessCallback => {
            onSuccessCallback( decodedAudio );
          } );

          // clear both the success and error callback lists
          audioDataCacheEntry.postDecodeSuccessCallbacks.length = 0;
          audioDataCacheEntry.postDecodeFailureCallbacks.length = 0;
        };

        // define the callback for decode failure
        const onDecodeError = decodeError => {

          // let all registered error callbacks know that an error occurred
          audioDataCacheEntry.postDecodeFailureCallbacks.forEach( onErrorCallback => {
            onErrorCallback( decodeError );
          } );

          // clear both the success and error callback lists
          audioDataCacheEntry.postDecodeSuccessCallbacks.length = 0;
          audioDataCacheEntry.postDecodeFailureCallbacks.length = 0;
        };

        if ( soundInfo.url ) {

          // formulate and send the decode request
          const request = new XMLHttpRequest();
          request.open( 'GET', soundInfo.url, true );
          request.responseType = 'arraybuffer';
          request.onload = function() {

            // decode the audio data asynchronously
            audioContext.decodeAudioData( request.response, onDecodeSuccess, onDecodeError );
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
          audioContext.decodeAudioData( byteArray.buffer, onDecodeSuccess, onDecodeError );
        }
      }
      else {
        console.warn( 'audio format not supported, sound will not be played, format = ' + audioFormat );
      }
    }
  }
};

tambo.register( 'soundInfoDecoder', soundInfoDecoder );

export default soundInfoDecoder;