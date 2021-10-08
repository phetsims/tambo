/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//M0xAAMUHZ8EVgQArwww/Onp5W0stmaDBAGEmFJvmc4m0qI6qhnOZxl22n2pRLLHhAAEOsPlHEEQ/8Hz+UVoXJrJpY4tzMT//M0xAkOMKqYAZvAATZexVDKooBn8OBzJidr2F5jCIciJTmZCZALEXgda/NZOayujh3C7S46y/41jYvUNQqQAnZdbbQB/zB5//M0xAsOSQLOX8sQAjX4e0eR3FwBA/r3/EthvNcpTFM2jcnryMQDkFhgI2H33e/7j8pe0uSoc3ese3WqCiAEdtkkwDvCEJn2//M0xAwPEHbGXAGeD9wPKD6fexdDwAM0ucjin5n4Q7jUcIGgYfkKSlZOWd//aWJbXN/7tWvz32+/ONtK/qpwB1xtu7Qgw1QP//M0xAoOaKK5GAGeDhglXSM3yQIrmaKN9HIQWSRTCEo94f7lDzmPPGOhtAowObhjqc5VGsFjd1gF4cJvTQwABpo2oAzhKAih//M0xAsOyJKlvBpwZBG1pccw8/PF4lRapiAYsF+b9SUwErh4xIyrJ8cNF7KBMAha0UIL169Kbdf10p7dVqovEAC2xLzyUixP//M0xAoMgIapuE4SwDC7CME0a7NDUv5iaUNIR8BTFqD6mQBI031iR1DzyEzRaNYxVX0f9xJAB3a4KAP3k5L8skcSOpI7g5OE//M0xBMNAIatHDPMpCIMWQ/gWQDiWEUOE4EJPW1ZrWkXJOVYiqlKSw7//7N36yoiAFd/qI2kEihV5dw2o4BBA4EgXzF1reRp//M0xBoMeG6qWB4eZDLsHg4FBgzPuQYFTrBGRQLloTJZG8W2VxFIAprtqKAB+KDNsyNamCYhIxe13fbRcbWnV0UZqanQLxEo//M0xCMMYI7CXhvWZlXb636cqRctOp///22CJUzJoCQiRgQibyg12GlocAqFZilN5lMHYUAYQCC4IZYpI31ArijX0/z01HpQ//M0xCwMYIZUAE9wSX8l/roQ1TNiyAAGfQdyhpTynPX8T7NClQFXqkVyom/NiVopCJn3cwQ1q/y1vr/7NgeUO9v5NGkZccR0//M0xDUMQIZkPjbYamiSzAuk6OxlUAqrGTSRwoA0FsqTshg/Gu+K/8aQijH2/Y/+31bf4wlWMxUWNgLYsOowNmQVl71MTRzE//M0xD8MOIJYOE7GbhRMgBBhWSAELNzpZa8VNVm07WGbpm8ED////R9F3+xDMAcnsopC8To4ZXG2GeKOmrAbPMANYQHozBYG//M0xEkLQIZMGGcSbF5RW9TqUJqzDl14hcM6Pf//+r//6N7V1QDwDAGGLxfs6aY5H91C+qv8FA8yPNAZa9yR6RjAn9phPgLO//M0xFcMyIJAFH7SbFY1Nz8cA7R31/////5OjarWlR1UwDc+yNVSszkwbeQYC+iAoZmWKYkDs4Rtc+U3O3CrQpXf3V7qTu2v//M0xF4NIII8VH7kaNC3J+zT/S8wtXommfsb+5IC7kwvzQBRMkJRK5hnvEtcXcHGQ0+ow4ilbWbm5gZIDzKnPNqwz0fa3zW5//M0xGQOOII4NH7wgnZR/rv3f9nse2wCqlxTNGLS6NhVj00KZcLFQWlQy8Ufx19xwkas5ccyyULao26peyeXOf6qbsBopL92//M0xGYNQIIsUn6MbPVQUTWf0GMxS1c/jNWBTjgNTyBoJlcDOpGpby5XXturQFq/0UxWv/+PlxQukqeEKyRvCQwJME5I/aOB//M0xGwNGIIwUmaEihIKEAapELUT6Sp6En+NrcOIHIm1W9jZ9/Cwt0puee0WKKbP//t2itUDBHvnTLWFjlPHumaDIKbnko1H//M0xHIOGIIUAH6EiCqQMdoxrldNZoJsweAhusslKaA2trRYHjkyAzi1dQiCExnvmbzBQFq+YUX/mFf/v/fNa8pzx8jMJUoL//M0xHQJSFIo8hGeYh38tWJM7hlt6nBSF80poBp4xY7Am26Oy5a/a8urXn2WZf/pXq/9VLXM9p6vcyIxoc2NPe6QbG7M0JTE//M0xIkL4GYZQCvEgJWpZquQW5yr1Ku+Ey3n6L/+c//H5xByXPpb9Bfno5yhKh6D0OD4L0psacWtQJtSRACSPyn68pb5eUEy//M0xJQL4c4NiBBE3f5/5/vf/l10r7mjY0IBs2pe4Foo/A7xYCUCBVIgAijA+VN/0/7////L/9dPs1TkZ3Up5s55igzuVRjy//M0xJ8KUdYOQAgFRVdmIxhYMhwC08OCGLupq5BixI8s2xVl2jRf/d0H03uuZqahgsKBks0WcZpKTaRO44Daw0WFmhqqmVdA//M0xLAKYeYRkAhG/kIjMNZGSn0Mynl/Wpz+8hG6/zv/77kZ3tcfMkIrmhAmcjUW70Gzg1N87XBjAw2GgcN1DcH1UZ/IGZb9//M0xMEK+d4OWAhG/IM1U7gGQiZfE8v4f/LPi1+APCn+CsqD1Dgcgs65KXREuUpqdQSkxBL10zu9JTLjURy7s7vJBNX++gHy//M0xNAKwgYJkAgEMWa5rxRCmrny4ecvxGH6+KJzP8MTMLVcoe0FX9SDZrDJnX/UuHZVNTos/nvJQVYKk6OOiUk6FUxBTUUz//M0xOAKwAIRkAhEmi45OS4zVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//M0xPAOGg4FkAhGv1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//M0xPIPEj35cAjNolVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//M0xPAOUkHY0AjNplVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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