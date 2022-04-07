/* eslint-disable */
import asyncLoader from '../../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../../tambo/js/phetAudioContext.js';

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