// Copyright 2019-2021, University of Colorado Boulder

/**
 * shared sound generator for the "step backward" sound, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import stepBackwardSound from '../../sounds/step-back-v2_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const stepBackwardSoundPlayer = new SoundClipPlayer( stepBackwardSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'stepBackwardSoundPlayer', stepBackwardSoundPlayer );
export default stepBackwardSoundPlayer;