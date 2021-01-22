/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABEQBMbQBADF3ouw3GIADIJLkEgaQIEBQEHCd4IDQff2FDnk4YEjv5R3/7v/ygY//E6atl1tVjqeiiTSYDIAECh8jv4vHQfBsSwkcoIpWIS3cgPyjTx6BwDgC40wnH05iOj/RinuMFhcUFBCZE/e/tJaZ5qr/r67c9HHmXXXzH9+83FXFXc3//6339/+PVdi2WWxxVSBi//syxAOACFyPaZz0ADEMFG8wwwnWNO80h9kjHmcUdUty5VqvcV/bc0BwLg3BeEZQ13r+BpynHvBgwbMWxeMN0Tl738cKHulxA2xypP/////R9I5q5K6QgtLxa2OlhJL9UMV3HW3EMfjnTQ/Wo10AQhZlrIOjKi9EMypZ7f9YVwoGCs9XYw010UhhlbkekRggCKP30LdWNlJBJRokCP/7MsQEgAicUWXnsMaBDYyucPYMpgIQcsArS8p5xFICbz1WJWuZhJSUgTYKs6ZdHUtZpVqwaYHADgE2SFUzpUiErSsXGZ1Z2r3Jiq/VrvaV0/WXayO/pcENMlProYhSrw6VEh8aBKODBw6H4O4pRIvRS8ldM7wh1Wsc8UVLEhpF8msWH1SIhteh92Iq0NqfmE9aq+fq7DcjJU2ggiP/+zLEBAAIZIVflMSAARggKi8WoAHF6NWeHR9y1MYOJAIDyZ5FNJtmfJxSQkFPEoqmziFRplRFcVob2anak9z49mUlZIVAZyRtPkP/3+EJRgAAAAjCQAAEACIFm14IJsl+BkBpK/AEgZQ/cCsF6QqnFUuKAXqt8elRrJf/JnFlYx//HB8QkyjIn6/+YeaccmPv//zykUVVTEFNRTMu//swxAMDwAABpBwAACAAADSAAAAEOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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