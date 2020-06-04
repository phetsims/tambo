/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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Ft73afowvdvSKI12FuNEuWrlVMLbSddxkqdQkyGVYWVyHGuJ6EjWUYVxD4ctoz69qrFrdfrb6ra1gt3bSBbseT+T//uQxPYAWgIQ+YCnHQMPwh9YE2Og1f9efnzCde6suvOyvSglCAoEMwaZEI9G4DDoUFJPEoAGBYQl5dDI4nHUfJrUletpjMkPJxgL8N2i6WSPi/1IsDXU9Sfa6RABCQqeCmcOzTUEvdwuO5CRsBr0Z0lsQGSTAolY2+LxuwiSqRS2Mo7MVCp8znnRmO+cRpIz3e3Pn//syF9z3HYI0+valxklvbL4jRSb7AoaNMvFk21oD0tfZtVsdICKyUsRInqKoET0KuxJwP6MQOKpazDVEnNuZQJWm3KXjqd47aQOjiSCvS6tS/edHXsP5KLlqQUduNRuPzTqMwuvtntay35Ky9ar9wc5SqHWUtXlLMG5s1dJPBRhiEWamrtky2WHIruuyxUCOIcNoMG0xcJEp6kplKF9orDyS1SGr1BDGfMiFnPA3y10w4dTmfpbJUAoanQY0KYteYLgTEFNRTMuOTkuM6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uSxPID2RoM+ACzHUtAwh7AFOOgqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqYgQOkACpWboWpfL/QxeyTV8xjVL6GQvo//6OpShSlqjiRKv5qtnKS+c4luU8karyRIzj1RxKqr/1RxIluc4BJb//WU5FGckjVb/5NInV/TkSJG1nz63//hMT61rsKGs13szEop4KGuWYKtesKtULx6wl9ISaJyltMluXhbhNhxKqzE5PYcUuwapNsvRJcTtHpQk3jyVqKIMA3BIUocyFLlU2XI3SdKJRL50q0fIhpLU8qt0xBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7ksSSg9ZeEPMhGf7AAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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