/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABFwDE7QBADFOJiSrHtAADYTtkAbcSYETn4nhguDmn85+fLn/5R0ovyn/8MOE7/hiXD4ACAEEIBQCAAHYACo5iTFLDxvEaig+vdwb6B9IRYZrqQQY6iuu+qS6Cz31b6EjiWX9N/HoIwO0OeMslPT/fNGTSPJv/+l9AwLhohSNPt/9D55SBopiNhKCFzFzJRKEwDIUCAAB//syxAgACZDJifj1EBELBezznpAG414gYamdD6bezhzn57+QeATklHG5gTzB4aQ1G6i4QlzLUckVy7Mfe83PU4eft/nzyQeEnox/8kDAwZ/5/NohkoAoDA9INk3ijens8Ieri+stTJRNcM7oUgiksGgqCoiPBUSnbxKCp5ySw8FVlXNO9DFhMOp5U7iUSov+VdW7+irRqKJSNxpoAP/7MsQEAAiUzWGnpKf5DwwqtJekPoAWVhOSOYKIOYMChc8sdQqg4ilES4+ibOkaiq4FQCU1xgqdn7I7GUVN5ZWqpV5q236QkLJMLOU7a+kOuGypttKVOxtgAOHVgNHm6T1UKS5cXuNHNQYrxOlI9mkkjctk4q4MiF370St/7WJyF3g2fLHrBKiPimQEbornsBPSRXpCVZa1ITNLbIz/+zLEA4AIEJNTpgxYcRcL5eScIHQAgQulIVCMDMzEl4klnwmEfFVjl35i13oG/rDxVAh8yIJ6w92fBfnejnxy4306z46FXtoIyC+YV9KRQgKrlAAjyE3ZfEMMmWxRs8y8Xv7EaF1qVtE47fJkHjVYbS6gWU+JDt7284G2iMqEGGlCEqLmaxIMJBw0SFX18e7rdK/61U4nIlJJIwkA//swxAQAB2RZQ6ekrHDDhaUoZ7BK6+nsEbiybqQURbT10ZSI46muGr9Bs0z1DoEEWvtKOcsJDxZzAgXSGxQ00sTln/9PNG/0gKiskkm1gG3GhDuLGTEP1kRW/modhMSg664MplTLaaLZEXV8j2aCOzdAugrDv0f+HQUFXDDASgW8EQJbyMb8dtcGL2N9SWW+V////f/d09G9ZgEn//syxBGABAwpK0CkwnCUgmOoERhGxyBpQKjhRrEkkgqocerT7FP01ukS3R/dblh7ldJV1brv/oUMlISXC0CgAEVnR5LJK52v1Ps//+V+k3JVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsQyg8LQAw+giGAwCABAAZAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;