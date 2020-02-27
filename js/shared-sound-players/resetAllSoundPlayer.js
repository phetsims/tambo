// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for reset all, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import resetAllSoundInfo from '../../sounds/reset-all_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// sounds

// create the shared sound instance
const resetAllSoundPlayer = new SharedSoundClip( resetAllSoundInfo, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'resetAllSoundPlayer', resetAllSoundPlayer );
export default resetAllSoundPlayer;