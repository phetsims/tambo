/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//MkZAABHBl0AKGAAIFYBv3hQBAA67u5xAMDFh4eKJhB/eXVU2PxCCaAlJf///////MkRAwCOI+GAMOIAAQIbwgBhxAA//DN4X4pVlYnDaBqS/59MSz//K5bKkDA80VQ//MkRAUBbBGAcOUIAAMIavABzRAALP+Q///yXokiE4f//qJzf//5GsK7CAEWWZuQ//MkZAgB7DVsAAMCAgLhEtAAOA7sd//hhv//8l8oA0x//+Ol//FIS9kjEPaBauQq//MkZAgBbDVkAFACNAMoasCgUASEFb4Mo3qKwbFj3pTxX//+JcwBlgVo9EON/+DZ//MkZAsBWDVkAAHiAgLgIrAAAh4A1CcUdBxH8Tt///rVnANH8zlsSfr///7cvjdC//MkZA8BcBNgAAD4AAKAaqwAA8QE89nIT/8GZcSiDAM9K2FO3/xlbgMGowgXI/kv//MkZBQBZDVcAAHiAgLgIrAAAjAA//9atQeK44HGGr/v///r7g8YOlR5XZv/ggvr//MkRBgBgBFYAAEZAAK4aqwABgQEOCCgIgs3biOuZgNol3QWe1EquEwOzFHkWO8S//MkZBwBGDVcADQCNAJoaqwAaARo/RAMUejvXtoIetez4OvliYrvb/qN3jAAW5k3//MkZCQBJBFYAAFYAAJYbqgAaASEgiXL7iDZ9Q5/XBsAvgBJHoPwEj0qzeCIymwN//MkZCwBXDVWAAMCAgIAZqgAUARp0NhJr4sY+oPTw0gVTHruhv4SDDXOsJgAQwAC//MkZDQBgBlOAAcCAgJ4aqjAUASEZf8jZ9IoPPbi0qo3+GIq7g1opDaFFGWn/4EW//MkZDkBbBNQAAW4AALQbpAAA0oEBkQcYM/p///zVdUnBpBBIzgIMNsn/F62HxWu//MkZD0BPBFQAAWvAALgZoQAAkQJUveQv/j///6F3nbZ4A2vZIhQY+y/6AZDj1hB//MkZEIBZDVKAAMiAgKQHpAQAFQA6u7svKMLZ3f/CAWZ1K9HcH5p9TwUBosBl9up//MkZEcBlDVIADcCEAM4aoQACwQES8AGS8uSDjmY6f4WZcWbJECab3TRLTf8GEY1//MkREgB3DVAAAcFAoO4bnwABgQFpk3Od2iYwqiN/woOOkdUqARJYt0H4/opQbmo//MkZEUBvBM+AAX5AANoanQABgoErsWv/gxqZQITdD4XP3eImUHANG8EXejyqiPh//MkREQBlDNAAAXiAoOAbngABgoE6AAMHx1lm6Da1l0coKkSZ037eNUjCB1ZcKgT//MkZEQBJDVGEDQCNAKYaoAAA8QEBbB130IFOAABJ79iCNAyGQwmYkPs/U9QGBAC//MkZEsBKBE8AAB4AAJwJngAAp4A6HfUyD4mDYMJzpcDIeAomEvxFUxBTUUzLjk5//MkZFMBTDVAUCgCQgLAanAAkASELjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkZFgAkBNCUAAsAAHIInygAVIAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkZGcA6A9I0AAJAQDoHoSgAFIBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkZHcA9A86IAArAQGQHo2AAAQCVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkZIQANA9CAAAiAABYBngAAIQAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkZJwAHA9AAAACAQCIHmQAAIwAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkZLQAAAFAAAAiAQJoIhAAClIAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkZMUAAAC0AAQAAAAAAUwAAEYAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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