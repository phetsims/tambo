/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
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