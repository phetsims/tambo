/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABNQFD7QhgDFcJqsbIRAAAABSjDTssgAGBh8QAg45E58TvnOUnM+XP8uH/7vxPB/lPP/ic+D4TAAAQAAACE9EYA2pu4X0Ab9TBxAe5tAPg6fxS4WQA2p/hjAG7wxWI//8LmBKA4BO5P//l8qLmBFP/80L6aaKb///mBcNC+XzcmCKGn///kXIubkUIoTiEAAAAAbk5X////syxASACLzTYLmGgAEKC6brnpAAq3Lx1jl63jsWdWG3JhgTIvGWGAcpfMqHC2nzE1/zhLD2MR63/yRLxeL1//10UVJGX/+sul1RsXhKd/4NWjkgACW6OAOVCHtEMRJfXUM8X5flVGJkAQksKwgApZETFvXd1T5nSRvYxvEtv64AoaLDgKMB1bhtYlCohlQqyq7/8vUqpOgUiQIEUv/7MsQEAAgYgzlHsMOw0g3lqISM2ihxrIk+hk18yL4nPaNBGC1SORHv6jjwUGJCrRz7JtGpT19yKepsSNV6+d89d0pGPqD/1f0Ufs/+UAFRZJtNKgBqB78wyqKbNcRACNIT6veiFg4YCFZ60KsqicC6EFM0DLO8RajXyxpWz3fnf/oVC/j5roQQDRtbgVULuIyoK4a1o/LZ335GSIP/+zLEDQAEbAEhIIhgMIiAIPQgjAa08j/ypb4dLcSgCRgGBtt1IAsaYdIEY8BJz2WPTx30f1lkfQR15YryPzqupUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxC4DwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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