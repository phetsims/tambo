// Copyright 2020, University of Colorado Boulder

/**
 * A shared sound generator for UI-related boundary sounds, like when at the min or max of a component range.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import generalBoundaryBoopSound from '../../sounds/general-boundary-boop_mp3.js';
import SharedSoundClip from '../sound-generators/SharedSoundClip.js';
import tambo from '../tambo.js';

// create the shared sound instance
const generalBoundaryBoopSoundPlayer = new SharedSoundClip( generalBoundaryBoopSound, {
  soundClipOptions: { initialOutputLevel: 0.2 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'generalBoundaryBoopSoundPlayer', generalBoundaryBoopSoundPlayer );
export default generalBoundaryBoopSoundPlayer;