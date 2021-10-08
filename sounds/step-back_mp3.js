/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABuQrHHWkgBEjjyt3MpACAAAFATXFARjixlBReUzrU4cU3JMwy49vU99k3Z1CIABAEIXpE58Lk+g+D4f////4Y///dlDnD6AADhjTKjVsDYSAAAAFtB/FCVE4ALuCyYVGFqjF/NQBpU61FkDEdauBAjZPa+FJo2jYkRsfAKT3UDO/f46by1RJXnAx9WrwjidACtS9YDkA//syxAOACFSvWz2RADDYCeUdgw2a0TpNLTVTvNyUOUQVZzFZ3F9YhCrwkrAlZ0FSCplYwVxB0dUNcBl1bzKVv+iu0wVuWCHAUPegi5xHCqSQBgQyFQGBNHbRazWeSBB4LFSXTgXs/sqoTLgo9AKInFlOacXDly1Bwl/qbq1kTKhYV/qZ/19aTEFNRTMuOTkuNaqqqqqqqqqqqqqqqg==';
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