// Copyright 2019-2021, University of Colorado Boulder

/**
 * shared sound generator for when a toggle button transition to the "off" state, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import stepBackV2_mp3 from '../../sounds/stepBackV2_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const toggleOffSoundPlayer = new SoundClipPlayer( stepBackV2_mp3, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'toggleOffSoundPlayer', toggleOffSoundPlayer );
export default toggleOffSoundPlayer;