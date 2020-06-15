// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for reset all, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import resetAllSound from '../../sounds/reset-all_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const resetAllSoundPlayer = new SharedSoundClip( resetAllSound, {
  soundClipOptions: { initialOutputLevel: 0.39 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'resetAllSoundPlayer', resetAllSoundPlayer );
export default resetAllSoundPlayer;