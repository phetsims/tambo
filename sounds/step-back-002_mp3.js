/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABfAnF0xoYLDJBSVlvDCGAAANtyAMBWcZsbg8Z3Cd0qZ5kGMKcW+AEmlMWGF0kzggJy79QDKFy6D+U/t///kAAWSr7gC0wQMGWgR7XIe1oGLFJRMiABscxqK5k5OisfpJ5fYx1VXIJ+xTtH0T7Cn/yT0GgSTcHBkK+dDFmIWSKZ+bZBqJBIGicW8YpAgBhhAmGz6fDw2A//syxBKACEwtIu37IJE0h2WprugWNFGtkdUACgil3u5BF5sUqp1Xbej81/3+tzNX//2gB1MUA23AYRWbSOYID2dTficnfOeFBIZnmyNBoDwphF58Ix6fZ7TQKWgZCy1sjyZQ3FqPPu+/VuhJIXcep//cgBN8x6Hrez/5QcS4rrUAIRSgWeMOCEyhcj/c4Ot0zuuI+WaFTkeSCQGKBf/7MsQOggcYRSLObGNw1QSizc0kUovSsChTNZSSKqxUj84Mingib0+au/9uj/+7/6AHZBOFbTApaNgwY4GrDOvznJ1bIGQybUBSQVImrgiDLkqDgiHnX/I9R7WWf4BDTPR///5Xlm7I7v/tgAAAPk5DyQ0ZQ/zJIMMET07j3AnAjYxAg4cguYhZkO9y2ycKLg0oWI9aTEFNRTMuOTn/+zLEG4PF1Dzpp7zB8AAANIAAAAQuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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