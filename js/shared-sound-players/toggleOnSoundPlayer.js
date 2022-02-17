// Copyright 2019-2022, University of Colorado Boulder

/**
 * shared sound generator for when a toggle button transition to the "on" state, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import stepForward_mp3 from '../../sounds/stepForward_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const toggleOnSoundPlayer = new SoundClipPlayer( stepForward_mp3, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'toggleOnSoundPlayer', toggleOnSoundPlayer );
export default toggleOnSoundPlayer;