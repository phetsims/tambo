/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABBQPIUGIIjDpCmUqsmAGACgou6yQCxRxAcQRAcvNsR1Ezk/43fGoPn3d/7fR/+pAAEiglBBQQwjwXMNqAglO9dQJ7XjWY5c86jtyinr04QA0ygjGIZ2QYis8rOYRHwTcn2I//9//8mz/0gAQWy3W43GBRttt9QAFKgSIGKgpgDASFJssdBCfBqAEQBJmAyYkIK0UpsJq//syxBYACshRSbm3khFViiWrvJAGPCxayLjGL2E6Og0y3qNQwlI/29xBle4p4PCh6z9/0XK+Y1qIq2Wvo5/6wAACJIJAgJAMzAmAgMFQWkwimXzLfVENHJrkwKA0TDFDoKALzAtAoMFwFMKgbhAIjXgqAOCgFEm5adfJNsVOpVW8wfQTjNqKSc9BnS3+m3V77////20IAC4A9ZDiFP/7MsQEAAgENSJs+yCA/gklacywjkhGjMgedNvImU0B05DMFBuMKQF02whEebugA5DQS0TPXsfqOwW69G8b54z9+sKKM1yTf////+70AAosSUUlBPoaJEmAnmd0EwNJBPUjIpN9x1AydlJV/S6qw4GTKndJYOCCRuy12Bge0HteRq6v/RTO239/6ydvYgMCSSQATKSwKAzOJ07MkzD/+zLECAIGBBUi7fHiEJKB5LRn4AZgECbRjPHCIhFXLAQFSEwEjU17lQAx1mhjfGUf1d2y5DlsjjTBgNAjPC8PwWvSkVQi2Ucg0mx/t7sfso/UEHpv3f/7P6YABy0UCSMEMSqVSWdpFj36/7+LaTP2L6bf/X///qAATAokkDRMEUBkAY2YQbzpbPUawmGoTcJQmCv8728O/74d4i/7//swxCGAA7APKaC8IHCcgaL0FbAGPPX/b77gYAAAACulEb6EJwWBA6CpwuKCcwaAwt+LC6pMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//syxEKDw6Qey6eZInAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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