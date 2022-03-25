// Copyright 2020-2022, University of Colorado Boulder

/**
 * A shared sound generator for UI-related boundary sounds, like when at the min or max of a component range.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import generalBoundaryBoop_mp3 from '../../sounds/generalBoundaryBoop_mp3.js';
import SoundClipPlayer from '../sound-generators/SoundClipPlayer.js';
import tambo from '../tambo.js';

// create the shared sound instance
const generalBoundaryBoopSoundPlayer = new SoundClipPlayer( generalBoundaryBoop_mp3, {
  soundClipOptions: { initialOutputLevel: 0.2 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

tambo.register( 'generalBoundaryBoopSoundPlayer', generalBoundaryBoopSoundPlayer );
export default generalBoundaryBoopSoundPlayer;