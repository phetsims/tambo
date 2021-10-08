/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABhBi/PSUgDk9Cug3M5AAgABaAAB1IYXC4Aw2sCYbfDFyNHQrbUIGLI0agJhtukCCFzQMZc9/7a7exw/oe/BwisJhIEvy7MbAAAAAAABh5atdI4sASzNDdd3zm6N4gIihThuuHKCAwUME/Gn3wwZlJx5iylhK93w4NqkVFQFAHEl8P99wmHWPginCWUY8E7kAAAi5aAAJ//syxAOCSHhhSV2MADDsjCfdnRjySQlLnrDJpNqj4rxY6RDeOQng2jkM1CNDIgcqHpVOxmGYYtP5FbMss1Kt25u7Ty6l5/81jd2KoDskuoTUJCFIIUbzRSeCkhkNYyHxRghukGvZLdrqXruGE5IAgYKHkUFRqfsuizGGZmLY8rM+VEiLiu/8rhoGNv8iPAABCBDDE0QSAoNthBAczv/7MsQIAwjEaTZOaSP5EwmmDcyY6us3xEwoaCjHgEhWMBAstKbngPrTDpihEPCGDJ0PilSHBqgmJL2z0yhQQpBpttiTKx1yW7T4BYTYwAAsBDVLSBYZMqgAwkBCoAQQhwIAy7gZyX3BjIto65hMnaUB5TOcXeiOsZHVl6Os3Shb4FvmIHJcJNIJBESsfNf/2wAh0AAAGDAdmU9NnVH/+zLEBoMIqE8u7u8BgRULZk3NJH7JjYIYqIFkTKDwIRlpzKKaSjUyzsuNEuzQx4ws6aAjMg8EGbenJpsygaVV5fe5jbyz7RWUrLHKZkJCiQAGg81BsTdI3IAEDABEmHMxiBQ0GTFKwqlxQTc1DwSOm9CjAJCB9nUxf55mTTNBlo3VMlnwVR4lvvWWr/9P//9v+TVXAwMNiY3F4jqo//swxAUCCERPLk5ow/EGCiXd3TA6GFgwwBKozKInAQ+ZMABAToMaFB62jgajBgh0cJLUd5i1EmfOfNDSLL43CJHUQFlZt+/2/////4sENAUAAQhEY300dKYZUeYUmFhIXjl1AUCCCBc8v015QNHg5O4sgFAwc5ROfZmxeBIfENv4VaHO9fmlDuCaGf///LoEAUAAwmC81HBA4kDQ//syxAaDSIxNJm7rImDtiaUJ3Rh7AgYaQaYgEZROAzacotcAWgYEPDp4A1E7Fh+wwxhOkOWiC+6N4Ec5Ltz6e/9+UdqVp3QK6P///QSBggIZhjW5pINZg2Dg4KGshoLg2vMQANCgVRDkD1uGrWZKmYIAtYWWJ5xmXSp81HMLFD5K9teFmZtWkhAHQbTDSVfPxqMOHpiQVmEAsZ7YgP/7MsQKgwjATRwvc0CRCAmkjcygeihaTpxCZpEZhiCMjQBEZON1N+zBAciyGLGtqu7FW0DHWlOs4tJQ01Jel0Sp69M7T+sENSQAwyADcg5I/mYUBRUOIUzXRAyyGgGfBroKGKE2AihRHoPzipc22GWzld6mL0UhWXG0LUrFdbWfdH+z+hH/d5EAJBcjfBg+KhmJ0hq2JhgkAJjDAaX/+zLECoKJfEsi7unjUPmJZE3cpHqJLoceAIgqAE2oEXSucQADYiCyTEQRatZ37sXcnRpIbHfQ0jdMxn2JjPd7P0ooCyOz/q/6kfdVZAAoIRnXsBrEKg8G6aZEiAFx8otAsCnytxNx51EwgwMRU7WesC1eEVXAUjFRSHd3GiDnrKp/093+7T/7v/pqAAVEAMWBZOG7FPSgpMaxCPrU//swxAkDCIxLGm7l41DyhuQN3WAC80gQcc6BjjF9CIIzxGFJiEBIIbJ7xoKgvAmpXqHhB0W1F6coy9t34+X5v//2+3///+LABhu8GAQtmK3tm01iowkaYHGFqbDPidlYaAFgxmLFvBY1KyF1ItT6g53pdEAwWAKiz/9v/7//t//oiynKAFhYoSNKBbxrDaAxdHB5liinnAgrHYoB//syxAwCRvRFL029JTDIiGXpvTAGOCxREAoHYCnIMVMlcoOZqfW51j/6+7osdT7ft///vH1UW5BCAGEXx4QzTTYEhrNSwGw5lkyLATA4n7hC6KpYjX2QJ9n4S1Pf+y/6kSn///u/phq67VFgbAggwswAMKMcBaOAQaHpYOR71g5EpOqIEb0teKn4ExL/+79v/V/b9X7FgMMDSKAWFP/7MsQbAAXkMzdNPYAwsQUlHZ0wBuEsXStsYEZMabE89BbicMlUwGCpVNj9Ik/vu9X9X9/9F1zmvbNVBUqtUVtoCCRBWLNyPKLDFv8FbQKU4OWDql6LRf/Xr//2trIEmqZ2iBSfBIwhBYCdAYxi7ouoO9qnSz0ft2/fI//pb7v//UoAiW0aiiwAQMDCjNakFVHskLfMrd/87+7/////+zLEMQAE5CMxTODAMH0BZejzBAb+kAGUBzZgUNAApgsZmYt6r18WF+r/4r///F2f/9VMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxFGAA5AHL6MIIDBxgV30YQQEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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