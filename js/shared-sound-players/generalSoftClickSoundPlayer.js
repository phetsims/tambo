// Copyright 2020-2021, University of Colorado Boulder

/**
 * A shared sound generator for soft UI-related clicks, like a slider thumb moving across a tick line.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import generalSoftClipSound from '../../sounds/general-soft-click_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const generalSoftClickSoundPlayer = new SoundClipPlayer( generalSoftClipSound, {
  soundClipOptions: { initialOutputLevel: 0.2 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'generalSoftClickSoundPlayer', generalSoftClickSoundPlayer );
export default generalSoftClickSoundPlayer;