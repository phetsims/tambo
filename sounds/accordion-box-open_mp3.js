/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABsArNnTzABEnmTA3HoACAAIOAYznNNVnYDYAWAjClBSA3BwKB48VkSUAABBynBhYP5QMCc+T4JnwQcoH/6gff/Of/l4gAIJkjluslkskluuAAAkTmCV7K1w6pqz7VkryDnmQVVFCJY0HRFDgrNPT7QRsUHNV+KVNJRPtYt0/426/nj/Tv/sPVjjhtrzPbywAATqIdRsL//syxAOACHStW/2RACEMj6e2smAEqYAYhGmdJfGbQRJM6d5rUVhcXmZTOP9blIoBChWlL5hQoqBgpUdHqJ/1McBGpaGctDO3++hgIUqDV8QgqAAntdpnEwAD6ruLLBhIIEPkpGtP5xWnwVF2czcptv1Fgk0VRRGN9VJRU46pQrSVRX///853QKKZ0dz3cGnwCKBwcHYEIC0hEM5EMv/7MsQEAAiQXW+5hIAREZRslzKwACEMBgAAD9/MyuFW/l8vMAkS99TuX45zufo9JjH/gbUAtafz/MqCaqJP4IIAARGcawPpR8H3iefS7zg45qAIBFAAV1AtJXsx44xwqAZ24lKIsEc5bDMUuS6XnBEXQqAakxM3KX8vlruv28Pc++21X/p71t0ufET/PUOSB+v8FT3Fl3GALLrbdbr/+zLEA4AIWHtvuPWAEROSLXcegALRIIBAAAAIpME09Jpkm6HEpcYWjTFeQLCjn4NAjRM5fbfr4UULuXdO+HtlGqi0a/9EFQ66zxGCz/4GGlyg0HFHJZM7ZIAwEAAAErGUoi0JXI6UF+hiurPpjdxalUIbk1pRYWEUpY39w/BVt/p1i48ySduL+KRKEg8sPo/yoV/yLlIIpJIQSCOJ//swxAODxLAbO7xggDAAADSAAAAEweQCRznEiWHEqW49z3nuJf8Fbqzvw1+e6j3TPf/BakxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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