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