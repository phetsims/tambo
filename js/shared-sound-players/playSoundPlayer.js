// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for the "play" state of the play/pause button, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import playSound from '../../sounds/play-pause-003_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const playSoundPlayer = new SharedSoundClip( playSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'playSoundPlayer', playSoundPlayer );
export default playSoundPlayer;