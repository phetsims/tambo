// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for the "step forward" sound, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import stepForwardSound from '../../sounds/step-forward-v2_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const stepForwardSoundPlayer = new SharedSoundClip( stepForwardSound, {
  soundClipOptions: { initialOutputLevel: 0.7 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'stepForwardSoundPlayer', stepForwardSoundPlayer );
export default stepForwardSoundPlayer;