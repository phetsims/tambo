// Copyright 2020-2022, University of Colorado Boulder

/**
 * shared sound generator for when something is closed, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import generalClose_mp3 from '../../sounds/generalClose_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const generalCloseSoundPlayer = new SoundClipPlayer( generalClose_mp3, {
  soundClipOptions: { initialOutputLevel: 0.4 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'generalCloseSoundPlayer', generalCloseSoundPlayer );
export default generalCloseSoundPlayer;