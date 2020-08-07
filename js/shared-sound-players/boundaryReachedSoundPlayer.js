// Copyright 2020, University of Colorado Boulder

/**
 * shared sound generator for when something encounters a boundary
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import boundaryReachedSound from '../../sounds/boundary-reached_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const boundaryReachedSoundPlayer = new SharedSoundClip( boundaryReachedSound, {
  soundClipOptions: { initialOutputLevel: 0.8 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'boundaryReachedSoundPlayer', boundaryReachedSoundPlayer );
export default boundaryReachedSoundPlayer;