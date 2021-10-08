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