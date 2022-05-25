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