/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAA9wDM4CEYDEZkqYinjAACYQcbdSIAyAWdcpy3syYWdFgBVlyH93+fIN/d//rKDpzwbgFtnT8M4/T5lZz8pSJe+DF0GBggBei34gMWg6cQn0HGHABFf+uYM+E9cuu54QFlWJQoIjKZdSHnB7C8ZYC84oYHuTVw5uGsAk0AH8jTrmMdCLs1oSEGXTbrOGTrUIcM6OptODt//syxBCAC4z9QRj1gAEWDW7zDJAAcOkAN87lkmOcM1ACDSavu9uIImKiDjpr3X//X5xN7L/2/35uOwdhMNlnf7uYr/+/DwWbhsHQbLa0f8T8mOUBAAAAYYIIIAEwe4nLc7KLu6IeJ0jIos5CJ0eAWN42j3g4yJj1e1oZ72KNQ0VdehIVSd9FgVJP6EPeWhIcP8o7wqsiE+8jAABs///7MsQDgAh5EVm88oABByIrsPSI9oASl8kWFGKPKdUilevUNrI3NLWHgCAUAQKKqxTqq6GMKl8pSmMYxjG9eT7//oo52TVSuvvtvqUr9v///FBZtam2VVYFd6Gu8aTraRINCUUAWwhWIpRJSWGQT9FKKC/Ulg5NFGtW9H1s75O7okMrX4YqTbvT2eWb/av/P/P8Dro6e2RtEhq7gCz/+zLEBIAIpRtJrBhJiQ0MqnC2GDZqXKBI1T2qsM1QUgFXBMAyCgxAsjDSWbzkvEa9Gln3um/qVFKuj9fv7TkyE0ZiaUtzKva3/t+b0RUQQQQJZdY5J+qASNHIk0HE09dGAMNKlxIdElZ4BkAonfBYKLjtTJF/NOrd65KNcFA4qZAu1sTSQKht8iHaqgprQnbr/lbB1Q9Lf7Gi7JEA//swxAQACHxrP6wwYekGl6TZpIk4JpwB9SZJrVZxDKZZN9OKFWnldhs2rwC3B7VuGXfwJy8Fzmt2gf0Kf1FUL77m/Xl16UNeXo6dUT/f/9v6FIGUQPQTTOi8cprdNelErUWmwyygRTIjs22mVM+yLkr/2WVwzB3jfPGE0D3OEFOrFHV3sYJTstZzWbX7Cov0//61AJAI4BTi1D9Q//syxASDB5B3Hmekw5EQpKNNNgqawZeSXRmJanbWoaIhEG6bu1kZBSq/2jQgjmf9E7oIFAxLTZl1H2EAkWORLlWUzu6///s+spJFLgC/xzyDksXjMiuk6KjZOYJKNkp7R60cZW70pSoBorI7Tq5BZchPTHNefhtaB7ez7zOA/V/Qz/X/Cv/////Np/4yAWAkEoxvg9ToBFiBWYDKPP/7MsQIAActGxFMjEGYzoodzaYMUOATGAmhRIx/qUqO+Alf9WhRvRkmNTE5f0f0AgJ/W347//s///+GbwJ+JAIgIBpKIOsBCpS0Ay0y1l41BCrGYtSDGv7Vf1kAgIUeyR50rPFTowkCv1Ev1hv6ga/8GY4mUQAckYGZ234aN65w6jHe4ydOWxzZ6b0TG9mZn4ShCsgu2kAv+HH3gCP/+zLEFYPGlC5+jvNgQAAANIAAAASTdSvYNAUW8BC1TEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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