// Copyright 2020, University of Colorado Boulder

/**
 * shared sound generator for when something is opened, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import generalOpenSound from '../../sounds/general-open_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const generalOpenSoundPlayer = new SharedSoundClip( generalOpenSound, {
  soundClipOptions: { initialOutputLevel: 0.4 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'generalOpenSoundPlayer', generalOpenSoundPlayer );
export default generalOpenSoundPlayer;