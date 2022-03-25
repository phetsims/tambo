// Copyright 2019-2022, University of Colorado Boulder

/**
 * shared sound generator for the "step backward" sound, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import stepBack_mp3 from '../../sounds/stepBack_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const stepBackwardSoundPlayer = new SoundClipPlayer( stepBack_mp3, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'stepBackwardSoundPlayer', stepBackwardSoundPlayer );
export default stepBackwardSoundPlayer;