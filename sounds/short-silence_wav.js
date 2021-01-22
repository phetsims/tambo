/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/wav;base64,UklGRtQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YbAAAAAAAAAAAQD+/wIA/v8CAAAA/v8CAP7/AgD//wEA/v8BAAAA//8DAPz/AwD+/wAAAgD9/wQA/P8DAP3/AgAAAAAAAAAAAP7/AwD+/wEAAQD8/wUA+/8FAPv/BQD7/wUA/P8CAP//AQAAAP//AQD//wEAAAD//wEAAAD//wEA//8BAAAA//8BAP//AQD//wEA//8CAP3/AwD9/wMA/v8BAAAA//8CAP3/BAD7/wUA/P8DAA==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;