// Copyright 2020-2022, University of Colorado Boulder

/**
 * Shared sound generator, primarily for the AB switch, but potentially useful elsewhere.  Uses the singleton pattern.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import switchToLeft_mp3 from '../../sounds/switchToLeft_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const switchToLeftSoundPlayer = new SoundClipPlayer( switchToLeft_mp3, {
  soundClipOptions: { initialOutputLevel: 0.2 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'switchToLeftSoundPlayer', switchToLeftSoundPlayer );
export default switchToLeftSoundPlayer;