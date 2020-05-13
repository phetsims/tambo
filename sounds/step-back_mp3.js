/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../chipper/js/grunt/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../chipper/js/grunt/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABuQrHHWkgBEjjyt3MpACAAAFATXFARjixlBReUzrU4cU3JMwy49vU99k3Z1CIABAEIXpE58Lk+g+D4f////4Y///dlDnD6AADhjTKjVsDYSAAAAFtB/FCVE4ALuCyYVGFqjF/NQBpU61FkDEdauBAjZPa+FJo2jYkRsfAKT3UDO/f46by1RJXnAx9WrwjidACtS9YDkA//syxAOACFSvWz2RADDYCeUdgw2a0TpNLTVTvNyUOUQVZzFZ3F9YhCrwkrAlZ0FSCplYwVxB0dUNcBl1bzKVv+iu0wVuWCHAUPegi5xHCqSQBgQyFQGBNHbRazWeSBB4LFSXTgXs/sqoTLgo9AKInFlOacXDly1Bwl/qbq1kTKhYV/qZ/19aTEFNRTMuOTkuNaqqqqqqqqqqqqqqqg==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBuffer = decodedAudio;
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBuffer = phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate );
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;