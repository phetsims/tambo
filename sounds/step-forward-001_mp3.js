/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAA3ABGbQRgDFIkql3NTIC+1lA1tFsoABwHz6kh/hjYUdVOf5/l38P8o7hhWK6TS0XW4fUSgATegDDcDjgU8BA3I3PrTmIFIo90bXMfN8MMKBW6bgahB8vqRADOF9BQtt+IBhfdAi/6d4X0GuKXFKDr+v83Ynfv//6fL2ev0IAJuXbXbfb8YAAAAAAAUANo4RjGQ3EzjAD//syxAyACoB/X7mcABj7BeSfupACnb6CnRKPaBauGktImUd0mgQ1rz33uIeQG2GAbdLjvRcYIE4LqQzKb3Mt84zliMEOC/ONTLnP//+5V+QDoITYeBgMGZhMLpmAnpwF8p2slBiCABgYEphAB6ELMkVnGi1uWtJlUNAZMQRWkrXiYKuEv7rP9ztbf//o/6ogNtsXACiBwU7TZ4GJTv/7MsQHAAUAIzutYGSwjIImNDxkBoFVeA46fDbw3LK85AE9LSjE//1///q///+QCCKaGAEgaEFBJvgJoHRpIjcJmXKPcL//165P/97hr/6v//dVMyIFeAh9gBQwAiM8cwYLS6kJqVpKyzxDek9f///u0If///0AAIUagSRsGDmhSLQFEcCxk7yTP553R953JFvV////63R6TEFNRTP/+zLEJQAEbA074L3gMIUCIzTGFEYuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxEaDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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