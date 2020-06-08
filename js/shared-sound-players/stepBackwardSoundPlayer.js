// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for the "step backward" sound, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import stepBackwardSound from '../../sounds/step-back-v2_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const stepBackwardSoundPlayer = new SharedSoundClip( stepBackwardSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'stepBackwardSoundPlayer', stepBackwardSoundPlayer );
export default stepBackwardSoundPlayer;