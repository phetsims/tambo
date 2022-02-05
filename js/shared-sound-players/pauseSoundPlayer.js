// Copyright 2019-2022, University of Colorado Boulder

/**
 * shared sound generator for the "pause" state of the play/pause button, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import pause_mp3 from '../../sounds/pause_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const pauseSoundPlayer = new SoundClipPlayer( pause_mp3, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'pauseSoundPlayer', pauseSoundPlayer );
export default pauseSoundPlayer;