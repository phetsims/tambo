// Copyright 2020-2022, University of Colorado Boulder

/**
 * shared sound generator for the accordion box open sound, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import accordionBoxClose_mp3 from '../../sounds/accordionBoxClose_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const accordionBoxClosedSoundPlayer = new SoundClipPlayer( accordionBoxClose_mp3, {
  soundClipOptions: { initialOutputLevel: 0.5 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'accordionBoxClosedSoundPlayer', accordionBoxClosedSoundPlayer );
export default accordionBoxClosedSoundPlayer;