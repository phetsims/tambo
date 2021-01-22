/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABoQfInWBADEwi2h3OwICKYtAAhJec0xOLwxYwA2UOSlQmBBoEXYXRDlgYCYPg+H+CByD4Pn4IAgGP934fy4OAg4EDgAABQKIbAgEAGAwA+AAKFkz6h4HAUZVVog0M6UbgEoWpAWiAQHyLUUpU03mGhvLWEwPtjK8CefD3n9SEjD/+lKB/9n/LI/5P//9SfpVAAA+/AAT//syxAMCCBhnUz20gDkGBONN7eSKaTRJiA5W9M3kDcTQwQtMqCVVmALefaGp+zTVb2SvA0IUBoUnWCZCo9Csu8UlkZkiOsNIk2GlaSlEtmASABODB9CsMPEwQ1QUNjRSTpMq5RUy4gNjsUMxakOVGzTSY4zDk9MQ4BTRZmK9YavGgaEtZbWWH6n//////onf+9UAAAJyQSwQABcIL//7MsQFggaMGxus94AwkQKjNJwwDjmEQuGvMuH2UQYqFoNBSdrSIEg+dvwfRLg+D4IMyn6t9AQC/2//MO7jBDEcgFAAQi4UCiYBnNFGCdFAOfg0DXg0DR7iIKnf//LA0e6g6kxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+zLEHQPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxGEDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//syxKSDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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