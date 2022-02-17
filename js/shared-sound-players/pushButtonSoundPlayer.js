// Copyright 2019-2022, University of Colorado Boulder

/**
 * shared sound generator for pushing a button that uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import generalButton_mp3 from '../../sounds/generalButton_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const pushButtonSoundPlayer = new SoundClipPlayer( generalButton_mp3, {
  soundClipOptions: { initialOutputLevel: 0.5 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'pushButtonSoundPlayer', pushButtonSoundPlayer );
export default pushButtonSoundPlayer;