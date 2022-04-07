/* eslint-disable */
import asyncLoader from '../../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//uwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAAHVwCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//////////////////////////////////////////////////////////////////8AAAAATGF2YzU3LjI0AAAAAAAAAAAAAAAAJAAAAAAAAAAAB1fH4oXBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+7BkAAAE1SrOlWtAAEIgGH2giAAa/acsOesAAbNEZCcCIAAAAfdth6J5ZcwYcxIsxpEzKc27k7Vg7VY5joDQDCrTl4z5/T/+z41z0VjrWDrVDnSDhPDaLDQDhADNKxO1aO5YOdEN4yNUkM4UMcIAQRBRItQNFcu+WnLTlt0w3Hs593nT59wlcbjcbl+epRGHff9/43L6enp88MKlJSUlJSUlPT09OD4Pg4CAIAgGP+CAIf///kwQ5cHwfB/8/W43GkWqQYUQROD8H5RQJ6wfBAMHPEDpR0v7wfB8/3xP4Pn6H+cid//D8EJcH/4Jh//xA7ygIAg6D/8uCAIRPUCAYAAgMCIF8wdgc3Gk894kCQYKoIzWTBvFI8wGgXTfOiXMg0voz1U4gEXsYiw1oCDoAynIxA0XJpAXAUAMBdjIDW9L0DN2E8DLIQ0DCwJsDAkDcAIMJNEygBi4EWGTgYHgEgYZxwCNkiGkFfgYNgvgYNgLgMAFDPAMFYQhZxXMFo/AwagaIeSwpoC4BACgFMiy/8UmHpB8xEyLD5C/q0a//EdCliaIaK1FApInP//yZJ04Yo6y6p/f//6jEusiiZIoE0YtMi9f////y9UYmRsmFToK/9usv/18yAAgAAMOCAAAAgFqUjMbME0VHfIVnVmTNYqSCH1ujKpUOGIwXKYt8+dbWTRk0s72Sin+qH36krkJWqpzHzdu+0qI693+jLkTY7HmbZkdnurlKz7qq0r0PQqhaH//8zUzscrkX//kVSlQiFUwkUogAAPgxdyGtqqLTQ5ILAYDGAQ4YfGRlUqGQUAcVvh2t9Gky8LG4wgDwBMDjP/7smQWBAYBecSvceACVAAIyeCIABHZoPZnmHUBOLtdZBEPOR+k9RC5bmFmZnTk8c3j+BeDJW0W808SI/iR5L+tt6tSem8QcyZxW1d1xvWfX1tbVtWrnG4NMybzrdNRq1xuFn7rCz8brnfxbOMwrY3r/wt/4zS8Xdc+tbffzXG/7Vx7V1uuMZrqts6r6+SLbdfX19rbpul6T51a2fXWNWtGy9i6jWzi16Pt2rbdt11mLXD7cK8Wr0aIECIJIAeQeU9sS4lOuAISAs1PESrpZIScS7yNM0sJBVwNMYVhMBSX6iZkq5cZz2RZK1FTseBdRvWGjJbEIlPSqkUBRRoKhoaAg6IosekSoaJDgfcQWUpGN42T8Q9QJY6VMqzqP1IK9YcnsyHE+Pc6E2qVcrVMkV9gfxE0Fy3+zU0acBHoJqSRONLMPMuNx3jUampKKuNzZOLBo8qH2oZMrBQwIOjkatb8sstRyNWCgo5GRqwUHLKhy1DJlYKGBOhkyhgYNHjka/mTWUECdDJlDBQYSyywKDCCxjVgoYEf1/4sKigVAHAABI8jIzKmn9YgkRkfMiNP69f/qn9FVPoqp//qiL//oqov/6Kif////6oqp7qieUwUECOT//5kasFDAg6WWUECdDI1DBQYK00w1kxBTUUzLjEwMCAoYWxwaGEgMimqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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