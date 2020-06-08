// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for checking a checkbox that uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import checkboxCheckedSound from '../../sounds/checkbox-checked_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const checkboxCheckedSoundPlayer = new SharedSoundClip( checkboxCheckedSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'checkboxCheckedSoundPlayer', checkboxCheckedSoundPlayer );
export default checkboxCheckedSoundPlayer;