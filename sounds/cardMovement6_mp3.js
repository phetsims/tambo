/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAHAAAFtgAkJCQkJCQkJCQkJCQkJElJSUlJSUlJSUlJSUlJbW1tbW1tbW1tbW1tbW2SkpKSkpKSkpKSkpKSkpK2tra2tra2tra2tra2ttvb29vb29vb29vb29vb//////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAZ2QgAAOAAABbai3mdtAAAAAAD/+0DEAAAEBAMHQIRgIJoDZTQTACQvg+I4ALR0BFF2GWWjKCftdtcj////rRrR2P/x3///9ZKQQSjMiAYeROTFDCZj45PJbcoc6LQwFgQWDmo5///93P//6f//Sgo21JZt9ZFBVuDA0hEViMDPHqcWnkMu33digjBmvVsJBAPFt4jy/q2KHBYVuuJ1dz9XU/bEglnAIKWMY5u6+A4YPKn/vznL7zkvpcGlg+fp5sYp23Yf+j927v/7QsQtAAtsmSu1hgACERhrdzOSQqKRqJ6HM6r16bbW+TAAAIFpfkD5iXM4DCUrIMRNGtCUAaPQgoDzjAgjSGJMvXQfqq13SdZicPXwYAAkzJHikErCM8dONU7Xi26KdGlfAkQvxXOxjm79ufceeSuf1cz7Net8ynK2T+RyHMMKSZjVSzjr9Yd3vv5/zfO16+sbwPpsxZTRthdVl7ZpTDdDH4IZAyhXLdmZt3gpxAbFT5fCKq7PTv/7QsQOAAyUmVwZjAABPxVr956AAgApGVNWkZRZbQucZmMwTpBps91+hkDaN5pAF1g5zDWQ9qc78vfyBGvv+yp03tuyH///9+6F359+LD6wE5U8JvDBQMBQsWPeOM1pkEAAAJS8AwS0Lcpz1IMyEvbzSbVEuo7WzItXgDBkEzgyAqKiaVMPHhypojgRs65rOqYLFL/pYeA5mpXVY7vrma//KzLTY7WbtI/qXE/i6vmlEACc2Agl1P/7QsQEgAncx1VHsKuRLBmp9PSVurkQJIk1RJOVwXFUFGSM4SVonF1p2o0kVbrFSswuKyDDUuVPTqNnNZxYodW6BJ7KrJtGw6iFHNuj/VpDe64qg2mNLFjS45UbTJBBCTlwAgBHSEHkjUQnlUOH85UJUqVRCkEXnRaJWMNItaRIlkU7m0J8SaanbJImo+cXSRM3JVJFu+Hd4RaJSXdvFWT0qX/H7yWueRASpZaJEUQpLjpFtHKS1P/7QsQIgAnAt0FHmE2RD4zl9CYYOOq48jUHqUSZCUgCTImEgI8o6atHmzj1BGIY5K0Thzkv/5oUK5jP7QSAQ1lR8yjPhjFGcrX9P4O7o/6kZKgKSJIoAm27fwLyqXgAgNCoAw8GRkPx0JR+HpJXsmLAUkE5rke212CsqfW83O8mo/WCpUMlpKMBp/0ff/bZ9/yAut3/0IAwSSmo5RBucmaREpViZrAWNobYKMGAlGAniIGhEBXHqv/7QsQQgAVwTyegiHBgbQBhcBCIBrfq//R/////8VkakCW2mNgQFIxjBkJDxoClR+qx2r89////+7+mNpBqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7QsQ+A8BIAgANAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;