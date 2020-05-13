/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../chipper/js/grunt/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../chipper/js/grunt/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABriDQRQRgAEmkW2XHpAAAJQAAHgAAGAAAABIDu4cDd3/r/1wAAAAAARC/9EREd3d3PQDFg/D/lAfflAx/BMH9QP/ghBDaMSKQDL9Jl8zrxkLJ1driXbAMCtXKORoVLbBiwvIKx8m21HBZEfMq/0x/+KVG0Sv/////Uc0dO+i8Kkj3feKlhICwuZ+X8KkA4p+8BQpQAET//syxAOAB+BfSzzDADDmiiFBjAzgIQWVhDQDISg5HQzTHx2LQbHxpFGUeaRR9PJpFGqnPX9VQTICeoDA0eWdqBpYb9GV2lga/wVf/Boz4EawwCWbQYHfhmyxUqUCkE48QHSMRwuglOIhIgJrr1hocKgoLSa/2MFBBwSJBQkaQDIkNVC6Xfi9TEFNRTMuOTkuM1VVVVVVVVVVVVVVVQ==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBuffer = decodedAudio;
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBuffer = phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate );
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;