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
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError ).catch( e => { console.warn( 'promise rejection caught for audio decode, error = ' + e ) } );
export default wrappedAudioBuffer;