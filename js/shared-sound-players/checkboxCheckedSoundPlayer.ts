// Copyright 2019-2022, University of Colorado Boulder

/**
 * shared sound generator for checking a checkbox that uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import checkboxChecked_mp3 from '../../sounds/checkboxChecked_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const checkboxCheckedSoundPlayer = new SoundClipPlayer( checkboxChecked_mp3, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'checkboxCheckedSoundPlayer', checkboxCheckedSoundPlayer );
export default checkboxCheckedSoundPlayer;