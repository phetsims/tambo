/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABdzxBVQRADFFHaWrNxAA6lqlJJEQAExvBGPAACkboRpPkaQjfnfz5z/zvk6HfzvO//6nzn/8n8Wo50RIcE5h04AwQBAIwAHAAGGKl44UnQFxrI7b6JARZgWfzRC7X2cjUCZG/TgeAfXziIB7AOgm3/Dlw5chhj/4aoJEnxOhr/+bkURTNP+37dN///zd5/WqMcFKOhHs//syxAMACFBlQBnXgAEQCuRbvLAAMh2cNcpzMDxDOxVSMlAjYsYOAlbMUQJ8hAkSABkLAPbGhQfrk7xotjWuYO3uc9FKLMWDXX39eK91WL8a4ARAYAYFAQZg2BpmMcTuZ9zx5rwEJFAZZgjA1mC8BuLASofGAOAMhs/U/GV40k0Dkso2K6Npbban/lI2Pnd6J3///t66ABTcYocjaf/7MsQDgAX8JTutseaw6RRnNZCJDkFdpsKMGTznDUOCFN3UBmSx0M4MasPlPO6Ar07embS//T/2f27SK//YUG03dpZI2oMaBN8MJA5tI6MkldtNZgLZ+dUe9LvQy6Odv9a9cr9VPRUaBtgq9EWmz6Xj3KZTzOv1ylUAC+0kk0oAEUn+I0HZ6jICCWahweFTlrz07qq2Ls9T3N/Xljr/+zLEEgAFSBMjQWBgUI8CIvA3vAbc1Vf//uoAABTglUoQoEElDJAFw2zpqMe6sqMzu59/9uvz32/t/onv/5FMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxC8DwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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