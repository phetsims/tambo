/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAA8ADNZQRgDGHni23MIAC1bbaiNgdgM+wEHBiogUAbxA4MT+////gh//8Mf4YzNI0kYiNYjDZaLJCYAZZgbhKQTNx5Vp34WpSu/bhLvzLYwWSHokUhx0EBR4FA/Mp8sOz3gcWfL9YqH7kKIkzd9fLvSkB201St7337UyHKf7X9Pf//Ue9/6irjy/l3s5gqCo1lPVlVSBj//syxAOACFB7hZyUgDEUCu008ZpKfZq0pMq3UhCDwXYfD+n5X+IUp5YiEYMB0CgRCwfQF0AmAUjAlZVJuE4ZaTbKK0AIJCxUAwrWLf////l1oFP9Yo2m1QI89G8bsISUXc8TjPs5pDlVUzUq1VJLFYcIlvdQS0P1lohZFx5hFpVDCPaSKlRsdgIslDzfeqxt8iVd+v6aClA3ydRso//7MsQDgAhYV13sGEqhEJFpcZMJqE0gGS8ZU3ekWmMRbO4kqZnMgAHAFiPmBRdQFgRZHZrTNwZcRTYLKU4qxy3ieKohBwSNif5UwYc4W/ywiEYAtIWoggTByJ+YPcFxgdYE5MVlD41ZJSYBdPF8gQIZtZPy/cZWxBR5Bm7WwZdGkolTRTQXLpSOcoUvf3in/dyBZwzRXAF3ieJEAxD/+zLEBAAIkJlXlYaAARIWb3MegACpLHqwdgk0mfJ913UT0LiL5W+nIh+DsKATQJ4F0E4PF8c7FxaaaCZ80SpqZbfX7J/99fN0p/Onf+zSaVmKSAKAgKAgMAAAAAEBCVMt4sfsyRdHO3PTH0SBFi4jhEgNBinEXeeDSKeby9zBMKun3/pKZ6L//H/6T/p/82bkkAyj/5m7WOWuRFpI//swxAOACDgvi7zDADEQkW289AoWMABHxkZCUEwfjodDiYmpiWw9NWjIAhJEFkFSo4GnxwiDsrBoGn/g0DT64Kgq9BUFQWBo3WFDf4B//ljZRUwaFSyREkApYqDmkM8qYgtylZx9ZL7knEF4rFKLgqfa4GHahJbD5q+ZdeybNpd1LOzqJVWdmJgs9uNUoK61I9Pf1runDP5da2kA//syxAQACHita6eYTzEMFSdkzAigHGL2uEMDLL6xtFmUuujunUP9ODzjFKbt2J5yt77uOmiJWXQ6GAbIjvu17WVn/dDEccwhLJLW6dXU/dcsEAvP8BAST22Qg8WJEX2Cxxs84/BnOt15rGZwVs2FEtKWVPRHZitdbuySkumtHlb0M/U5QwcQRYSLI91T/epbUqPPogEGy4Ldq0ABj//7MsQEgAfcrTesFG1owIRiqMyYmD9U8MBcisSsURTFgBykNZkSUjL+oDB8VGCT310AYfb2ZlVRgEvbASNp8ptD8y7lYYlvxtFsCgAAYAQABAzjzrwIrmT2cuLIZOOOhHHQELC2rOtlix709VXnYiej4dx2rz2Vd/xL6QQAAHCikADAVHicCJrfesiRcXCNaoKuuneW+r1dXxFDvZf/+zLEEQBFcCEJoLHi8JuFVvDMGGz/vqeWI50KHuGnJHLWAAQIl4qgkpSn8oGq1rUCoSk3UAhEYtCgKWWwwIDo////4sLVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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