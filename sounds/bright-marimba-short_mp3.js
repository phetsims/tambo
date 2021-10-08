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