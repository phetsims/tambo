// Copyright 2019-2022, University of Colorado Boulder

/**
 * shared sound generator for reset all, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import resetAll_mp3 from '../../sounds/resetAll_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const resetAllSoundPlayer = new SoundClipPlayer( resetAll_mp3, {
  soundClipOptions: {
    initialOutputLevel: 0.39,
    enabledDuringPhetioStateSetting: true
  },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'resetAllSoundPlayer', resetAllSoundPlayer );
export default resetAllSoundPlayer;