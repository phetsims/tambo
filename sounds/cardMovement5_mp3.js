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