// Copyright 2020, University of Colorado Boulder

/**
 * shared sound generator for when something is closed, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import generalCloseSoundInfo from '../../sounds/general-close_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// sounds

// create the shared sound instance
const generalCloseSoundPlayer = new SharedSoundClip( generalCloseSoundInfo, {
  soundClipOptions: { initialOutputLevel: 0.4 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'generalCloseSoundPlayer', generalCloseSoundPlayer );
export default generalCloseSoundPlayer;