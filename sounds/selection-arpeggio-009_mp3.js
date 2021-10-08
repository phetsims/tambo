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