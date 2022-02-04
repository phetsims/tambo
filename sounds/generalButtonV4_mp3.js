/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABlAhPLTAgDE1De+/HoACAH4CwkCAJDo5gDgPRksn2WLHOB8EHShd5cHwfBBwgBBOJw/UCAY/lAxWD/4DB9+CH/6XQjMTIIcYUIQPQIRAIBAACUIawkYq7IQ/BawVqEc7mTjD+OFygBAnHbHq7UkLJ8aCnnrZlPpg3IkRJBgPH/MCQCI985/yAnHAAhmv3lHuAgAgAxJF//syxAOACHQpa7zBAAD8EunxpI3HUCEZHQlA2EYuDsSjE5EkSQGhUDYDxOARLoiBmIgalVgq4qWeWBqsNYKywNO+p/sxFyKwVOlXRFDtZ0S86oQ0C2W+wBOmlaWuS6+BIqZMz+AYy3FuwBkKXM2idVoKlYwUd/oIGgsbLpEbaCsmIyZRtbw6TPwj+mYmGr8QqnGHBLo3LKAAxKabZ//7MsQGAAhsl1OsPMcxAo3mpbCaAvIuuQRmW4WNHhDBJnoBORIlh+I9dvGCTCKP0kzo7rHHTi87diQ2XqnRN77y8lnKUl8zf+X0Fu0iCDV/9AP7el8Cw8raZKqiYShe+6bzYk0zXmEuGnBDcQhyRzPeI4Jbsmj5OxzZVhSX9adVU4Kk9r9esE3etv+/6wUIg3Wm62nA3Ab0EIcLUQ7/+zLECABGICs9oemDMLwEZrQcvFYyDBCUCgUAwQCUSvgROof5poGn9O7o70P/X9P/T+360+lAhIJVtyuNDljXzM7Ek0fGUB/ltZQF8iD7dBcVTs00f31POqR0/V/q/pjEe1z3jyAAQRBHGmSBEEVK6QIYH2miQZKNfgCVtiH9vVLp+w7an/d0jdUx9VnqZIJSvFtsaUFKKFBVCzoe//swxBwABSAhLaDl4nCsA+a0fDyG3vbgKx5OhNXyuPYt7kJJSg9B6heqxP93q/9P6IwSQ8LbYIFBVUF85RwseJPX6+Q7qIq7f/8ayokh7P//V8oyAABbhbGEIBBhOJgEGTBx6KjUiosS54l6y0i3jOz/6f///RVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxDWABEQTMaCF4HCNAmL0EJgGVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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