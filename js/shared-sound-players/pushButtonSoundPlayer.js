// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for pushing a button that uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import pushButtonSoundInfo from '../../sounds/general-button-v4_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// sounds

// create the shared sound instance
const pushButtonSoundPlayer = new SharedSoundClip( pushButtonSoundInfo, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'pushButtonSoundPlayer', pushButtonSoundPlayer );
export default pushButtonSoundPlayer;