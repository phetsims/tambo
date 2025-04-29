/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAHAAAFtgAkJCQkJCQkJCQkJCQkJElJSUlJSUlJSUlJSUlJbW1tbW1tbW1tbW1tbW2SkpKSkpKSkpKSkpKSkpK2tra2tra2tra2tra2ttvb29vb29vb29vb29vb//////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JARPQgAAOAAABbaDO+ecAAAAAAD/+0DEAAAEQAE3oARgMScPZvTDDcgABsSSuAWSTespWBIRfLobjQI3/+K+ox/vr/RZ/9///+zrUlkraALTssB4lAeVgoKYBz9OWR/ODSw5oyRDKQIEEJ0homEUDiEACN3hbk76E+6adgh0u8QCTJrBeTLwQE4fE7jnlzec+1zyeJEJgAAWpiQ0zdX6fszQCEIIwcdAapBuAmClEnOKdxUhyDcMhRvkIfqhMOoKFpnZxsczUOcMQP/7QsQagE902zksPSmJOo1q9b0k8WCQ9ElTDahQcjqCuF21xpXUd20dBsAiaYXPFxORojHf0AUZbQIIYvk7//TejfWfKgo2IDLcDLyD3e2vpog7+vcZa9t6/p8gXueKcCgHNs/SmNSchJ5KzU3i6F6BEQN3nO2POh8KZBwe4CLl41N06ISwNBcKGDXPjiOjWGBohLVK0f13gmTow23esI0dwiuxNRguTtOBFbGC5C03/QPw0tr7cP/7QsQGAAo8k2uMsFJxSJVsNPYhIoUobDMM9aUI5Q1EzwTRANFhAoe2QSVvbiw0HQmAucx5fk7BUpjqII68wZI5EIwUraEs9mZHVfWmj0GC2IvuvGEJKLq83x1ZKBQACbcjgJwUiqN0nRejUQBpMxwJJQPA9iFzbK3E1i4vN0PqiuYT5Q0bDUhITAKGoLRY7UUW6cpLr9k5pkr76lxmaQqLXzqLa6vpT+lMPJsrkDhAQINTjjCwTP/7QsQFAApAb1mmJMphOw1p8MMNzBzBoCJYH4FXwrIZ8MBcPCwNh8WCnEjZCiRZZFGd0si+U1b63kT0aRIJVCpEeGnLReDQEEgVHsMqXXrI3Vr2vfQoeDCFrkfR6agAQEA1WsD4WzsYtAsEQNhKBqJ7g/E7gLB82UJHafJY0RUm1t2N9WIXsFQ1jC0mGuSFgqBizOTiJIcWEMUGZtamUSV6SSCXYiy9yhyns6HohpkFRZEOZiNgkP/7QsQFgAmgX0cmGE8hTApn8JYYNBAKiuSBYXiGDU1Oi0r4kEmGynCWGsTIq35h1F+jZmoUAmxUNC6CyWEoTAR4QbhuqP3Wp1LnrhU61Ck6nPZv5fK66Sa0k0RIqisguB8ISMBcFR8LJQHwdyiTTssKjrqFJuifmTOMjiN8jL4XGNBQCliZFodQgqlEswSn5tBWVFIsVP3InR53Q2dJPVlZG5BbWRaDX6/rACJjiBTcbSVal9EJA//7QsQGgAmMiTWnsGPA7Q1mdBYM3KeByA0VEEdCeZnoxXCMwnPT6B+q5bqxxqJzcBKeXVx1Vaimz+RR8KTAg8bCrThFdT4o8jbJWy2l+V+m/6n+jSAVJLLHbW0Ha4mIrCKKh2fdsZM91BRqoY41Umq9I0FNmCAVhtQomWFpGe2w0IvDVhL9P///SR/+zyNMkqVgGWrHJLdu1SEMLDjWPdnt+ir6f/S3yvlS2r/nvlud///6gBRMQf/7QsQTgcRoARmghGJgBwBAAQAABE1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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