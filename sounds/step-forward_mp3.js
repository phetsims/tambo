/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABBwBH1QRgDF8lysrNPADlgGUqBpgATicPjgTPiAMQQct5d6spyiwf//2iPXb/hjYABVeTpbI22QAAABH4eW2FCzwoWNMfgxZkHQBSeBmtLpK1YcSGQwyaHTQxWj3uukSl6x2xzeMnduTD9wo3mfx/QuJY084SsT5w8L3/+PJT534Gv/q//vtnnbvplPM2aWIIOWRl3Ns//syxAOACITHZbz0ADEFF6ipkwnnANpdGYmCbhIeSEkIOsRVLEOeOTMoVaLB0fQszNPyvXriozO7Wmarq5r+GZha7GBOIv////DV/7N7HVMrByABUlRpAAbUVhIiGKB4dhwvKYkQxEzeXwC8tWghcMgpHAoqzN/Zko1J/CQdnlHPimFCn11ZSloUpP+nc3urcKx0yiAgXJJLImhBtv/7MsQEgAcEU0WsMMjwcwIntBwIDuTKgqRPOMspV6tJpodEYGsFoTE5Ml3rc+fmotyknamARqKIw3p9Tfv+/11W///0glNwSQQMIkA/EyhY1sQ4Yeb2a6/dV/u//0/9X9cJBSSTWF0AsBaEjzNThdq99ZkiQCQqQnnoLkVGngCh7HuX3qeRt3tr0qXs3U+iMyNRN39kA0Yp4qGTs7L/+zLEHgAFuAsi4LIAAHwAZrAAiAYu0M6OeGVyPnvwkexN///+VQw0o4xBmKIAncK1it+zxT+K+tv//s//i6pMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxDuDwwQC+aAMYCAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//syxHKDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7MsS2g8AAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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