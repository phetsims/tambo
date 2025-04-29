/* eslint-disable */
/* @formatter:off */

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