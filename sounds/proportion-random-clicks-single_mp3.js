/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//s0xAAABAQBIVQRADFPkWwjNPAA6UAYhBMQA+IFky84t7VOg4sHyhzy//OS7+GCjv///wwQAAAIAEkBq6qwyK8qGjhTZfI0fiJMaRWkLjTrpcJtYAc4AFRAyRta2mhwkyeQo1KZXLpxpi29/6jLfq1wc6zv/X/XCff1gPEfSSMiNX6hM4HP/S5hFy2WyW2y//s0xAOAB8RBfbzBgDDzEiqplgzcAF4EkIAIJB+IgqLcnJqOoqN3SuwAgKCsUJMxPVE1lXBW5Bp+dBp+JRKAYTdaVKyxH+ncWyWpNMAHehJyBAQ6+LLkEw/hNBrqI4mH5KRmTh9QywAiMKDPVNzBVoWNtjrI9+Qv5Ccnf37D6Y0bcKsf//6mGdCBE3SyOWWt//s0xAOAB4CDaaekZzD+Dqk1hg0ugKFJzGwUiGnSnCawiaOsAjqKLOodcCZlI1+rqonqluwYUzM19jpbHwcq6QLB0jJa3R39f+lAFOOWOShoANZQQsgB1iuyZSnIJAvWMAeQQKmJUTntBOV2bjhdYLhZ+sMlAYWCMcONkZllsBUKoagIAin/67KaIBZKlJgM//s0xAMCB2BpHi5pJICJgiV0vDAMUmNqOdaR5jA+AOcZymPXBAAQJhAEiLnlSFUeU3a+KhZRvLjkkS2ZHPebtx6rmud/y3///5EMqhyOOANDF9gos4FaYFT7iz6iRGp/u7v0av7KrHXt6f+hFQ02HyA2twYUiZBjwYCAjFQCmfXJvwKJl9lpeQVNju5YbOnZ//s0xBGABbAXEieYApB4gCSkAYQGoiP97NrVPdW8SpR6z/+sQLXLUefiU6m2VxFK251X4K/dgq4t7P+dnlr//wD+ABlYGCBgBwVFRUV/8WFsVFWRQWbiorVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//s0xCkDw0wOpSGIIjAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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