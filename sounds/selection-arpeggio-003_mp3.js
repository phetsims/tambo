/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAADx0kS9gYYSwkRmWQCnqAAnr5ChF0lDYPCestDUFoRfh2k5QwnDp/+zf///+RuruRqEV1Jq/vo057pRvDgYGc4t+hFAz2OAEAACeCX8W8TNC3N5BZwgYJ8vakVhbFQnHAgCuA2Nz6EgLYfAtjplSMF8AWKB+eeRi2kgEWTn/5n///spAZ//U84nIDn//lwIs/uVDLjTAg7//syxAQACHjvRBmmgADxCalDOMAAl6BIyZUadghzC7eMSdAys5QgFCABtSMwMIKsaRznXXXukPcnIP7+U0jRJv/6C02T/Xb636v//5//9/hlKUWGiQo6Zm4GCQ2CzAFwaYzQaXBycjDAacZkaJUufyRiYEWJzuIkxr1nVmGTHq8+RBSsUUv/+TdZH+nsgAN3gUEddp7gsBmFDJl0WP/7MsQIAAmggUzdtYABBQhrZZSNTvhxyFYBjomKwYDpMpVMvTBYU9wehBAQkAHoilpOtKzWzzWu3XNOqu+2tUtvEXE8dJRdcLcgIjFTuGMsEpq0ARr+lCfgB5WXyteQAeItjzJVMtN0A4K3lBImAE5ohOO7tiMHxGOFQWPCgYJmDE2hxwnMcAtErkr9TrXSv66tpurYgDWyy6wBgKH/+zLEBIAItGlzrRhwcQsF6eW8JUbJNFsUfdTSs1tdMZYZFzkJy9BhxisTSVixNhsUf5LmyDI4SoKvGxTVeHhmoUSGHELlloTXK24s////p9VZAHUvSoH8l7mStnBkqgaIHGl0wOEgLuGBAhpqmI0cSJlkp49l1gSNlhMRH0Q7EqiJV0ixR7UDS02/iERdbhHLySn9VQAAbagAIahl//swxAQCCBRDNyz1hPkKiGRNz2yQ0k9RUIxvzMOZTYASzGHkzF4NDRF6DkwNAUIaGjBw8N1hg8dXnKlz6riUTrJeux/coUdbXtoRWMLoGVQACwSHMQAwAikwoZDJ89MkCykWRnNqKmQxViOzPrqHN4IZc7V4NGMzIRYwoHSKdWJQ7Z5vHlNe///5U/6v9X66lQEUBTqL4g4aM0Cz//syxAWDCIBDHi3/ZIENiKQJ7YlSn2AxK4FcMaXAfTJ+xx8wZkD8MJOSHzB8Qnc0KmMNPwIPBULLmInsvdR5uf/yXn///M/////////rAzoEhUbhEASOgPAwFcwBRNAvQMZRIIJx6C0mIoMCaYiX5vRg+nkAwdJixoNCaFi63DiFL/Cn+Gf//a3/+uPvR6dn/QoAh0saAFuHGJoqGP/7MsQFgkeMKSrs+ySQ5YhjAe2JUKKdWBjLkTGOgDAZ+5YBhuh0GJEuYZVoYx2WmKQX9XM+s1ZlwbqfndIu23+wl+U/3f1l1hEACOgJDgFpgAg1GBYKmYyMcpo4ChnAtTiY0ATBqY/fGm4REcrJmVHhhYyAAotWmIyx15B3gvwKbonOIAIwEXMYQDXeEzFH2TI9E+NI2pAwyBHTV1f/+zLEDoIGyCsWDfuEgOsFY+nPZMozOOwR04WXDNQnMZg4BDEWBS9GwQzLjEllQCAEaIgh2NRliRcEwmMjgG0P4mcw2EqTANB3MXB4cxcg+yrwQnodF9uhDdPOddRp//9tk+N/9//T/+tcqjxIBlQSFUEwriMU9wgxcwODLgcEMFAMk0klNzYXC5O+GgNBhxoJBaSCx3biFvO///////swxBoCR4grEA37ZIDQhWNljuSW/dd+oxTXqqpAqwdyx/2IIpnIRmuixpsAxwOsJk6VxjZ+By+RBzOmCAmKzqGa2NrmR1diP//kevbt///9NQAAABxuM0ThciL0MbLAAFBqYt55wYRn8keGPE0n+YxQHo0vR4ZW+kblFJm4Ku79//2p6v1dTez9X8b6QBG5WiAhldmIDXwIbmXN//syxCUCB2gpF653CADXBKL1jmCSCYLDRzmxFAPEtEHyEXsmazaE0dgVw87To1nrX/t+JRf1YF/993/uoqOWOuqAS8ZoCOa9iea3YKYcCWYNf2cKD+baF7WRPrNVzT/////2ZQkncfKlhyypBqyLhkhWuGT7xUAQIma1C9S2R0PBW5GwwwYU0hh4WmVESmDYdlpGVwwDkD7d////3f/7MsQwgwdIJQoMdwSA1oThic6ZCEfoVZeld1jWFZt0gN2JHgBAiahGFGVgwRq/oCjA5WfNFHhbAB9kLBLJoFnrPRb////3bX7JwE5KwieJTZ8gOFgM4I3gUoyxH7yqxJPUxcHBVSbwShgoYn0HLiipYalNNjr/8q66e/OeRsqtd6IjMIRQaBxrZ8lijs4iLdUAAACWy5kAQLO49YP/+zLEPINHDCUKRONiAM8d4MGwCfEvGoDhofgz/i9QXBqcSnVo3rub+Z/u0L0vSBFsc54JCNoCHmlNIwtUxdpGAAVYIQ3YvgEJEcgZLjJkGDgCsz6u/Z/L////0f/ypUQZNHYECLF8kaGGRHhf1QrPyDO+cUHQPnSC26j9QqLhSJoFRK5v3/n8/88vpzqqtJV8EgBOfAto0gDQoJQ5//swxEoARtgdC6DkwsDpIKBlMI45GGNKIKGY/AdeqVcZG6gCHFDxQCQwmpqaKJ88w/eLIIV8///mXL//EIWT/7FGZmZmVV/qq31S9v9VKhTuHQglTEFNRTMuOTkuM1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxFUABgEfAAWAb4jHId+wEI45VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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