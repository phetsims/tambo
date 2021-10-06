/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uQBHkP8acFtzmLSAA6YPbDPYYCAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
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