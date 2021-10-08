/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB1BHOnWmABEWjO23MPACAM4AAka0C2CViDZjzZoUIKXmGQHLmnHZgZuIghjiBjgxeiMuWAQDhMhMyefxsGZPP38oscKBjgh7vuRIAKJJltl/4AAAAAAAeIQEujEqiqRmMJCES5WG2gJpbTG4Ow/M4mn/Qr2Js5qIuqgsklNZOqlEOMfLXi1GSdQzuEW0dE8qAAAwLYAA//syxAMCCDhjP123gAEEiuWNvCUaBpRaYSCm0Kg6aZJnFNZzqgY+cBgqYYFmJBqWAkHQEu2XFwmiO5lSznWcKmje3hW8HX3bwt0/3XUHQ/5sFAYACqnqDC8MFAAYjK0cc9HHDBpgmZQQhSpXRTUQnFAiSUey+KNyollAoIHkq4CYarC6S3YyUWYjae5ECrd//DlNiAACxKE0C6BbAf/7MsQFgwhgbzhtsFDxHA3mTb6ZItBjJRcHVJgRkcS2mcgBlQ4kyhGWnb+PtLXw1x9GdIJksprlMmS4Cg6y44yjbH5yKe05wYGI/v2JDYn4Auuq25bxHxJsxhAOAFTHWY1ZXPRRiMTRQRuKAOQJOsy1I6WV2TO0w6Sw7LS7gfm9kt6zyIwPOZ+BkYQHFqf/C3p//+hgG5wCQFYWCTD/+zLEBIMIdGkkLfUHWQONZU2+tSrxQUTDm+024/MxgnMkFRN85yMUCVEQLGBASqdpAKDFymGvanI7suWZGZeSHQoo10ND7uHsPDn/79gtWEzPwBSpvpilULMOAU5TLsYQJ4ZCgQ9OwiJIhwZaiyx9mjv225SaC56XS3HG/Z1fwfNN60notpag8MGez2/u//6VAGEm4IBuHC+wVGDp//swxAYCSDRpLu1xKLEYjeYNzRlZUhKGOGCWs0pA08Q6K8x4tJypSP7GoqwEicWBqgRes01nKVlIf053z99P+/0iOm5f3fR///9Yeo0+yXyIBggABwAMUlMw6A1DDFqjO9soQjM898y6I4jYzAJOUFB4ETkVwvSE4xN36KAAwrAce3hDuTP35zIZyYUyDMn+ISyAC3LdqAAB+ahk//syxAWASOxvWaw8zzD+imZNnjEV3JHJkEvdhpKPigJmMTjXO9IRmHkCqmDRKV0S1IC1jOP85Y5MSCkCH+gU0ozUUqNPx272KtThMKOJhxfE5TgmVUjBYXxXAW5sXB65hsAyY00YTHRJGOIapLBEXyyrAEARSqei0NSmHSQ/MpWStQ6L6Im3GvCmsSb/VQ/9phwACuMnDtxuEFAJjv/7MsQGAwhMYyxM9ScZHQskja6ZIlHP4HxIAwAPxmmJhhEGJh/EgkZBgEDYAANr7gthXLGdmFBIAYAqpKM51ULEenPZ/PqtNKhQTIERxwAhyCooMRAK0AYgsiRNABMGlBB+MSidMKAAMja+NcgkUmPB4DgRW4pi/z0r7lTL3mtAoCoCJSTl5o8wz6QWiqx3/t//ag4AAAHJdov6Bwb/+zLEBQBIGE8qbXGIwR8NaSmnshcFWggYaHqGTQEOEZ41iIjI4SMAxo8wMgSAh4CI5iQEBwYQPZZDoLFNxeOBwy8x25B1GfiR6RaiAQapdQ1tmbRXvfpSCabcGCo4qoNLVEaIiIUxwGpGODgKkYyxOJI96yKt45ruMnyxlWKW2neqTQDgdhIIn0oSL0P0PnmwJ9O6SgAAAimCDqAR//swxASAR2xhPG1xLHkNjihdvTFPEpiKw4gABcIXQCEimJjZJrgZaA4iNiY7pINEZ7B2yElTIU2qu13xUoQq4yhd5VFpCRiwDLsEWaepoozJUXWnIcTERUZVTpYMxkOCj0FNBgieh9D7wlVcTR0Cc7LaU/cmuQwN5fCnK9Y+smsQkY/6QmSHAyiWWkAAKUgAAAsuCvppLKVG2IlA//syxAiCR4RvRUztKLDhDWfpvJlXJkEg3k+NKBQuFAEtagUYOQvtmVDLVmD5053TkiO+N9YuviT/LfTXQp2mxoFqSCPM4X1E0nVwR0FAIsOghXOsahIZRDbGwM43kS6lJK4rwAxwCGDcpCWXtpEQ53S1v35WuSjUtQAy0AAARJmTVA8AQOqVoNF3zdAMLw71BQgkAgMjwTQkGxgCVv/7MsQSAkdMaTLs8Qjg2w0m5c0lTgCVz8xnJhCG2pRs414U2SyOm+uNZ8NANeEExBpChMMiwDXAgQQiBQiPKksIEwUGFC4Lkj7r2VWUR4NIzyJ6UGkkqnW2vrW7c/H+of4OqgAzcAGTpJfEADXaDgsX7Dh6DjKYFhZpmAAoDgEYF+gKFTEhuV2/NZ/21pKIRZ9bUlgxBiLU//Ce/V7/+zLEHQNHUGkwzhjwsOWNJM2elOSgTRFJwgCZsX4M8Ey4BGGYWAqYuJyfIDeDjBMHwQMDgAS9MnhnJgUlrzvaptVGAQec6lMQ/3f/6jPXTHReMiqMGMWUxc1k858QWJowORAyihcwxFJBEEAcYEiIZKisXjRJa1CZRJpRjQWbPNYwE6FUu//4kDgOawFnzmmWBnQC1CtjH4cMxyw6//swxCcDhzBpGA10R4DYByKNjmTKvZANJytIEhBhR0LrVuwNjTP9fxs5asiIqWf/Lf/////+tQnIJAGuAaNRprSJykgqQzgLjF/HCsDeTcUqKus9P66P1f/4oZYBGjiY1AXQLGWOYOSMStAB/8FTIsVCgeAoqKt7ajS0MdUhaVJ/rUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVV//syxDKCRnwlDGNh4vBbgB4kMIwOVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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