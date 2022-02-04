/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB5g/PnT2AAEODWz3MPACATcwAQxWRG8v4t4m5Y0gGrH+vEEIQ0J864QJgfEs//KUlhYscDHWH/BDD+7p8EAQBB3pBAEAQBABg+fwQAAABLbkkl+wAAAAAAApUEcylxWEbBYbjKTtTlM3eamWe5RAcBxA6VypWY/T+Lr1S1waL6rSucRXH9ORv3pvMuaX8aPVHAAHBUpB//syxAMCSChfPF28ABkDiqWd3bC1gSAHIAIB+Eua0PmBBI8GxoUDjBQgFHgkCKwrcSkWU6j9Sd+KaBUriJjhajVnvzMt1d7qnsZ///XxGarCW8ICUBSEMlofMKEEMUxHBpw1wME1UzDAIKgQMlzDhMDDKBify5qB0oNf2gp6peEUEQRlcTW9MN8XxQTaJeim2apgHXh0BA42HdjNLf/7MsQFggh4Wyguaea5EwulXc0k5sOdsU8HATEgJBsocOAYml+fvgPRkTAMqGk6FmJpDTjOn1MGkcUStpHsmIbInFwJGEsLanJYVDH8wCQSw4BWcJUpo5emDQ4bvFJ8R8GGQ8Y04EKYPAAk7BdNV8H2mJ54aS6xWdoQwIjE7LBlCLKCIUyihd/5O1Pr/Z//r//+ugAkgUDASheRbs7/+zLEBQIIMF0i7mknUQqKI43cjOo+4jDKZN4nQ+nnzAIQAIFAOgYZUEPnmTwex2HYpllk6m47QrXB/jCOonH1PVe/P+7f/yX////+oAJ/YCSrrMBgnNhCHMIDzMAgfM3JgRnS+W8QBgr0D4Pqy1k7lMfZVff9q1aA+omBkMhA4OM8FGFw99bPp+T/fX//9dUAKAcCZaSBQNNowTBB//swxAaDB/xNGm7hhtEICaLN3DDSlmkhAGok1mBAQFtknQ4AT4+pYJAiw0w4BwzUW4PaQgrVEGL6z0z0QVwH+d6Zr///6v8oAG7eA3pboQCSbFGAYeB2anAuc/ywAh/BhEZkqxPg7Bp8kJci1ITUM1YE9UZUPaWOT+Ks/zzcz8VejwR+j/T+z9HSADd3AQ+ZeKCgZHp2Fh8NAB5O//syxAkDR9RNFG7hJpD2jqINzpSynmlDBxw8IELTAVYo5IBlgwaHhk9qYTAyl58Dpjtf6q3Dv1vTRnvlv8S/6P9ABicJuxgUDmP6IKqoMDx1iggKEpYCCGUl4HnjMrXBkpxbk2rPIg7z9PwGIK9Ap1blL/0jaJjb9f+W/PU/5aoApe4BRQuWYMAobdPOYFIYaMk6fJDqYhBGg0Dsu//7MsQOgwiUUQZu4MdRBQogTdwY6oFDoaFxGnF+6NKF+px/5Pgxp7nlue5Ehb/4DjJz2n9+z8633/7v/KgFMbgIZImmDYHG86VGIYtGiJdHPZNmA4QJDruegBSAp2mvCtqonzjRyjPTPpc6RzbxeJPndFfzH/Zkv/9X75b/LSHIAAIqqsBDGcsQI0YnBj5+kYCQsu4vQoAi2rOVhXH/+zLED4JGvEEAbm0jUKoO4KmTCVZRFoN0WXzjW0zW6Q28yWOZvKPjXpnMNBsVda1ccCOMpS9GgcVUAh+JxR+hMHbWqv3wolHgh/gLfq3QCfwYlZ2+kmoAAAqSPYAAAZXQtxfw5RFhnCEoyBHegrALYEK6pBnXpBhS/4ci6AoaNlhus1y3kjUghRNDGRIyxJtzBboYMpeic0Op0DSX//swxCMCxQBO96eMy3C2A0AB73hMkPMgl18xMmNDDAXHMEdYykxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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