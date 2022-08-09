// Copyright 2022, University of Colorado Boulder

/**
 * The nullSoundPlayer is a singleton that implements the TSoundPlayer interface but produces no sound.  It is most
 * often used to turn off sound generation in an interactive component that produces sound by default.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import tambo from '../tambo.js';
import TSoundPlayer from '../TSoundPlayer.js';

class NullSoundPlayer implements TSoundPlayer {

  public play(): void {
    // Required for TSoundPlayer
  }

  public stop(): void {
    // Required for TSoundPlayer
  }
}

// Create the singleton instance.
const nullSoundPlayer = new NullSoundPlayer();

tambo.register( 'nullSoundPlayer', nullSoundPlayer );

export default nullSoundPlayer;