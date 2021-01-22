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