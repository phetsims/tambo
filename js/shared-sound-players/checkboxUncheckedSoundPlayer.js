// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for un-checking a checkbox, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import checkboxUncheckedSound from '../../sounds/checkbox-unchecked_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const checkboxUncheckedSoundPlayer = new SharedSoundClip( checkboxUncheckedSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'checkboxUncheckedSoundPlayer', checkboxUncheckedSoundPlayer );
export default checkboxUncheckedSoundPlayer;