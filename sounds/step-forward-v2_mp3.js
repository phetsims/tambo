/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAByAnDnWRADEZkyy3M0ALJQcEAMk013znpOVkWGNCg9vD4oJlTQcNxQBIJ0PxSUlJSCwfB8Hz+CAIAN/DH/gg78EHS7//9QIJSLq/wFHg+AwFAAAAAAfFvo6+SmoCLgXFVlJaBRlrks8EfgdfwNGNDIX1icAtgSPunkTDV42yCf+OWMmXBP4hJ/+RAZg8nmowgLA3CbIw//syxAOACDxjRhnXgAEOCqVnuqAERLIypm8wTCMyMagDMoYEAyRAAgCAQ9za/ELra7bNcNI9BMVmPx3pF7P7a/wstMTOL6//gwrwjSeVKioAAkqgEBggJpjMDZgiPBm+0xy7jJ482ppET4kOhhSHhg8CKMhgGASP09uliMpAaC+Gyqiiyjd9/QiJjzxL//////p9lUBqv86UKJp6wP/7MsQEgAWgKTMsbMLwvwUmdaCI3g146KXMwJVAHDYhAjvxQKf+SIBJPJWbIrZ/1aVs/k7Lf2//7QQilFbJGkVBjWeEsADYyEamuw0dNdmGxS1qmJCrAKrGJZ+TX/V+1zX0fitWyROXKQQiijI22kTAod9keTOhUgChZfu1VSXOv2ubHdG+h4jXu2fLMV00rQvomqNH8kAAAARGFj3/+zLEGgDFrBkvoeWAcKKCYxBngBYhtAWgNUjlVDuFH+de4qlT5ENEZ7/8t7K3cKjB1Q/kmOcRTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxDMDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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