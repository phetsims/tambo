/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xDE1gPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7EMTWA8AAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQxNYDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xDE1gPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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