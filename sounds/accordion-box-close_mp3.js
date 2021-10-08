/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABSAbF7TAgDE5nqu/MHICAAAAcDYkDIEtmZ+0OAIDonAEAIOjgnenW/yhz/g+fh+CEocif//+c5RVQlRIdHdXcHffj/DYYCgBdaS6OzOU+xCNTd7EPI6nQ7mODNUkXlljx1AXgvbsgTi8z3+Z7a8aMfHP9uQFmXb1f/cmZM/9//sIhYP//sNqQJAgNJhWTyGAwFAoAATS//syxAeACW0Hgbi1EBESBuvjNGAAfDtZrw0MQaBPJj2MwQyJDLEhJZGoPjAvCMnP3dlJiAtJ8xr/PKk5hYV//3KDxif//6MYVcnt//+VFswo04EQAACAAC9YdezBqNoZHHQDlUSCuyZAkxazLI1qAeiR+JfccaBj1xti9B5JXrESzzBnSIgoXKxEzkQCos+pbPmxfwWXkwAAFm+93//7MsQDgAh4Z1G5gwABEY3y9x5iAuzlQAAAAAB2Wop4QsaAhgpWdRTKJsZcpp1XP57ykSikyYckLZ4Ty1TSs+HageepBZpVjXhgAMSIXXKmU65I0d/7dt7v7sNgMBwALVb09GkvHVk7fqBciIEitH44DchaeFCkbZVn3vi+3iz997uspO3MNCwv4nKHDdB/+gTro/8WA6oYAgMAeW//+zLEAwAIZH9bHaGAAQMgrTTxid9Ko07zWxQmamYZMUXJVhdXnyiL/VNVCqJJVOgImNStCjd9bH2ZjwZ/qQYUyG79QVWCpgKmMChqVd/4VIkkywFXa2uRpIAhLLU5m1VG6LimpHOKzIapjKZdQGJoCUbq7bMoVyt+j5W6t+WZ/r/KqPLMbv1Kxurf//8tBTuFZBUABV3GwiMDZuFj//swxAUCB4SDK0ywaICeAyN0wyROlYmGu6/rSDZ4E2kDhIFxZeHE1XJXBGqqqgLGqsZQ8m6ArsXr1fUvL1lChr+v/7fq//SC5HLZU2AEjwW0VUCig+dQNmTNmsUQ+tQt+EhX+skFfU3+n+u7/hV6TEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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