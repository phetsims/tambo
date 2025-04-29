/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAESAAzMzMzMzMzMzMzMzMzMzMzMzMzM2ZmZmZmZmZmZmZmZmZmZmZmZmZmmZmZmZmZmZmZmZmZmZmZmZmZmZnMzMzMzMzMzMzMzMzMzMzMzMzMzP////////////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAL9QgAAOAAABEh5r/JTAAAAAAD/+0DEAAADgAL/NAGAMfOm5rcjMADuCgQCmgXiB0ufBD4Y///2l38n+CEEP/hgo7+UCgebigmUztQuDYDAQAzREkBkdy8E8H5KudAHAgi0gpfDlCPtMyAjLiPwDUgBbflYZsh44wLDCysCJwGl9TEEd2JsT4VCIA2DABgfuT5wqE4dADIAU8LNh+YvQ+D+mm+mmMwNAl3DLYyhX///MhzJcM3UyH///p2Jsvm5o5bk9KIMhAEAgP/7QsQEAAoIiVe4xIABRBJtaxjwAoAgRGwACRRy9iIhqI+Pj1pbLJ+ynNI4T28qKJtbBGqs0hR71aRv6ycsJ5tL7LkJFcoDsL2uttJmSPnBAm+NyglGvgNGr1Ot4ymSTRCQoppiUAAABpvCdhAE87hGsEjIn+BYwLZJfzqdTjqGBut3NnwFoBYDNk3i2n6vjj/UbAwZ9v4kOPfq1tks/3//96pqnVjAmMt9UM1gayqxogAAAAzfAf/7QsQEAAoQf2O894ARPhUsdPMJ5gHxPxRE6XRxHYhptrbfHYk9PFXQ+R6R0rkuJkxTmLE4q5TM7LAVTjWSt9ZrX2zr7+a1r8Qv/mLXHsPeqVcITLzINLLIaKjpbrsUSRBQJcsgEVtZSM8upNDrOVjUiFF1b2pLPC/I4CoE4yh7IEiWJHHLmFpEmf4Al/8hkQNR8GJPdSujm2YEsAAu8OiYioWuB1Dq7kIq0ZWSdRaZCAKbjQdWov/7QsQFAAm4p1OnmFKxKhPm9MSNmOSVgEBQLYY0ZDToN+PKrWx3F0+Zn0GVOu8JNVdJ5awlVa1MpXVpUcWpDborcF19ZWCiA2GxDW5WfTBqlSmNYr913/+gKBlEAAya2bbK5cZB2B1EfA6IpqJSYy4JIliEhOIiZCqKWlkUVxJGBAW1wpGRmsXY+qVT819nX7DXDMDUDFTqgKMe7R/+//6f/WMqgLbakkttF2DV6dEGDkXyyOPkUP/7QsQJgEYUUzGjBMwgWgAgtBCMBgjxpz4+djiSyMJGvBIklsBUs+sFXc9///t/T/2csUIE2IGNg191QtVuV6mdZkBCwszFRQ1VTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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