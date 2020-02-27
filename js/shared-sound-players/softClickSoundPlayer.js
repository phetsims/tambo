// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator that produces a soft click, often used to produce discrete sounds for some continuous
 * quantity, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import softClickSoundInfo from '../../sounds/click-001_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// sounds

// create the shared sound instance
const softClickSoundPlayer = new SharedSoundClip( softClickSoundInfo, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'softClickSoundPlayer', softClickSoundPlayer );
export default softClickSoundPlayer;