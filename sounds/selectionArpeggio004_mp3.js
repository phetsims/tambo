/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAADBlgZAOMYRFEfmaPCsNAAAESoQDAitBMgLOIjwsQ5kyCbcQmwiuTNN0FFUjhMA5ICfUGPQ6Qlz7D/+J5d8uDkochaSpVmNZrSDlvhHUlDYwee0dWNwEBBkImYnOvczJhKIeOAYM3dCIAEgKDFxN+mcLhLl8vq/od///2zM3+mnbrL6RuYGn//weDCp/mH+ULNSyG3bo3t//syxAYACSDtQhmYAAEQianXNoAACOA3iVxWBsTdnN0E9KkMQgB91M5wOnGqJzPPWVEKidLJkVF+78rKNEm//dqbP7V1fo1ug3/X/n+7+T8oBwIGvtIFsmADjDRCcPAASk84dHQU3tLLgHXpAXCFPsLYt15J8MBZCxpoNbLFKWJxX88idlxQFB+ieKsR8m6Rj0ct2f/LVeAlrbcbKP/7MsQDAAhQU2FdkwAxBwrngY4YqAStL5M1Ys7sEgicHJGYUpJBl0oZrUMxK6AGRMJwnB8funNYyrZ+eA2NuXaED6zsNuKAPOeIPpdep3EdYdhrF/3AUxMqDWguPAgY/SHzMZmC5DWkwFnTNWhRSPujIa0XgiSARuIEt5rzlazOqTKXVXi1KsZDv7bteydX9E6i6lW8gB6yyWQBABX/+zLEBIAIhHFrrKRwsQoJaqTNGJYAQCkOh6o2X2IAn6Lq+g5MsAam4pgpEJZcBoDvPW7gnFjSYoYRRIHsoldiaodnqGKnRDKJ7+LTX///9FAAq19IGYrHQ7Dgw8oFKDL6B0oeQuwQBgho4YPCyBaUO07cT1W1J6IRSAR4uVaMBxes8oFTL2AFWkVdFRrpK9VtwNKxgA/+3bUAAEoe//swxAUACGBbd6ZkyvkRiepkzSCeTqHoTtEC5eHdc+rJ5w+wjUREZiEwmGLWoClU1NFvslJVSJx6FGmYHRO2TnQYHNkYsOoc+J/kvqvBcAHu/pAzUQcwBeMZ10m2kDJU/YhbxgJQeugULCYsT6nrb1cqzt5NcjgUCrtCiaVuhpLlqURRQ8SlTw0wDQ6SyH6NbqlVBAAATkkaIAF6//syxASASFhTRaBwwXD5CiWh7B2OjpF1mRC2JLM1iRwagzPxcVABLMZ1CDggxbIrQ3O/IpEkhDyRIhKzdGyxwSeaKpiW1B5jFllhoOq+WAAAZEtfp1VNi0pgQgpGF0gMY64HRn+D3mKQFibPAZphhAvGHW1AY9QWhgUgRmgReNQRnDvzndx1TXiN+oVNAAAIgAAqxhw1bAaBMdANJf/7MsQIAgcAUS0tdEVg3IWl9Y6YpLgMzioPYcKMib4NqnrMOhuNa9KP7hQMSwJBQQF81BGsP/SZ9H4P+EcAiQAABgWqWNP6pkZpmS62mkQpmpVOmIrKH7IwmI4Cmf8+noAggYUkRW+kAg06d9P////////1KgAAIwMCNboI+wgsA2Y3Q2YbAyY90UYdpCe0psYSkKFVAzGsCbBoDwL/+zLEFAAHSCstLvnqMOUFZemudM4UgBzqtonM+7//+upzv///+/oBAAoDBoBj+8vvyoydoCf06Yix5gawnDFYCCKZrZKaWiqYKAMg+wxy43LLZm2v+xur/21/tv/d//76AAAAG3gGiQGPbMaaSKgYdxxqkSHBqgaGeZ68QJg0DxpkLB4OAQsNpEpjj9yugusi9CNX//+3s9H/t/vA//swxB4CB2grJ653CGDWhWS0bnRcA4oFCEHg8EcNGwyy8jHguOelUxfKDnj3MAnICcYcSjoYGAmgKbjHJyesvp+j///V//9H/9OmlsNOikcKAuZSsObHCWcfKqYb1EalITJg7hqGQrHgYJYmxgdglmjQFKXIWI0OBLbv/////9f0WIWAKyBRWLALIiFZhVAIOTk1Fd4xpJU8VUgA//syxCkDByQtEg77CEDaBWKMbHRABWas1UdxBYJEmTA4meyx9Incb///2fJq+n9P//9iAAAAFcmgBKCmMBvoxM23M5Z0zdEzDTBN1FwxELTI8hPTCMHBpXL9XtBtXU86lHwso17n///b/se30+oAwMNSRHPyXmM04DyyAxoUIxUCk4mJcwsDMwmvs2mF8KgQsDBU3bvX3f///s3o///7MsQ1AwdgJxuh64JQ3QViCG30SMn2pclO729qagAAABbQIwABrFiHjQQGP9xj4wdqwma3xq7yLFZjdApgoFIYADL4cjdOCdV3b//q1Yj+vX+ztZfN3OobcRA6zTk5APtNdGMRk48+cgccjQk7N4gEmEitbyQ/K6m////7KcfSXeMrWH5dgqOIjIiSULgQsOQ96RHVAAB9uMgAhG3/+zLEP4NHSCcRo2+iwO+FYQA9cEhadEd1H2TTxCFCITz0AgwHym1nuLYp7hTtr3/xn7/+/o+37abuMBpqIgBgmR1ImCPpimJKWBz4DZwFdgl6UipDVRNO2WKmv7vxn+c7LUFeNKqqQYeaZLJQAKkokACFTQndb5WR3GUzAhUjUFpGxCuxHoG/qKXqJDiy2/2r5q9zF4xgIOz6N7+A//swxEgCBbgjEUDnQlDDg+HoHGRKBabiIAQilIrKlQ9Ay8Oj41TLpQkuLARgVprP/iiGasi6u3dMxNMu1kRRFZoCDRfJ77EAA0mnWAABRNDOFM67l18nl/ckf/3r/314cf1zcJkltCtcaaY6yhg/GcrGVcxlzUs+ssF1ZgAoUCE/1l8MP/+J5f///38U4hTCvxtmvKpfrsKcBAVU//syxFwABfgdD0CHAFDJA6FoELAKoFAV8wqrZssSJVTJaajncjssSosFIsiqTEFNRTMuOTkuM6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7MsRvAEbJGwOhBHHI3CQeJBGbyaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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