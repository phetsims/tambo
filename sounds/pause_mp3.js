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