/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAHAAAFtgAkJCQkJCQkJCQkJCQkJElJSUlJSUlJSUlJSUlJbW1tbW1tbW1tbW1tbW2SkpKSkpKSkpKSkpKSkpK2tra2tra2tra2tra2ttvb29vb29vb29vb29vb//////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAZgQgAAOAAABbZN39+qAAAAAAD/+0DEAAADzAMboAxgIRMUZfTzDaApohAWQIJMXNcTvsHa6OtP9P/9Dv//Jv//5cg7x3NAyOWNFoqJMBwvjagH2fcq4IWQtnQ89EJCwsHCFMLC2fW3PAtfMQ3Qv90r9d/+IUKFE8nOIbuaWAC/EGUfE/R4wy4T5MmqCwEh5qsVqnMs8hXwxBFD6biWBiFwFwiPHAetRgMYw9PiWoXPQOHnVicu3ceAIEmEwSpB9NDBYV1a9feBc//7QsQegBCxVTE09gABQpKuNx7AApHXW44HD8/uy2sacpjEKTjv5pnUX5RxzKVxyCZpL973f/3Pp9Lz9M3uY/Y9m9+jzph2Zy/zk/3dNfq21z3Uyn32Om7+zrdfUTRDQqNY7OZ0e02owAAAU6bM08zsJYqLxySQS/xqNqrUqShfCt4SBwYP3zz/IhMDvTp2t35kXtc+5+/zmzkmi1XF+TOz00nc59/Ql+4mS/hRFlWCAAAC7AAMNP/7QsQEAAoEpW1c94AZMw/tMPSN3qKNZEpRVqc9iCncfCjKd5EiqllbykMMuTxSvIbK3t8aZGNUa9YfpS+/S9Nf//G3kvpd/Z5Civ4CpS82VAkGVRpyLPFneYByK1LIAIABnrBFSeF+XBBjnV6TLqQadJUOLaYuogZDJZsQiqVvaaQkI6GeiNojClteLTh/6jHaGcZnErmBU7uaDMWRp/4rhX+zcWxgj0pWjRABBI/dZGRQJAhkCv/7QsQGgApMa2OMJMdxTA+qNPYNYGSsS046NHYFmgihC7AncIiZojFkQqdf3kh388xrL/f3I0gR2FhcKAoWTaJb5TOKY9D2PdnKJFAvGPzv9N9pomXYo0GRYxkgAAAAnZduHiEl6H4WMkR+mgTdDYw7huYoQIkRwPSSXVh095yhKYI9XHClQGQ/n8zUrSMwgtQsDwGEyqFYbKm6C1kh0C41B6asHvZ3DPdWJkUdVa0AUSW5dbLA4P/7QsQEgAoAj1GmGG7hPxWn8DYMPHQnBUA4RYhCOh5H3BKLR3CpLw1IvmUclt9K7NQSrigqQ7+1S5iC1DB0MqRVf8Mw1JOvLExbOizni7l3EamizVnS3zJ6b9/rISNjZLu9MoUpCMdh0LjcRVI4IYlNiT4NTg9WiCJI2zBTjGpKexkJxYki4zbfCAt4Zbc5+WVVSvlsoZhYClRQNJQSXGjzmlLHpyOmj+j//6EFNNs0x9JELS5cOf/7QsQFgAe0SS+AsMFgbQAj/BCMBAHlpKLwVCeB1IWjUFsSCtUSwl3RaqrcLeIj2eOgsOMgqVnckWIiLFQmCqcl57p/Jf//U2AAGAAhpgQTUET8tI/fWnZ3//+z//o/Vv//0tttdtgAQYFFAYELBAc9nYsosy7/VVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQqA8KsJKCDGMA4AAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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