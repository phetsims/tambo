// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for the "pause" state of the play/pause button, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import pauseSound from '../../sounds/pause_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const pauseSoundPlayer = new SharedSoundClip( pauseSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'pauseSoundPlayer', pauseSoundPlayer );
export default pauseSoundPlayer;