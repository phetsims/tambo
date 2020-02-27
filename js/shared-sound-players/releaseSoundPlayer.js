// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for releasing something, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import releaseSoundInfo from '../../sounds/release-002_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// sounds

// create the shared sound instance
const releaseSoundPlayer = new SharedSoundClip( releaseSoundInfo, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'releaseSoundPlayer', releaseSoundPlayer );
export default releaseSoundPlayer;