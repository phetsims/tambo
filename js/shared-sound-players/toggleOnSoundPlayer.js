// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for when a toggle button transition to the "on" state, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import toggleOnSound from '../../sounds/step-forward-v2_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const toggleOnSoundPlayer = new SharedSoundClip( toggleOnSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'toggleOnSoundPlayer', toggleOnSoundPlayer );
export default toggleOnSoundPlayer;