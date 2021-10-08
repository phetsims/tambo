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