/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAADgCABTwACDwi2sTObAAATwACgaHA0C/+u7cpar/uu2YMBwADf+OAIFBgycvjhvl/zNBhXp4wSJDn/8jlEYVidWn//+xnn18qWcr6NrAATlAADdFjKlZC/7R27JBGIImVHI1KdF3lJNzGRgIqgeSfMnAKrXultybcmdvRq19e9lul/Gtaq67nyBU1n6yrd/u/qu2KywT//syxCSBSSBxSP2sABEpDCXNrmGCAKgqABIMeCiMMZUmYPUXLBkdJ1c5oDAhBCoQvkz4wyJAKCzyBBGtHdKWjir8ZCy2YdKCZDWyn3BnJfhh3nccfxqr6eaqY0yxHpvqBIwAALALMCCcsqEIICAIyoQBwRggemFCUYVDxlYRmBBSBhCYfCBhILmIwcBJgfVkZ1nQtKMcfGQbdUpnPf/7MsQegAqgayR1zQABoA8qNzeQAhGgaSyXDd6pPy3Xb9nm98119sv/vLnf6k2AEAgdFtJsJAAAAAAIUmuXcMEChQFEipevE6AwbMKBBCDxowA6MKPDRi4xPgMKgQEO5Q13SCRJEmCgUIKIzzxMhFcuMXOYnPvvhoLAHWCvCAXlZ2kA/HP//aWwetEKKHIDbjai3NedwAFKAABADjL/+zLEBABIpGFI/ceAGPEQKamdGYZUuS7anDcFOlYmzrxXgBgMYNDhhcMHMTYAiEMgoUkyUQnlLR81obO2src5VrbO3s1rxa6xNp+BFfiqijjd2IACS7G7QyxJo77uw09to+ppeTHKpB1WGcqfQ8GBFpolGjAfSfRunKLSj4CABXz/+9dn3N/0hNmIEyt9NUABYAExDTRWkrQAoGhJ//swxAcBSIxROsxx6rkOjOZJjr0f9IjNca8AVmAhMbB4RmZNGvXiMAAiIU86A0Bs3yrerMJWJbOWyPdmfNgx3l3PylCsimIUEhV00QWmsvtEBR4Z45wFikayySAMuoYHDKZsxSZbD6aJskYMguQAUwhxyIHZYu25ygwGFsnliqKilXJpFLnGN51jD62pPdRBCgAB0EEgFAsGDCHL//syxAaASEhNKmz1iqEljes1jL3XhwpmAgJEmMQ3NxAwLCc5CjE1JBk8iWsxGAgwmA8uOgoRAvH+TxacoKBbn6HTFkgRCpG5n/vTIIAGlmo3K5FKPl9ZaCXBgoaEA4kZCsmNFA79PZl8xeOEE0mADeTltMWEZigHV2MYyQ5xXC+k5LmuHVpn+/VgTJC3fNwli7QiOnYkADI3cAABpv/7MsQEgEi0cVmtCZYw+Q2n2Y4Y98KxYhLE6krXLMaQMISPApWEhld7ksQq/clWMaacFQiXcP08DLSEJZS6XTXbNa4LE/8UgLDtlERCBtEuPVIAKzH5Q3akfMkWYXGEwEYfVR0s+gALhwgMdGcDBIRCuWVI5DrrR+rTWJrH+MbsKl8/oi9FN7+sBaUFuvB79QUxQALUAP2vxB8HKlv/+zLEBoNIpHUybPBJUQSNZMmeDPBziVaGLjmtfUApUYNMxlSFCQzMwkhGNbrsS1rLkQpQ5/5Y/MutKpVyQvCoZ1VrXCsYW7Ydd5b/ypYMJigVFEgUiQqOXcPnYyQCTLCVPlfEx0EQAMDsIXBVoOkBsICAOCUNrIVle2Jv7MJEyCzkgzZQgd4hWocKXhQVVQkJQAM4aVvfxRbJHswk//swxAcDRsA9MGxxKLDah+VJjiUeBoh1BhIdGQwgKAkx1IxobmbxiknQIDonnVwZalIRFXVp3FWSP6Lvm1ciD3OqxZXYcIxNPDySKHAxKUAQGzAIKNaVoSdZhI+OGnxNRtatFM1QvUICHDwVWcE6Exoa1VIdBauTIF3wUofbh+5FR47EjWPAonGSoYMFR/HYG/iQbSgph4CGBQK0//syxBQCBsg9HgzwyMDUB6TdjiVO9yAwDtmTQYRRPAEkf4QCAWKABKXQYhD4hIEKGsl3jWYiGIGgjYWGZh7gmHgWabICSbOiAjCJLExeQ2ZCr5Cm/ds/+qoACAACdC1jMJNwRhgSoOGIETUx0sHBlcmWbGNQQekrxxkXkaRQSpCPxPrxYLYx1Q6qA0CqOxH/0DgBaaTzQUp0CAGECv/7MsQiA4b8ORhsa4LQ2ocizZ69SgQZCFLAFazI3azBQPjWOJjBoVjJEZR0AknSbporkbJG8njjWXt//////uoATgAAYJAEIcJG2kFBobMSSH7QwIqBmtEYAByYRUOaQCWYUlYlWzqGG/Q1gSqQ4xr6n/ltet2sl4DAIELWqnSjgpWg6FjzixV014ySgg6PejTI0s5J3Jgl2qkqcab/+zLELoNG2DcMbPRqkL8HYI2djVZVdYJ54UfVr+JaAAAp3YAADTkSVgCg+Hk1HJTGkQRgocOkb00YUAmdLa0zz14xsfxv/KVdYAgJNgoKd8tTV1V3dUQpbaAOoAQaZWVpcCX3eXKnsn+oIiUAQDBUAiBMPTJbBWrVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxD8AxjxhAUZoaPidBp+4nDCvVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
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