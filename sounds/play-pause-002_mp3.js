/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABoQbD7WBADEuEzA3MNBCAAACJgAskgBcRsyN5hGBhqXwQuyQOw7kYpDkSRO/VlHf5xvEByI3gh/rqB8+UDHwx/4nD7LoFp9vuGw+G4gAAAAGqTKDNy+9PuImvBjDMMya8uvdTh6C+EAuWjDnSYWH28uk0pHlEhQ+PEZQcweAw7nDb/LgWgumBSMTpTPRN0rREAubS62y//syxAOASGCFd7zygDEAE2y1lIm2AAc14zwBUDZOo230InRyqFU503M06jA+UcqBJ8SE2e5YUGlMbyljDL6P+Iio12NO/ltdzRUY6eUe+PtroABbVcmtIwkwsW8LvpwEwly4g66t1tZVbELJLenTCDsEfhG3uQdRn6rfzfl6tNIdzb3u3MZW26tBAL51E8vv7IABVW+AAw6Z6lIZif/7MsQGAAhcn0ktpLCxIhPqaZYVtqkh0PnJtpG1dG0xEGanpgVLTOffjlDTPS/ObglIvI68yVPQ3qIC03PaNH+7KEPU7pvTxMPRTx+BV3t3SSAIlPJKwsAEqArk0EKW83r6tNT0kHRQcA7LpTDHDlAIVNsXSJKC5e3YZZr8z2uNPikwpky4dSD2QYRT6/jhX8t/+v1VAcoAAW85wwD/+zLEBABIiJ00bmBHwQiQqimHrSYjHAzOuqg0eHzQMVZAtNtl7CS2jCzFAn9fBL63I5M/FaZljlyzUrtLdx12UTuQaxRPS0oc/4Z+CP6p8MLgAL9S5xaO2kYzPwf+Oydt9kUzCDkQhQTHWzw04chPCGGQyKhWr2fcdPq0drVIGbee5O6i5oG35zTeWF7W2oaSd8SKCeU4gAB+MRFm//swxASACJR5Ru1syTEDDOdNraUMoaVA3YzTFpIiXHEwnZjKCF1ExUiXdjDRYCbeDH6gupEa6DOBLSJEjn4TJuJN21so4hLIokb5JalnWeCamqoADqvQpUDtRy/5wUBx2g0JGjJiOZzrsYEEpKNObOKZiyiEcLqssEMMlZNBSZyVspVGMf78+HkZANSj4t+z4rUFEEwBbrSlhQub//syxAUDSHxpMm3xKHEVjSTJjiQ4HVjIlEG4IpAAmGBpgTOdwAIODKWTHGnAijJFwyiJMOkuUswfRda2dZtmsdv9Jwc2QOXm9v/7/r//1HoUUWWIAoaWcp7Qni6sNSnQaJxg8HDhuMvxUwOEgSA16QMuqLwxH8NLrBo3AHwRJBMFx/E4vG+qnJpFUfmMzOju8jUz5FUAAWBgABAlOv/7MsQEAkg0aSst8YhxBAqjxcwxSMbORejDHc6YHNaOQwEZKATE6qeCIbIBU6YqMg8EUrjlwWLi6ciGfchpTnIIYs5i8y1NZv9oy6N1XMoFha85EDThwAPmxYyIKTUp0MFBUykFzGktO2MAxsERrSPrSBZr9vaPgAPk/FBerRWBFeHsdlur7z06Yu1iDh3/SgAHl4B5KqHY9bz+4Gr/+zLEBoJG5EkvDOknMPCIo0G+GViwGapNnZbk+ydAaY1Uc4+fludggTrwjYpBlcejYIJKlNaqXf5zZYFn9QuTCJIDIlmZcx1zecCNG/lRkIYWrMBVjtSUFBQNHho3oHUS4XqTPdlS5k1MxJ2nK7LTwpEGMxchIqoRdQdqACT4AQtYcFg4zZdPfEDaRI6hNkKoXOPiYQvXaelQDRgF//swxBCABzg9Gm3phNDRiuQdnQlOmh5HsoNmMuuEqOzHhUFGK+p3M1fjPrd+UBCEkW4A9k7RniIFjHcB40DwKi+AHE5IbMZVgONX713MtlZwkG2mTQK/X17Pqb8O/i3/q8rVACTnAVbQDgScoWnNJ4kYiVY/7MFimpBanCAox6CKGJXrfyaBaFeIhAYE1Gst1+b3fFvo+lv/yIQi//syxByCBuQ1Em2MThC8FqMdkYmO3IAJDjQAMYbDjAtHGpOwp26N/DHicQclNjlWpX91ak39S/y+v/5AH/4pvwfMqgAAbLNdgAExcj8DiUYxK6UxreCDjOECD8SpNiJqe3p5fJfv+EvpMW2ZABY3EBSoaVXQJDFIezXdTU6BjHwN5ZoXkzUrMZN/gmc7U/7fpO+WKzPXAACYoxQAAf/7MsQtAgTAHx1BveAws4yhXYCJrij7GNCx2nKoTdmZV7OyQEsdZ6WPJVH0rbnuzr2fU/4bD92aVs2iwuapG7S0kG1SMn0+L0a6ZYntUBI7eYC9FP6FIAABlkjAAAFGs+A6h2kSJsz6O4k3jjdMlAm5R6iJcKlGvUtQmbZFS+zYVuJWVVZlh3fAARNGQKi4j0i4rCbCqFqL6wCTGML/+zLER4JE4B8DQeMAMIINH6jwiZ5ixPqvWCU6zYqyRywAA1QY7khKLkW5uFhiQ1VMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxGeARZBW56ekTTCOBR18x7xGVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxIMDwiggrowYAXgAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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