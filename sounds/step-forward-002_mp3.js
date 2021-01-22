/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAA5QBJ6AMYDDqimSespAGAAMYUam1sgCiYDIIdPx13FX1/aEPX9P67/Kf/IAnJQSSgcAtwXINi40gTbRUueyOs0ZXJ8M9Z55hgE0aTGUgz+FIWkajrUi+BNwnv/1J/9+v+/Jhn/FaVQAiDAYy2W0BcL9v6AAC5QFHErjEDQRpp9a0AggIJDWgxHUxwXAQZCMTNR1EpQSX//syxBeACag7P7m3kBE8iCVrvJAGqpzIk4H7+PFxAuVWJa7Kv0kQ9R9novS0RBxiVfdmQAAmJKIKgFQQQIBkYawwZiCJ4miuVoaSyFZhhgNmGOE0r8wFQADBGAzJQJwwBiNIIy+DF6UHRcmOmxU6lU7+NhkBjxXj/sdv7f/o//1e7SoAAVhpmBIcwmDExFFQ0k104+D84dl42FHIwv/7MsQNAAi0NScu4Saw0oglpbwkjqC9RZQExkCi0mWdR0OBo6Ng28bDttvrPKT4sreQt1XL+5T7Bjye+/d5V6tQAKtLZ+F9mhfgq05xBgAR4emxh15WSmZpb8+S6gSizfRjBCaypT9DPkav//TO23uYp/8TReoAAgA3GiYMlSrDmdaZ0w7hg4URhA8+C0k+w7JHnbE7EUQUGkIAHpD/+zLEE4IGiBMfTfDCcJ2C4mWdsEbtAYY//ZlWxSQu/bX7H/EkDMnqRDNq87A/TKFZUXvuGovU5BpLP2/j9iimjb/p3+Nq7GK/TQAGJtpUE6USDIMgHqYZJxZUTASU6m0J1h0fePZmnoxikkl45aPTNofbX12WPGasehHUpJMlUMgNJR0h1sJOg4Ya2WqPKZR1/kkVnQZvBXhrHB3///swxCmCBhwRASfrAACjgh9onAwKz3Dv7HT3saZZAACMCzwUGKmISpUJ1pMJdMFWFXkxtaDE2uBsUEa6gef9Qr///+oW///oFRVmKkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//syxEADxfwofyxhIUAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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