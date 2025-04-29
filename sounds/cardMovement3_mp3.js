/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAHAAAFtgAkJCQkJCQkJCQkJCQkJElJSUlJSUlJSUlJSUlJbW1tbW1tbW1tbW1tbW2SkpKSkpKSkpKSkpKSkpK2tra2tra2tra2tra2ttvb29vb29vb29vb29vb//////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAKXQgAAOAAABbbRnJZqAAAAAAD/+0DEAAAEOAEZoIRgISwJ5rDBDgS0nIhIJBBRykD5NglUNQTfry/f/v//+/SQ+n8b///Hf/5N2aSuUSTSBYOAgBuhCAEAJmYiMvCQeBIYKMjZM14t2zruxUDYwgA4g8+IC4fOBY4XED8oACZcPy4nAgIcQCAP8p7+SW8u8nyjin5RIBAEsV1/YMKgnczD9G2oF7DqswGsSx4BICoXxSEU4vyfmPjvVe1H44oep2ZjMc8R9vDnLv/7QsQaAA9c5zeGPS2JSo5o5YewsIlVcqyeMjO6Z9TytrbaBO2nQJ0bfXkyKhxvqMYsxU5IOgRv3wtvd+5c15qY3LNnvTRtKYHH5nvYdyOcZ/AB0eSYxtt/id65uoAAAkA8sPStlQUOEbEwQtkMk8hwL6fQtCH5QA31EQQnBCESZZ+CwqEyI7ueMndjsSxLVEgkOXPzxR8MbGMZRYsDBkLggYKFwI/AgP6dew/WRqX3f/aauIAAAf/7QsQEAEmgWX2t5Sz5PA1rdZwx0CZ6YnD4MGhYMNJGD5NY0ZdMieTeRgMlDH2s6epA1scEAsqCv0BYCPLjo/q6DHAAYBEg4xuzEHdZ2/GCCGaHqAtshXDDZOQAKyAABIcXTVhlXTXYULBjJy6xEaDjTkvHLCTo/mggEDLCxBrBdMxdLMv0pM3EVTUcWSngmkIQPEQdQ2KQ9mJVZJq66V7r1WsPaNDXyWjRIoggAuSNsKgf4nYmpP/7QsQHAAo4n2+nmFCxRBSsMPSJbvmYeoqCdRj9Kx7OfyilTquUaGvwrSNQUFb0kqZmHu6O0oJnZ0bW70retjC4SVqhDRJweHOrMEZBrbDI0e7GuT0W1bemNgEoktf1DogI3lcnSTPjdNFXHymguSDQIBoMNkIMighYaXpI37cqz8pzhpdZb2UtmVnVuufY/IUKVAFD6AgJEDg0KKIm9nSefQ5Ce+GrpvQtrJIAABTjjkDgW05TiP/7QsQGgAqUX1GnsGWhOpHo8PeMfKtdmoWBMenoikkJTwdj5IpJLJs7CzGEKWAxpXZmrP3wQdF2svGGVIBVKygxYYFB+dMmnoVFxZ1QEHw0SlslKmgxosehAtpRZGGpCAH/6R0QdsJuTJpRBlrtQmOgGdjU71Up6jM+kUUj52UB5qoUa8F5NgqgpjzpGsKltvaW5YwJhNp+kwGrCzRqbEUDWuHtVFt7mTaPc5UVuOsqGRppgBQIhP/7QsQFgAnQYUGgsMGo+hAm9IYMfEIIUlgEhJA0Ow5LwCwuKxP00AyCpEuUVWX5ShsheVrbFEdBYK4bqK/XfTHDPl/3t28e377xuuq2d1nI1FjJ9tvv8rfApJNY0io4QAqMDwHjM+VJmxBjEFAPTrSymVxRNP8urATGGAuNGOUuMqe3xYOlLeQMBRE981BVFgjKkWKJ3+qgstyS3bSwDvJugK5hSjCgMATsFQ2oeGixYkVWdFh7i//7QsQQAAW0ITOgjGKgdwBgNCAIBBG6xm3/UR7f/////ztYhSAFCCVdAvCuESxmylev/Uz/oZ+z////9XZ//8JKTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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