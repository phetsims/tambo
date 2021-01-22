/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//MUxAAB0AbYAUAAAf/+iMw8fmPV6uZV//MUxAMC6ErwAY0YAVYbgywiyhpYov/r//MUxAIC8FLIAc0AADEYowxSCQDBn05e//MUxAECmF7EAAFeRBbUH0+9i6HhHVVl//MUxAECmHLQAAHSTNWlWwsHywLtMUrV//MUxAECaILQAABOZXQXYVDJuqDQfZe6//MUxAIB4G7UAABShFCQMMPh1dPqAEX5//MUxAUCCG7QAACSTAiDLKrzSAIBGKK+//MUxAcCGGrMAAJKZBTV+dB/hExZk4UZ//MUxAkCMGq4AAPKZKBxxrq4QteNkFhY//MUxAsCAEqoAACwYWqPCzddJn/UMCgC//MUxA4COFKYAACwYHtZlMyd7us4DXFJ//MUxBACaFKQAACeKHZEil/6FeGpfEBk//MUxBECGEqQAAgiJEPvzEHGKNalc47t//MUxBMCOFKIAABeDP9AYKFloV/Cg2oF//MUxBUCOGqIAAgaJIN8jQJfveK6zQCI//MUxBcCkGp4ABPKgE0m6D+bKhQAKABR//MUxBcA6EqQoAAKDPyVf8wVM2V//d/t//MUxB4AsEaIAAAMDPV9fTfd//4x/2Mu//MUxCYCiGpEABAgJO0sv//tchVS+xcX//MUxCYBqAKWQABEAo5iP//9aGeyj+rm//MUxCoCQEYsAABSKH/++IHv5e92rd////MUxCwAAAI4AABEAOKCqteqkV/47//X//MUxDcB8AH4AAAAAA1Vh354YR/lf//D//MUxDoCUAH4AAhGAEpMQU1FMy45OS4z//MUxDsCgAX4AAAAAKqqqqqqqqqqqqqq//MUxDwAAAIMAAAAAKqqqqqqqqqqqqqq//MUxEcCMAH4AAAAAKqqqqqqqqqqqqqq//MUxEkCWAH4AAAAAKqqqqqqqqqqqqqq//MUxEoCSAH0AAAAAKqqqqqqqqqqqqqq//MUxEsCWAHUAAAAAKqqqqqqqqqqqqqq';
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