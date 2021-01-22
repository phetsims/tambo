/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
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