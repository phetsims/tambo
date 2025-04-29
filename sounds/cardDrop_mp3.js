/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAGAAAE/wAqKioqKioqKioqKioqKioqVVVVVVVVVVVVVVVVVVVVVVWAgICAgICAgICAgICAgICAqqqqqqqqqqqqqqqqqqqqqqrV1dXV1dXV1dXV1dXV1dXV1f////////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAN8QgAAOAAABP9ItQ+nAAAAAAD/+0DEAAAFLBb9VDGAAbodpncfEACABACA0Z/i+u76AYscND4jB94gcCDp8vrk/iD8ufghZ/n//0///4gd/Ym3Co23crXZJGHAEAQBrqmECpAF9MRi2HgqM96UAzAbpPuPw7ARwN/rL5NlUgBWH8iTnDRAhg9k+iKDGbGaMX0EzQcsiZVMBHKhlBc5Y9Ny+bnJrIeYlcm1k3/rSPV0C6UFnSbIv//+eNnJr//dOPXJVcKINRk0ef/7QsQEgAoQk1YZnAABRxKud56QAroFwFpBVlYktLMiEEjZIGmSXnniwPMNyt/gw5pLuQE0s0nsU9Pbishcd0OriXXVw3nrUWYJOXp9w3To7FXn///z9/rdUFE+/uNgAAEFyAAHAN6cy0PKEgoSA8rP2FeVbLCULwIkZIPCUEgdRJSQ4sjEgbHYgeDwharYNRITiNg1GWSwfEqIqcEaj2lZMGiWDTPbWFhYcMUjemqWYzMhARBbdv/7QsQEAAmo3X3sJKsxTY1udPYYrkgUYTntI8hCiKLsuxOPs2WUAMMqrG1U/0ZJNR2KgWgmzPLgZS+VhvKZEKqa2bkMNs3bpNZ0Kduqm/ZN4hJTOOscurq2en6ORogFxuOQHAT1MEqH6nBcXQ4A8O4FTuERXHglLTB8rk1FE0lv2zOqUiRfxiQCqavd+gpmZPAK0wPCiTti890NFUDrFuf0yAGVcoiTWW997WIdTe0AAAADbbvwmv/7QsQEgQoUe1mnpG6BMBMpcPYM7HNMiXHixHyhTAcyjLaXC119OtBI2dBFYVdJuRMnjaodgZVPaiiL4BGZ04eDj4Sk1MlVCEjaOU+TLPW2U2pKnKlt9jPC3vY8fWQEg0sHiuG0AZOUtwjxjMCEBsPWALAOeNviedMWqnWXoVQSszMHnEMqVVfbL1LZuS+pup8x9ZZ5pVrxylqrHqpd3q1ds69lD8YXsLKm6aCq2aJoFhCHEGosDf/7QsQHAAosa0MmGE8hLYknMBYUPETjk1OGCsFJUJZoFUaxrWM07Xpt8XsnEVJ+4Me6YU4NEqQACYaAgdHGxEFTw8RCNGdCg47G3hPaAnsbEs85Vw+z+30FpuUwKXuIkVgbEsDIBQRHVk5EUqrgaHz4imyw+s9REFs6jtBI4JXA6WEoxskPDbw4eJEQVW4RBWeASjaxqgq5rojHLQSOv//1TxWiIBASTjkaCjydWAhRoTjonZvkjP/7QsQJgAXQNyuhAMZglwcZIMMMdPkiOkSTAqEgaEUFXHWyz/+v/+3/b/6//5Xu4iARFbkAlE4zUB1JI02o12k4suLwyZQUDxo0FRbinW3/6hfiwrqF6kxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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