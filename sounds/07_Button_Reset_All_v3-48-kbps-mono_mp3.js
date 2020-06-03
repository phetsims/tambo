/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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jHRGBy7/+zDE7ABJFSD5AJk8SPwj36QRm8EJIEIACQTZzPVGtP98a7XZ73f5/53iBKxzMIE72ndLLtq38c9NBKTcY1/qQYgIFWrdHkQwMBkjbCTDEEqACaZFoDOGKIUKTEFNRTMuOTkuM6qqqqqqqqqqqqqqqqqqqqqqqqpJFYHChOEMhIIQ8nxROKHxCElyEIQVkIQheQhC/k/IX7H+x1n/+zLE64BItSL7gKTeQROkX2QRG4CZhRqqswEKNgzYUBAV21CgRlGZdWYMBClBCgrbCkoKDUxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxOoACF0e/SCEz8kDIp/kEI37VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsTsAEgpJP0goN5BFyQfcBCZ+VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDE3gPIfRbzAIRv2AAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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