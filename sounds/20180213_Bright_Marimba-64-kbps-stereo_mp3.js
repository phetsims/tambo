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
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError )
  .catch( e => { console.warn( 'promise rejection caught for audio decode, error = ' + e ) } );
export default wrappedAudioBuffer;