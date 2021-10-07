/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB5gnMzRhAAEHDWyDNLAAAAAaAQAu7tjAQAAABgMBgNNiBBAWD7ykMQf1g+D5/qBMHwfB/iAEPWCDv+o5wfPg+8EAQBMHz6gQB8Hwfsu2uWDrkw/a9xgUaMwFxxwCLsWS7MHN7VJki8fVT75eTqpn7/Xt1QxW//lJVbnfNuFRTzwrLn/5GVBnKMy/FVs5dTYABARKCMRm//syxAQACHBHWZ2kAAEJi+jxpg1Qlry2AYclVGyMwNoFJ29hqHqa1TRqRMCoetKstcqUzHBxQdCJmVcSJ/EQdEo0FXSoNLGkav/ljqPtEvjAoAE0zuEoM3lMJlLY3Uj65AMeMzQN6QWeLFdCcxLNFy4dBVXVfZ1L+gIki4KPQVBb4dERU6CrsFSoaLVHv/Ev9Hw4ANdAAG7VBBhVdP/7MsQFAAh8YybVowABG49vdx6AAm8ODBg8FDy9pmwIBsHPVGiPMueyERxZdIFnSpkzI8fezb+0z6OJVv7HHw7XBWdXwa6/y34l6sq7uitTjFTEgsFYrFQqFQDAGrQXMbpbb3ZGQWPWvTnyyeKKHgQ/nvlUf/u74oOHp/8v3R/dl/UcSXDz+kMBEHI0p5efiDJqb/64foFiBSWqB2r/+zLEA4AIVDlivZGAAQePKiWmDNhtwTYmBYyxnJdmZwmMtZ8ZjInEMMpo+VFWESqmhsWBoClhKKEhCW5UNPCsFVgqImyWS6KTAhEUrYoO7kaAWIJCwQzbgl5XrFBB27xoQwfnY6kozJtFz0SgICsWM3VIKWs6qr0tgI15/pQomHhblqjycRUCWe1dUOpxFOiJ/ooQC+IEEBlVdh0r//swxAUACGCjMy0kSsDoiCAA95gpQaBI041ceup5PSlsv5QNXMyixFLVkTXWpYUBYy/lEl4YCdWlLoZ//zGlKUBEhV0SiFT+us7WdBXqAbQ2hdxgDfH4RQsI+kgo2RnWVECiCa0TrUSNjalrUVVKyg0yapYqqVlRTNVLFf/2P/1qVadsTFKlitVMQU1FMy45OS4zVVVVVVVVVVVV';
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