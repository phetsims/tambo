// Copyright 2019-2021, University of Colorado Boulder

/**
 * shared sound generator for when a toggle button transition to the "on" state, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import toggleOnSound from '../../sounds/step-forward-v2_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const toggleOnSoundPlayer = new SoundClipPlayer( toggleOnSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'toggleOnSoundPlayer', toggleOnSoundPlayer );
export default toggleOnSoundPlayer;