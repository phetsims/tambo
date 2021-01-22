/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABgAdG1TBADFADe13MYACAAAohuOMAS3zgQAOCITImzAwPFjg0/ggcKBiJ3/8EDn1RAcWHxGf/4Pv/8EJcP4nsGyte1/v+/4oAAAAAAaSAjmR4qSJD/VvoHnbwXg9mMY4gHQ0lNm9WLhlgUDTr8OJYLSrFgGJd1h+sC17kv8/tWt3s5X73jkv5A7/REJE3ZQAGKls4BLY//syxAOACCB5Oz3UADDLhOf1t6SWAgAYZkAaAwUYgoaY7BWVgQDQAQWYavX4ejL+4Oi4oRGsMEfj5VaZtpooo5ir9r+VWvRijpjP/jf/6CAU025Ha42BDqukhTB2g5suGgMJhHmInEyvf0KhMcw8W6QpCjz3pjGvI2b/vVcz/X6k0AAkGpawGwFB9d9DHg7YRlLEIbhiketFAobas//7MsQNgAUUIzWsaKKwpAGmdBNgBrqS3/9q/puX///+ztywABTFtcbTSAIygcM9KQqx79w2MYServs7W+j+ZTYeSO5BKnKc9NW7I2UABCWStsJEwMFYLQSlgDT14FLQo+efEtkNepbfxEt/7s7/92n+HRLBqS3XcABgaGmhBQsohZZMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVX/+zLEKIDFEBElobCgcDYDYBAwjE9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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