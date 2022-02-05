// Copyright 2019-2022, University of Colorado Boulder

/**
 * shared sound generator for releasing something, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import release_mp3 from '../../sounds/release_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const releaseSoundPlayer = new SoundClipPlayer( release_mp3, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'releaseSoundPlayer', releaseSoundPlayer );
export default releaseSoundPlayer;