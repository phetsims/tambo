/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
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