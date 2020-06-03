/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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VVVVVVX/+zBktoAQwwdI0FgQGBag6TwF5gGDUAstoOBAMGMDouQ8pAhVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zJkwQ8Q1AfDAZtgEBsg+N1ExRMC3B8MAOjAgGGDpHQWCA5VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syZMsAMNQDQik5YAAaIFiNBekAAvwLDaEYwABEgaAQFJgEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MmTDD/AAAAAAAAAIAAAAAAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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