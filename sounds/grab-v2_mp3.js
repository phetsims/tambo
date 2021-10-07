/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABognHnWRADEriei3OrACCEgYAPOkFXghY6uD++Piw3kA4B4y7hchMBxIxLKSksCwfB8Hw+7wfB8H3/E4P+GP/++D58AABoNsRiAAegAAAcAAwfGEzHKEwATU0FYIw6Dg+OLEOCqwYUAazcxYAwgAWZl5g4CTyjQM3o0EQLO/PjeedH/0g7/quk7v////9CoAAgKS3agA//syxAOACFhpYb2WADkFBWUpz2ROAUr4AUY00DNWPwkiueFpjWamdXncJm4WSUvPYHtdLyIybUkqNbEdOAeIJqJS89odMGRdRGULsKEKKu9sAAFgQA2oDCIoIgGYfBxqSpmFgSkaq7FxnJizGCsESGsoBS/52SlqFCkhXIYlBMPwLKiSRYVd1f///7f/lUfvy2gAAL45ZHAEVS5wEP/7MsQFgkd0HRVM9wJwooOhqMw8TrAOxggWZrdB4KswIKoWwjoMDKpkDpawRH8EDMvQbb5c2fQ5IXBwEGakBD9/3/5ub1lQm4/cLYHDTARtPRS+xTotNKqDqFAVBUFeVBUFU4lBYO8sDQNB3iIGqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+zLEFwPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxFsDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//syxJ6DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;