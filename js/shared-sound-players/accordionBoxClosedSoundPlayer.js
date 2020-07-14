// Copyright 2020, University of Colorado Boulder

/**
 * shared sound generator for the accordion box open sound, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import accordionBoxClosedSound from '../../sounds/accordion-box-close_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const accordionBoxClosedSoundPlayer = new SharedSoundClip( accordionBoxClosedSound, {
  soundClipOptions: { initialOutputLevel: 0.5 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'accordionBoxClosedSoundPlayer', accordionBoxClosedSoundPlayer );
export default accordionBoxClosedSoundPlayer;