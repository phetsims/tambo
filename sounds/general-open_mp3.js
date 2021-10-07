/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABswbPzQxABEQFyzDMlAAAAGoGRIdz0AAARQAAAAAMCd5QEAxBA4sPlz/BAMfw+ooc8EA/EAYKAh/qBBYfwfD4jB/4nD98ZXetEKIxIqnuursF7pTGkY4dNYcaZhOjzgxDNndb75ggdCsIvV3qoeM9HIX215a6Hftuc5FhwFRhvuJuhxbMPp+ir0KlAaCTHVtZuCsLISS//syxAYACGhJXR2jABEVIGmw8YpieZwGg6y5/p6bf69uls4kMS9HVvrXl8hI5WPBY8FawqGh3PYlLA0HQm6ZHvUe/4UB4ChNzls1AZIAAxJNQMBOy4KAeSsL0QgRcxFInzpyhsQ6tvdvaM160ZnbY/2bY19dTlJVJmhrQpT/Vf0eVjfzG////6PMYzmtqJdg0WqADvRwaGDBgBO5T//7MsQFgAkEZSA1swABDRYvdx5QAhmAEZHdFc2HHLBy/LcmfqWvq1yftVsQSJAxzSi25i5w6qqvMy/cjgNSoKu2Q1LHp1S4NCJQsHfLUSINPxK6oxocyIhmMRkMhQAQBuyhLerW2u5zoV4af2nULcHzwOiPxQjFU/nvIyflMKARabfnQqGI/v/FAIV6UJnPAgAca//9NZUgFEnVWuP/+zLEA4AIVL1vnYQAEQkIajDMpMja7T9a7DL+uzSEg2RRajlNmUzFPCBtL7Uyoa/iVlabnj1+Pi9f61X5WuJ9V1XhkOmtYltLGPI1//8s/0PMAKmLuWQPy0Hrh0Uy4C5MCaWoC5bwOjrQpVOQIn9JNDksr2zEBLvAp3LCI8Is9BX1FTsS50j5Us8OCIqEg73ZZ9QByyIAiddlUPU0//swxAUCSEyXLMywatDDBOHA8zBIRfBtlFDU3P7EItHsWE51WgaTVpJLPMzOMYE1qUSth4pRSd1WkZLqqrnGPUobBm4oDUDHol//+rJBUlwL0rYuAoOSuFITEsfTp5a46IhKRBQ6FQkBQCWJESR0KhIeNASKGnsJgJCf///1VUxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVV';
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