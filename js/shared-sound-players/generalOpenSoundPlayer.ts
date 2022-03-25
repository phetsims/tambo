// Copyright 2020-2022, University of Colorado Boulder

/**
 * shared sound generator for when something is opened, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import generalOpen_mp3 from '../../sounds/generalOpen_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const generalOpenSoundPlayer = new SoundClipPlayer( generalOpen_mp3, {
  soundClipOptions: { initialOutputLevel: 0.4 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'generalOpenSoundPlayer', generalOpenSoundPlayer );
export default generalOpenSoundPlayer;