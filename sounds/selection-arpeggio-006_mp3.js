/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAADRig6/kCMwJD/jKNCnvAAK4CHeVlHQIPcPUrQi2dnKNDjyAWbcLVGQJzZwQY16gQOAhJl/PkP5d8vkMoUyYgU6tWiThIzCNU/jxPsTQcZplvQ40QVZRBWUW1BDze6kXKuCPgq0e/gQXOBnV7sbPvf/w8mvnIn/y/iB34fAZ//LggqrM7cWiMwoM2XI3XlDsRo5eoTURmc//syxAqACdi9OhnIAAEYjCjDOJAAiTtPeQx8IFECcjysLfACwoJMTYn8vlQUARR6pfQafGYSqf36aZuZk//+6aSCi5/1eaFw4Ud/l26/otGFlO9ZhYFITRCfAu2isFnhh6FRmaVUZggADwMDAE0+NEQCtAwJlC5dCFkbZBCKV3GpU3Wxr/6twUfahhVZayUyZmmPRy0Ag1AA112msv/7MsQEAAh0R0zdt4ApBgZpZP2YnJVNHTeMisAMzHAv5rgim8QgKmC929cZurRB2IemjqVrFDZI8atodI2pDwZQNCbyZ7NA9g3mnpQliD4MqYAABe8hFZlJRCwFAxvmMsGDopgxAVSDZ5EZO/gOsYQcmQlbRwVQWIGR1KxjwDYSWhhtORqn1lRY9FZZTbaX+jT0qt2ALbdttQAAoCr/+zLEBQAHyFl3rD0jeScaqeWzCd40ETCUq6DGRh9uRoZCZEOMM1DKXzQVGB8dW1Cccis8KirjWtK41kX/tkkMGtEPdOyVyqd/KAAVWmQJiG2kJlx5WUCypiwKaY+mQDx2BGpZDjS4ejMDxgUifAYnUGo3GHnYX7sqIuhFjGMSyuhrVVezfNLy+NVPzaF6CjL4eUi1AA7a22tgAGip//swxAUACKRVcafhLLD4BWplnZjWnZOZGMkKWEWN4ccgJs9H5+GY4IAwcoQBU0TqXi9jOnDFgqcPoYCoqwWgsrjUQWLBoG3GjAqZWwMtb/W4ALTVSBj1+YapX2MiAfDArKquBvpFcUjV8x4cMTpA8EwCBQGIyJ6EAaAITebrRe6h48xUMJ/rdG+u3/fqztVIAABuf8ACF86QIlxB//syxAaACOBhX4Nh5XkRBiqwzSSnRoQMJLmOiOdDDlQxyI+MQSoTrT4V+RBXGqjjJLinl8/FeoFGqHN29hSyXpfzRoITD9I+k6B7wk7C+jCAAAlf2gZg7h4+UAECHjhqxNgruRQAASL+SBDlq22mbZF9dK1B2Q12JLLsYKHZXUxdNwKXeKoe6Fom71bft3+d/nf/VSwAAA7JKAABbP/7MsQEgEfAX02n6GV46IYmYc75DqYKNqLMdohgU4gEGNjXI03jFbAG+JVJ3dCg8MSyXtRogYz4ps+gInYqIjWOoa+blxNw4UFbEAAbHL8UcdtAMDzTVbJpWfRvhoO+HX5MmHomAj4jNEbjGoJzSeBnJhFAwCcvOVACoGemYrg2QkUb9SoAACiAmjQaGRCCGRUBs4SZnIqARlNvxsT/+zLEDABGpDM3A2+icOUF5nG+dNTCMi4CA0UGE56G17EmD4KMNfpOkmCZizyz1kOf9gIAAAMDDeE2+jtiIGM16jCBwxnGDB0TM2JAxUGTWahE8oZla52+1himDZgYARcAtWLBaySfBMB/8jUEABjgFDLHLF3kUQzoX5FFiYIJ4DPJgYIkm9NjBUxQqzpoegcPqebc1DlmOrLsRVH3//swxBiARwAxNSzzprDWBiboDXAm6v////9v6BAAIkAFSbqNVFJKLJkogEWHaVppmOoOYhEJgxQGmH2BAQoG19kg0BnvkF8M6O3/////+6j+hSAAAAaBQAkBZOy7ZjTWPGZvoOZLGHxj4GKjYGkN9zO449ZKQWLcOAhShDurmGquhZP+r////1f6eoAABwIGgADhFVdowGA0c04l//syxCUABygxK6DvoyDrheVoHOxOIQU6EkAoEYFjHekgWzzvv4wYPaJCF7CwS5s8ZSr/If/p6tT4BZf0f+n3qkAADADAKzqQ2qgYDIGBgxoMEWHM3Y2AwAYVsgZHgkHEIdTK+YkAUCgLS/QwDgWf8E7v////1dH+z669X6W0xAyOuh5emMKWYoDZ+I1mNgQYUpJAYMgYM4zBojhumP/7MsQugMc4LSEg76Eg5YYiQc9hSEiA4UAOqyBRYZJEazkCyf/////9NvTViBg8kXiYm5hloZBfASCM3Y1bDKJoOTBox6zzePcMIicAAJIhEcIHLFKOx3/////+7d3Ns6rOXAAgADIFAFrQNVMAnwgpNlGzITA+8cMBAQTTnmApkBqcPGmGDQgPYGsAnFMisx///o/91f9x3TRV92//+zLEOIIG2DMSAe+CwOkFonQt9GAAAApI0QGDZDsRcxykBLzoLQA1MSsHApgVebEKiFoPtSQUJQzTO6yaRcfXbFswhX971Xav72/v2er/lADAyYmERcImgOtGhoAxCfwSmqYlMhxKARM2uYLxuQ/kPqwzna/////2YjuIcsVYG536RhJsu9QIiwV4gAeBYoQaiEY1lV3GRiUVmA6c//swxEQCh2AvE0DrYtDbheGkvWyQ8jkwZA8rkkiO////7m1YzS1wxosug8NAZIiKrWCTJAQmwi8MdspzNMKgkPA1zjMgKLjhB8dxt9s0z////t9S8hpcyqfFSwbfBxIdGC0s8HUkgbMPQBIE5naaqOci5SEyKZ2IUDiTv7P/9X66tZIOtODxiUABFxgRC5wJEQRcDwtGAwhLZnPx//syxE6DR0QrCCDnYwC/hWDADGRg5aciC+SURKJw8gdc+c+v///7dX/+/tVRrVjVSjBVVVUoy6ifWNAICAhX4ZVVY3QrVUxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsRdgcYIIQagBeBQy6RegMAOKFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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