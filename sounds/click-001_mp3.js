/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABriDQRQRgAEmkW2XHpAAAJQAAHgAAGAAAABIDu4cDd3/r/1wAAAAAARC/9EREd3d3PQDFg/D/lAfflAx/BMH9QP/ghBDaMSKQDL9Jl8zrxkLJ1driXbAMCtXKORoVLbBiwvIKx8m21HBZEfMq/0x/+KVG0Sv/////Uc0dO+i8Kkj3feKlhICwuZ+X8KkA4p+8BQpQAET//syxAOAB+BfSzzDADDmiiFBjAzgIQWVhDQDISg5HQzTHx2LQbHxpFGUeaRR9PJpFGqnPX9VQTICeoDA0eWdqBpYb9GV2lga/wVf/Boz4EawwCWbQYHfhmyxUqUCkE48QHSMRwuglOIhIgJrr1hocKgoLSa/2MFBBwSJBQkaQDIkNVC6Xfi9TEFNRTMuOTkuM1VVVVVVVVVVVVVVVQ==';
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