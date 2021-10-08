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