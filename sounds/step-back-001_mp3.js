/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAACBdgXC6hlIHD5DGLN3IiiAAABDgBdsAAAOC2aGR5FGXKEXgYaEgoXA715Tr0kOsd9YE5fnCA3ei6QAeXWU7wAGJODEgCzCcejKQGTe/JTsFoTDcgjQxMMpJ951+v1FJK48QnOEI2ftyMr1HbX4Rv2dXR/6Oj6Vh/Ll4fnKAAG7Y7bGAAAvEydU8DTsa3ZCdfjqYWBIghZ//syxA0ASsB/La7kqekGDSy1hiZHswNqCK6RYqQcTRsJFlzCWHlH5BIa7luNbj0Uzf9yF2NFXutBmLfv5T2HckFZrFFSclAPFiMUeKOf9BQPQD2+/+2o61lQ4xiSSuu5LwwCFqlypTDIKjDAJ1S6OtzXCikjavBv4pPuQJwOg8BYEiI/jKI6cRsTYPtIVlaTgGCVAUVwEuNOAyCV4P/7MsQFAEVkHytGPSBwd4TdNJSkljNA+xTgmETF+0mlBzGs+eiVYse9s9lou6d6bf9f8S/5FMkTc1tgACIUiohLCFZMPB4jQD554MkyFUMuios3F0xBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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