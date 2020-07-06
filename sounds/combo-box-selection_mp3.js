/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB4wVRPRhgBEPEPC3EoICAGSUklgAyZO2MIEEEwfB8HwfBAEAQBAEwfB8Hw+AAQBAEAGH+CAIAgCAJg+D4Ph8EAQBAMJ8EOn/+7/E6TgGk1n1uesGYgEYsACY+wg1YnfjY9ISKh4SDpkfAEyLIOdQ8gUuh3EcoNfjvqv7yxevmf/zwgZOM/Q9/9HxN/oW/XWqrIAUqFJC//syxAMACGRRX52TAAEIIKy08wneg9rlRppMMqYqCndWxGep5TDstlD67uBJxZqn7tOVs5s/4yRaLESIlcEsiCyeWfseoVDRHQoOyX/rBUSztNtAUmtrcSKAONYOZRDeM87gVS1lUOTjBTiHfzfFnJU898q7zWIwz7dHQxui+lLhW//plahv+hi////8KMGEs6gSytUsgF3z6WRIAP/7MsQEAAh4zUWnoE3hFZ2q9rCgBijXVDHYi6DJAfKELohrpniqqTwkB4iy7GIz3wWCwft2z1ve8oTXMbnO/aQs7jYf0I3rX3Ud//cXK//UQUZLkt0kjSIDuweJJZtIVNodnorcg+rEJfKIvJrYrioPyxIA0KrkCGEY4rdUc6d6LpnObzlR5qfov6fvc7+jTv/+Pvqf9CoAAIAAD9//+zLEAwAIYJdUuaaAAQ2fKrew0AYjf7z65BeatKd9M8sNIGMnlV6boAXQTmSVoO8fycT1o+WEiJmU8gFL5oX1H0FOj/6C0XzL4Q34l8uzP/+aAthAQFLzYIH///EXFZlFm5WmYpUn7QHUwajqjyOl1H/6SVVIvBMhbJPRb//Wyy6eGMJMBSjAmv///ol0Kii3///6JtXgIzEBJMok//swxAOABoTDQ+DpRXDrkaY8HjSuJgAj50kvopLKGlpUHf3IYLvfyNxuWW+P2/qj8JwUz55n//80iBCf///+MnTJZAkQgJplMYMIFTqmh1ylhmQioAFA6ZcnZlYEloms1oFac4r/IdTOj61PsDeBZJ6aH//9Syi3/5ac/+n0AAAGUOIeAFNeCoY9DLiq+FgSYxEhuqbHGRGGEwWA//syxA+AB1xVF6Fw5VDwhSPwHL0O6uHAfeUV27uZrZzPCIJqf/Dx3/9cPmX3jbKXU2AAAAqf/wMjWQ0dyCxwA5+jxOLNSMb+IBX2GjQVFdlRo0Kis16AqKoNDxViH+yQNAUVFUGhUVYaeK0PFSQIHbcAAAuCQsyKxRC6R7AyZGivFWcV4qpMQU1FMy45OS41qqqqqqqqqqqqqqqqqv/7MsQYA8MMAvFADGAwAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+zLET4PAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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