// Copyright 2020-2022, University of Colorado Boulder

/**
 * shared sound generator for when something encounters a boundary
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import boundaryReached_mp3 from '../../sounds/boundaryReached_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const boundaryReachedSoundPlayer = new SoundClipPlayer( boundaryReached_mp3, {
  soundClipOptions: { initialOutputLevel: 0.8 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'boundaryReachedSoundPlayer', boundaryReachedSoundPlayer );
export default boundaryReachedSoundPlayer;