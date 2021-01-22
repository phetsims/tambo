/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABsw7MnT3gBEmjqurNPACBUvHAgMCGOB/iFgZw51MDnFjYi2IxFi3kvXQhYh5c2fDx5E8B4CEH8H8H/Ofy5/hjlHFAx/9wAACPS+1AAAAAAAC0TJrVsm0HtgCvg04Ftw7WyaGl3IC2pQCh7TKqAnIYbrCkVVeEZr48V/NEizuH8KL+ines9THAz4jv2f43meAAAAZgAAC//syxAOASIBzS12ngBj9C6gpt5me9oEAtIMdcMPcPllNsLQxTxrCgICgAxAlwwVoCjjPk4onNWRlQRQKxDrPou+2zYrvEOmf/5cRqf/P9J0WXAAACSYlZ9VGjK9MwZ6AWeIQx2E+4LRQVuECGWxRxLwkF1IxNr2k65DlHoThxP4gVaPA7MB0TFt3Ah4YFQ5/xdU8AAtvwYBBJiaEGf/7MsQFggioXTJOaeapBQ0nKcyk5hUsdVVJ1demOguCYgMNBBdgZ/+g9KSEAgnSXIYRNG9efp8/hAjipqNJFt8sDYuBIQ4hwrp7GecT4AIEYhqQAC1lDpgo3l6zRoHOqFwweDjFODEZ8QAn0WvWSOFHJ6AcLr2zmhAQAxhe0QlVMUNCn9C7/6Y88vFtDOuBfqUAIKA4AFlWQGgmZVr/+zLEBgIIfF8o7ukHUROLo83dGOogYEmyZTlAczqKYQg8YUGWvHghkRga+XvA6rXdhyayrtpyCa6xwGjgKF5NKmpzUF1v0PpsIf/8OgAIUANZU5MEApNcErMRExM1B/N9KuHAZCoBWIcFmqGgNIyFWFXa5k41AqNgahMqeOFiIEAodQQPEtTslRu/8vNP/X//rQApvwKZwS2ZqCSA//swxAWDCDBNHm7hhtEXC6JN3KTaAKc1EFYyikswQCIFGQ4iQD2I9lYJDipqzoMMpRbhfsAlSigk73+yecH4ro7umLepP7ZT9tX+oAIjABaqKRgYNZwgK5jYCJroGZ23wBkKB5lMFQoGkkeINiV2+Dt0rJRgDIOgyUB0GgNHBLCQlC7o1LG73/9l/2Uej//T+xUAJDABG5D0gGg0//syxAUDB6RNDm7hhpEOCaCNvrCiTKEClIZgGedfTSAj9V/BpnQRzOR4EayCXkw+Iw8qbQD+Blqb8Kjs1md90nh/9/0f/6P2gJrbgQWjIYuHmvbAFpjqaw7ngAxvA5FRngWAMWBxcUOwWqGPqhP0DFtAuAkH358vOnszWx0BTEA3+/MZ36/9P56n/LIh1AACafdIEyEeyAwGZyOcof/7MsQIgkaUfQJuMKkwsYwf6YyYhoJjoDsOVKKgLjEqGRvCPsfX/i9G75QRVyiLfmo9F7a4iMfg0O7m17OioDnQSEFYHTAGJAaREUeqqNRyiV+qol65qiW5XNIlbn+GqqzUe34aRASm/2oAAACEBiMAJwChCZBJwqXEt4VMAkURmUQhPExCChwxLVYy1UxBTUUzLjk5LjVVVVVVVVX/+zLEHAPE5ELvpKRj+AAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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