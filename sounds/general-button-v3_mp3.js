/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../chipper/js/grunt/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../chipper/js/grunt/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB3g5InWWAAERDa33GCACAAAoAQcbRVcwSzRXNts10RocAGHTWdcpuqmWGXzafflD+AfBuI4lmZmZr16wEAQOIB8HwfB8CHP///5lxIpI7AUCAUCgUhkMgDQdcC1gqDdpRoxLbEmcmCxmKc5/hziG8WdCM6N8MU4gRh8EOEHDAGH3dTE6H/qOE/D/0/BABh8FAgA1QAAA//syxAOACFzTZZjFAAETkyj3sGAGDwABADBKtf5HZlqYpJwSqWjKIDAi6McKpgLx1uDcVESFz/kQtCsaf/7IQlpzf/O9jf/9B8cpo9ER7/gqmwqE2i20ogIR9eckiRzvLdcm00pCmqOJuuTFMBoCCqOpJnfuY7GtmzyISlWKJ98LpW5HrcmvlZ33P/Vq0y6Z/y6EkPhxAIAmgBlATv/7MsQDgAecbybGbMNA8A2lqD0YalMqWBMVowNIwNtc0HIZGiRQczTjfyw49B8OS6itcjqQCPNOshutkGkqrPsyyrAKoEl60fv/0gjE0m2WlwNd4ARnBHUIJtciCp2quQas8jQpOBJLcL//nFNrb5w3TUYCcblKnEaok5pFXu7fln/0/kf/3AAANRbbUwmYXOL/M0LRcHZI+iT9Kon/+zLECwIFtCsjQWzDEQqFYjHcbM6YpBl0RRbfUYK35WjxF/q7P0/7Pz37fKgCAfosqyqGWlIIQCFhjdNhqyHAQ2JAjKMpgIMbhkCVcmbCrGG5c17T2Rlj34M1nejERLVEQlWdWnlg7+Z8WPArwqWqAAAAEAm21wFeOOmqoIQJMDBGMp+0MnBoMVDyzZiAQjUggO3pDKARS+HJeTgJ//swxBaDCHg5C67sxtEaHR/N7gjmyv86u+d11XI2YwGtbiJAjgH/9R4se7CtXYAHWbMt8eAAGgLxYLgyJR8jQgA0Mqh0weIzASKMIjAqDs0N5zJAfSOemUWJ6HsvUX9X6fme1wfLrs/1/6f83f+vt/hhqgAAMLtgYAXcuVG4LADmAGBcYEwVJiOs0me0GGZ2LAwBMveCwEEoIcZ5//syxBSCCLh8+09sRzEID5+17RzeDXMRAL5yypddXehYF9W6/tr3xGsG1FmiQ/9FPkgBA3tQ2BKnjWgXnAgDRgRg3mJAqyYToU5rEBihBox5gA4GCH74AY4weMU4+YE19rfke35LR6Pr4peye1yX/o/b/6IAAAAVbXUMAS2FOYq8oAwOHI10VU67BszAMAAkFVkwoPYyY5HhgyD43v/7MsQUgghAnvuu7Oaw8YWeTb9ogBLHqkFJ/HBq1AHNR9vry2tn5fK/vlXf/+sEuDcBfjMEX02QKVklcYQScQ860ady10w2MHGQgMZ50LS39fvCvTu9SAM+GRAt7Ci3uR5e72o//3sT//01AAAMASQQBjg6CnaAw3eg6qZCtr7NXKTAYNaudxp1n/5Itc0stzREtx4iv//1WpU0ADL/+zLEGQBF5CEFQ2ki8HyG3vTEiOft8AAudXVXEEWgkRoyQmGYdErFZEi3UoUKO8FBlUxBTUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxDWDwAAAAAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxHkDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsS7g8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEu4PAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxLwDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxLuDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsS7g8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEu4PAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxLwDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxLuDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsS7g8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDEvAPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBuffer = decodedAudio;
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBuffer = phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate );
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;