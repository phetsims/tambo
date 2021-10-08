/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAABRogc+yMlJhEnGaNCnqAAkAABWQIenZ2LBh0GA2gTSDblrNGj6+Td0flCjthxlZ85yEuD5+cIXxOhQIBjD5SoEwfIZM8Qj5KgFgkkTZyGGCoEwUD06x9lOXCGVIycYAKCYcYCwAmF2BTGRJkA8LmgviHPfFQCmLZ7/8jH7///nocPCT//kY/J//+oY4ToE025QApvrXjF//syxASACGx3RLm2gAEWiynXNvAAC41yKq7o6U4g8MVGaef1YMjGwwXUkxmCXABvTzOFmJOPPfOaiGyn6383UXEnfS4PP5TmIY8v57//wGAAP7gBHRlgZKYKGLmLCGbs6lzQH5igoYG5FpGvrZdbJYFq6kWqQxc4CdvDeaqyUeMOv49t1pE0PFA0uJJdhVnL4mSnCpKIAAAAEOBNgf/7MsQEAUh4N1e9owAhBIppTcyY5S2boIafrMwvMwW8MZF9V4tNltaVP871rnBRIlUmyDTwVBUmsS5UNBoDHhK4RA0W/8rLFcRv8FRE//lQWDjawjEFAGIFsGYmQleF4Abrhugm0EcCgCULaJgLsYg1xnbX3/jYsWFkyZAghERDRdr1Mf3uDpRiiAAAA8/ofvAgG4AIDa6uVTVQWJH/+zLEBYAIgJdGTiRsqRQIaaWNpJeYlUdxHAk4QuQDtJxLilvWWtNGRwroWBILNoYIh9XGKMCM1XASoywwICIM/sqk1hKZQCZTbDBhSWeQBfq+kCAYhJW6MzHCBXSNCywKBg1pONUljg8NpELNUo06WU+rjlLPNOt/cieNOJHWov5LJr+FBR3Dfl27/O7y/WVd/8IAAKmoABry9VfJ//swxAUCSJA/MS15hPj7CCOBz+iQMjyYJGGO2ZAaEivBhZgZmFkSmbEQxACENAQIxdFawej84oJpVofhi0/Vs94g9xJufNNB/FEc4Fy8qSC4CJQeIhMDSmYAURhTymHHnZpj3InCYeYCUGEfElBomgvOYOgCKHdnmmMGNDlmEAagjXIfcK/BrZv/981AF+oUMRsCww9HgCgDmAsB//syxAaCCPg/Hm9s6oD2iCVdnxSukYMYh5m8ckmwBqeZ+IIxkjwgHra0uYsocRxzWZ6aGODZhIMXhd6Mv003xCHfg+d9n+z/9/XS/b9dn6joQAAMRmBnMUZIkT5YMeQjIy/2fDATCMML0WE3TxWjDNA7AwMg8A2lAv9tH7duYn/CI78Il/m////////xlS6oqUONkPhUCJCg2BjN6f/7MsQHg8cMQRoM+2LA8oXjAb/skOHBrTaangwpiMUumUI7IYhQnpvcUZkimLkBggeXWbrFnVtcmcf///6TqPxQIBheZoBGzhp9BYYnqIUGaXA9JhPYOuYQ4MtmmEAZJhBACEJswlUiycNEpMDpqNIgOmzoeW//////6wMVWQ7jAUFyMCKBgPuDFszNlbmML8Qww5ErjgGNxMDAJAb/+zLEEQNG+CscLfskkNCFI02vZJAvJTEOrGnrhickdEP6//////6/7tm6ABvyzZbpQDFlhzTpkHJ+mIS6KIQZDEDWYNr0lswuQQj8bNEQHAphMtnqto63p////f//0hQGQAJTJGyqKFgBwSIxl1ChkZmBqOAhnqSxuAiqGFaA2JmEyahDU3sh+nuN/9X//irfsQF2tolihrSV8E2x//swxB8CBmwpGm77KCDpBSNdnvCKywxrvo5jYoHRqYWSmaT8xhYfgEHITVpOjHrudl7eS0aWnv0akTHcj6hnd66tPX99AEAaAV4o19MADFnMgYlIoRl4IMmEgFOYVBH5rRAmlAtIbMJMoRL9e6QUm2N////qt+mv7FpuoRuk3acFVZBkKlDFZTIGlTmL1jYcRjD50j8KVQsLgpkh//syxCuDBygpEsz7JIDnBWGBruCQAslsUflFi/z////6P3PUohU8BK7yKjLj5supC5yH2cJjmEEb+pnFfYDJ4yUIYxVlI/1Gcx5AIH9EjK9daQz4W//////qtYyJNRQktTUJuZSgYAJRRSAEKWaoYKXyFwQZgOZlTfnM2dvp+ljAUHsAicorgmaoTb6//RWzs9v37NwRuJa5BFUDPv/7MsQ2Aga0JQoM9wSA3gQh9czwwLeqQAB9yNEBhRgm1sAGkNPvAgrAj6dEFBwKFR6uq9mNTT2HVJuaz6/jDDKL7f/XYqvbfshoIAABOS1EAMBxbgAx+ONrBhIwMKDTvkNKwGzDZkY2yjqdY+7/R1ftzWUL2TYdQABdDg2gGmqeLy7i9QAAAIK6IAAwrXZagHPjeIitglbBqUGWVv7/+zLEQwAGWCETQO2C0OaD4XQdpFi9D//qt/Rq3Y6GIaoaHxcbGk1AAMoemivgA+24iAEGVrAYsoZhrG8BLObk0vtuFZBS2y+71/WtH7Iue7lyLlvT0taZZ3FF6s4A0RI8ITB65v6bNv/mP2/62+77z9jpmu0Pv+/E8TVd7MsBGnq6qHFtNG2RTKdPL9GgOTRCf6GCiVKjL5hCEP+I//swxFCABiAbC6DnAkC2AyHoN7yCXmH/GPjM1VVVVVf/2Zi+qvVb/4zKqlqqhQwEKY2bXVY1VV6ql4UBPalqXBQ2aEVVTEFNRTMuOTkuM1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxGSDxtEO/gUA1MjrIl6AII1xVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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