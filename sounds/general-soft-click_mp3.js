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