/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAE5AAzMzMzMzMzMzMzMzMzMzMzMzMzZmZmZmZmZmZmZmZmZmZmZmZmZmaZmZmZmZmZmZmZmZmZmZmZmZmZmczMzMzMzMzMzMzMzMzMzMzMzMzM//////////////////////////8AAAA5TEFNRTMuOTlyAaUAAAAAAAAAABRAJAZmQgAAQAAABOTGvClKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UMQAAAjxrv+ggLoZGTXh9oJQAa222FG3ASABBG51MY/j4AAB4AYI3/H3//Pqd/zv0Jp/8//zn3n6Mmf/J7f//8jf+fOeeggHA4RXkGh8XEwHAMHD4udyCYuhAALhgJqWJAEDGMYxvHlyAHxc9P76dP//T/Rm//p+v9tvb0Tzr1XyfnelP/3b0//5vo86Mlm0dHQrscccRQg5oSYpziaiB52oQCkxnR6LQisRCEMhluyeqEhIiWMiSvQjhwDTCtCPyDkNrP+UsBTNwVsJGSD/+1LEFoAQMWtluYaQEWGP7H+wYAR9IvpDLBawV8OWbG5oShmbiVnh8GAU6ZIjnetMKuOcpmaSndX80HuS7puaIKq/6lvM36lIJf8+Zm6CFA0t3fV/91IOhPJ1GCH13q//5o6DJl9/F3ErtwAGRlJ26tx4H5gV4lzzrIqy8jTNBZl1Hep3doI2/x6AMOljV5/M4clzeagOVs4SmnmZk2fTyahylhxZ1R7/1HlnhEe4KgF3SISoKnviYs9T8sp4Ku5ICsAAg3RwNdct5GVqea2W4P/7UsQHgAuZRzrtmE8JO4qkaa4M4MXAzUcoyYPSsZe/D4w5DUicEmE/ziQka1VaLTh0y8+qp/UtRMpQoli5jYCz6St//RjTOrPXlI/KJaZ2RHX6mMrJqxfqVjPM/K/thi6pyAAPlyOxkEr9tPgR2ldNwBRI0383ZJR5NmIAG2zBZOw1tKaJR6jzjIxgTlVLjBgJmawwRo8JXAUYCz1gr/q+aVWur8tO+j4iUe////6ii3UCwZHQhxd93nYdy9H1MjPwThY/VGgQQLo200aOkCDF//tSxA+CCwg1HK3lIQHXlCPo97AIw8D44EBOcB8oGBIND4gcCBc+IFHC7wwUOA+oMiAaH1PDCw+mxbydxPV3/zjbCnci8p/9nIJTQYSH5vktZIAEdHIA5HkiS4k11MYsCUFS8QSbEVhJUnQlFpKIJNQhJJrBKEZ8kiKoJIkqToSj5KJJ6hiCTXCUJUZJEl45Ek9TCUfQkkyuSSbzS72V1mVruLnhMeBUsHREPDQiPA0VOiJwdKuBlR5Fqtbk3f///t8FdSogAuxJp2uAWhIWFmv/+1LEBgPGHADHoIhgIAAANIAAAATcLVLFRWKCwsLCyxUVFVf6xVmLCws1YqKior////2RVn/+LCwtTEFNRTMuOTkuM1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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