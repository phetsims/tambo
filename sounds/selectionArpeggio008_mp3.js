/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAADxqw6+AC8wsEhDSOCsPAAEZHIvnsSkbYgY4EPBCZAmQPus3LMAxwWQCwsTdrQ7/+X7vWD+oufKHLgfB8MNE6gA4gUOcTuM0xeZjeDtrQdlQcRAN8TvFA+BwYJQEtuhLWu3tgjgAQBgGIn7l/JYcg/FPtPu9SOcCIwKCb+GrFZEpmP4Rif/L9oD/L+r9dSooEteZFSdPzF//syxASACHh5QhmngAESiajDOPAAquLZD9tTFFIBp78WNAaCDECA+hD6BiUgUmbHMQAoEZ9b+b09FJrOv/6//1jx5Y/5cQAT+ADn/2n//7U0gQjX2MGDEwOFSFBG4VYDQgdaEAFEZoBLg0JlAkLXOa/Rdpgh0tnfhqznJ9DhqyJV3NSuLWjkQUD6Twa27qkfSZl48rWQFu7/qDJ2o//7MsQEAAh47WE9koAxB4gqaayY3E7TtMCGaBGoCjXWZM70PU3ccpUgDMYztMIsVlIrbqZnvUvzK9zG/yiqeV7mZ//2tSxjFv/s+IhLlfiSXAADOS2SQB2HIchyJa5BkYBqpx9pmcIXAmYk/j+Q5GLA+EWbMjs0Qg4ThhwP6w+u5AAIwA6zWTHbm0m8Xz+qslzcopACLbjaJAcwGAT/+zLEBQAIbJtdQ2RlMQgMq+mUjZYCTCqYCII4yoAEouLGZbVnbUaVVqxmOqYz/YRtkzlYQkhwqPTy2+H/1DMvYU4rfhrVo1e9ks+Mfb0sAE83I2kBGIw5E5hAY5KiePnFgQDNvEmItSWAYZtAwxDF12zK1xYvhE94iFDRASCcTwfFw/RnFFL/rT9mh3/ZreL1iIAARSkaaQFh3olD//swxAYASMhRYayYbHEJh+vwPKQu01CkhQCGNDQ2HhCEQFN2LBI5IJMOJMzMfIxkpLmQkyYEJ08JhJUPdRv7yxOdBVj4lxEay1uVxd1HYp1AAAlv+NXjYtNtyGFAuW1wqClpHLH3oUzgGADhsSIGLmjnN8vNMHw/B8HwfN0g+fRWD6TEHwf5M+6XJmsXy8Drv2KVAAAI3/wAVMyV//syxAUACJhRY4TgwbkFFWqxnQ2Gmtp4BUieqWFEUkJAlvqZLYszUtGkS5Ccaqyf8xqqZlH8sUJvH4+b/XM3O66bWKHE04Nd23+50oo36sVAAAAU32gd5dd3KMgkcyiSlUquGQKIowPJBzJh+0x/CKQsQDZXdieEc0do+R77n2TPTmf75H2ufTT/9xbCoax36hUAADvttKAB7XwiLf/7MsQGAAjYf3GlvYsw/47qaA0MPmjgqCckThrJxthA+P3GwPsMgNIYIZgrAwh8nQHwSpFRVbQDIpnipmDGrxLq9buds3370fLCtD1hXiSk4AB03EgAOT0pjSpS2wk5TTBWYcMArbLRgUcBOsQGozPIYAp7Q0LkrUl1zpa/sqrDL5tVBHhYIzxYKy0KQnLclQwAAAbLaAABdoNx4dL/+zLEBoBHIG9RoGhh+NsGJyQdcFYCMQJBSAeEBCBYChdZAUG31GQsfBetb1LaAWJkBBWL1LL6XSr9VdZAqgL/ckQACCg0MENqAGnwGS9GXCmGYnCgqBWgdlBZgEHCNfmGpEYDGZlJsHp2wYFAZEDGay7EKnn//mVAAAsQACJiVAVBK0yT4PZCjg5ScyIQ5SIgwLgoiHxj+GEwwbHj//swxBKARsw3OSXrhLDShmWVvnlO2B8AxZBwOYa/0Zpsb4mdo/1ADB+6lPEEyzIKMClh4IsAXIp6jIek5CfCEXmBZsf1noFLBqcamh0IaLBIDwGzzUd6+A//6wAgBk7EXMYEzKwc2EEGRM6c6Bmyb4UCwwZWkm5aHBgVGEsCmM6NmHYKGDQCq3NZh6M2gYWIAAR4ae48InBkzocO//syxCCAhoQ1LKDvozjmBmWkHXRcCzU2g4x1szUAEv4YCDua3A8YEAiYlKOdZg0YdgAJAK/UOy6yHEf//////T9i5rOpG1VDMeQwyVB1oYkJmvAvmJQ1HAhImBwBmCiFGjEImG4imlDoGpqUsYBwIZgagMJlsif2VC63MsZE8o0ZjNBbJp4YFQxgM1gWIAHeMADh2DvlEDFUBTBfYv/7MsQtg8b4MxgN98io2Qciwc11RT6hEjKQSTBcCgcBqGy6Xeit/ZX+YXr7MQTNmmAoDPTFTI+kIMxqg85mHQIYUVJ3pUGThIbJgRoNClmB4AM9K3ZFO2uG///////u+5nWwAAVusaVEMrgxBlHYO6VRgkiVZxwjDwsGNxHQkGD8mhkg4FHYtS2joylm3p7fTsnSitTtV1P7Nn/0wD/+zLEOoAHPDUUDfPKQOgGJGg8aJIiiggUe2tEBBBw2rwGgwIZKeAAzg1MhqYs4aPiUYQgOYkGKcDjQRCejS70tprL2fs/9P/9m/7PYyi7Z0gEJACAxDLqExJkabRG0MCGYaFJRdqrghRnWVIFmQqGxtIOzUO0wLAJvhldD////tt/p+T/1kAAAAJaIQABOWcoAKZDgCtw6IGuUEHM//swxESCB5QzEuNrpMDVBeKojOiSF7QSG6joOGRzHnEZMIq+pbQbto1//X/r/Qz12oZKHGd7tAr5SlMcBZCLLLNpB2yJ8nFUHdMMOMOFNovZdDtMCx3///9XTxgwtBCo8RtYLERZo0XQVC1h4oQbgAAAIlnq6hxRNfJhKJKdw1KXKdjQJSKNB4TfTpr////s9CnmBA8VdrxgobaP//syxE8BRyQvD6DrY0DfBaEAHGhgAcilCBtMNkAAU3AQAgR2VS6Puk1odtqIMnoVBss5rKnUmHLEYq27/67dfx6qR7lgkVQdxC6cTtrVAAAwgAE/Q4qMFlZhgGhICt6f/9f+v6po5Grn7IZhjplZUrqcri5Q2kFr7LqZeX12ORUFaACCzCpomYbxX5Oa+HyyeEK//+H/+GcKJwizXP/7MsRagAZ8KwsA4yNAxYThqACwCsjlqXXoZ8KGFBQ3L+goqLiwFfpMQU1FMy45OS4zVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEa4AGCOsFIoBYSMcd3uQQijtVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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