// Copyright 2020-2021, University of Colorado Boulder

/**
 * shared sound generator for when something encounters a boundary
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import boundaryReachedSound from '../../sounds/boundary-reached_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const boundaryReachedSoundPlayer = new SoundClipPlayer( boundaryReachedSound, {
  soundClipOptions: { initialOutputLevel: 0.8 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'boundaryReachedSoundPlayer', boundaryReachedSoundPlayer );
export default boundaryReachedSoundPlayer;