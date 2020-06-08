// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for picking something up, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import grabSound from '../../sounds/grab-v2_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const grabSoundPlayer = new SharedSoundClip( grabSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'grabSoundPlayer', grabSoundPlayer );
export default grabSoundPlayer;