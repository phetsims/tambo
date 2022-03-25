// Copyright 2020-2022, University of Colorado Boulder

/**
 * A shared sound generator for soft UI-related clicks, like a slider thumb moving across a tick line.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import generalSoftClick_mp3 from '../../sounds/generalSoftClick_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const generalSoftClickSoundPlayer = new SoundClipPlayer( generalSoftClick_mp3, {
  soundClipOptions: { initialOutputLevel: 0.2 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'generalSoftClickSoundPlayer', generalSoftClickSoundPlayer );
export default generalSoftClickSoundPlayer;