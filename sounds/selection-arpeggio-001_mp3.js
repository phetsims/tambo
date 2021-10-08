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