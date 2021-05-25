// Copyright 2019-2021, University of Colorado Boulder

/**
 * shared sound generator for releasing something, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import releaseSound from '../../sounds/release-002_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const releaseSoundPlayer = new SoundClipPlayer( releaseSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'releaseSoundPlayer', releaseSoundPlayer );
export default releaseSoundPlayer;