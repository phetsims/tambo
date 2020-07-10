/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABvA7RlWBgBEhDOx3NPACAbADMg1KNSAMhroFScaneZtGCiFyC8CYDEHclljMAABCIiIIAwMHwfB8HAQBAEAwf8EHeD/4PvAABkbckuu/4AAAAAAAMCoI1AqONWhTLNyWYQ3GXZq7rGgOmYFhw9xkuqEwiFTzsGx6mFDc39d5HDEOZm/t4Of1yoXXnkfBNbkARK04xQAA//syxAOACGRvQ13UgDEAiyTF3RiusBZgoEZiINpkxFpg6AzNy2LKXpeKVCEBIHel3YzG7BQSkhxakWjo8011JyxrN2d4liLpFmvcqT61//vJJQHAcYgAmZAigeEfafmjCUJwcdQPFAKNLXpEGeugQdDUXaMyJROSPc/0MhkZIlcro6O7VygFV4jgVDX/1O//gZUAAAYA0ao2FUwKxP/7MsQFgwh8QRpte0BQ+QVhTa7gEqjHnbeNcEPYwgAdTRvAEKMGMegGjjv0Ex0xmbRKPLGbEyaGYrZrU26XOls6pmiRkiS//////7u73Api/gDrY858z2Mk0jrA8LiYy9CEEiYYNg2HoJZBFzctPB53FlUNUeUqtPBURT2wjyXlXf/yX5GWr7dJX+VOqrmeAACgC7xdUEmCixkhUOj/+zLECAPFnCqVLD2IQAAANIAAAAR4jOIBIeEDKoKcMQP8BACwQWP9/////+oWFmfWK0xBTUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxDWDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxHkDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsS7g8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEu4PAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
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