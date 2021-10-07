/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB3BPLHWkgAEQCy03MPADAYAEAMYCIAZnV5vYJv2ZoxqgRhBhkBBkRJhwZa9g7/tbYe1+jC4beogQMZ4Z5zn7mgQQdxOH//////6SQAIzbNJJdtgAAAAAAHjcV2B1EBJLBB4wV9rCWp5eq0EHE43FpgLhkjdNEqGhFqhSQlQ4TwqZdZ7fN/Hm6YKiu/33NoUAACApAAAI//syxAOCSGxzQ123gDkDjCZJvLDmDQ0HhMRgBVEjBws2OIM9Cky1VU0REAhgK47nqWwHAkIYcB7ePHvXeo2cV1nG4uL6rjXjzXt951bbjQs/hQuyxEeFQaEGUgRohuYvQkhIfrBnlFyQoUla/qMye4qGxUqjhxTJIFPCOfamTewcOH2SkYCFVa21OLZrySygx+bV4B1xgBhA1DB0Bf/7MsQFAAfISyw1x4AxL4ssNzGAAigYRigH0YoI18mGQKOgZ+FY0UWnyRsLJgZYCShStOpdQYKdeV5/q9jbIDYPkLAYtiTETvrZLIYEb2u2uogAAAAAAhkChusjjbfkXleOGpiySKjhjUIlMla3JEsHQqgBs2ns50DIPtDIgjJE46JnUPRPPPOG5G8/yKxQADAZFTP1KgAAIX0AGkv/+zLEA4IIRJ9DPaUAMQuN5o2tmYqinck4ucZbhxEBHFls3WFfhr6dyvz3zgxEmEABChAREwQIwJRfc1jx6QHFWNNqQkrG5wvNNbdf1b//kxUACACHIGAlgmUgpccbebl+BkKCZXQyCAwpKkwRUzEk7AIAwgTBahUNNHisAuFoYmM12rXbbUJ2v5Cwa++fDf///+mgDERUoJgUemjg//swxAUDSExLJi3phxEQCmQBrbx0BkCOdSyG/xxiJyFwYUOAZiABRh0Zh64k8Pj7NAJTjWFStFgyvxBK5IhTLDstCt9Y/SAqpLqiYU1gRqYoIfCMbtwYtoG77YMaQdBGoPhoQOPIxjIsCrswBnOHTzqNAI9TIQEiAQc0oSX9JssKWBt5O9HJA8fEWBHxeXEQzXUAKsQAXwMjEM3O//syxAUCSDxVLM1lJzEbCWPFrmxBNqHM4RC+k5ZUzwUcEaSmKZZCdwJRBNZkJiwDdFN36YdSqdqUT6pYDZ5ScxSDVfZPSpL8M//b6NxDNtjDhTpxDmMDKQMMw1k08tNDTxrGMKLQxRDCMevDKlACBZi1WYsoiEOBwEwdI9e0vdBptNKZfgzJsVH29qtOpUET8k9v4mAAAExTEHgUKP/7MsQEggfQUyJNc0QA2AklmY2YpukjMG6N4KPFG4xmOjdBnIQqBgcbgGQGmcNGdaHtBQplqcsNdnbkroa0zXiUXxyr9wz/WF9usagQAkSHDHulGU3DjA44xIgQwADplHVAGUl7G/MbPAcXSMAgRGUSoN9OUp+zGuLf///V3//+ugKcCSTofFaj5oNcoyUgyJfAIDMwsQBGeEBQiGf/+zLEDgJHUD8UDOksQN6F39wxsAA60sBDGHr5bR5oZBEMkscKhnEIJPCh6j//////+n6AmBgKjhFZNEIgmCyGD2UQjAVEweC2peqxVyOIpL/WDXZ7cNcFTtQdJCEFQVGLPFgaUHJ6dhojDlVttOCJU4BB0qsXplV/tncqptv/p//+n//6abf////9QTTTTRVV9UEJK0kIixWmqoc///swxBiDxvgCi4CEYAgAADSAAAAE/1TTVEWK6UxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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