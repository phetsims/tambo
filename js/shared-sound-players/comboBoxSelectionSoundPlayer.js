// Copyright 2020, University of Colorado Boulder

/**
 * A shared sound generator for a sound to indicate that something was selected, such as in a combo box list, uses the
 * singleton pattern.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import comboBoxSelectionSound from '../../sounds/combo-box-selection_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const comboBoxSelectionSoundPlayer = new SharedSoundClip( comboBoxSelectionSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'comboBoxSelectionSoundPlayer', comboBoxSelectionSoundPlayer );
export default comboBoxSelectionSoundPlayer;