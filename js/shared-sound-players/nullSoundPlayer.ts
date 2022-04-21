// Copyright 2022, University of Colorado Boulder

/**
 * The nullSoundPlayer is a singleton that implements the ISoundPlayer interface but produces no sound.  It is most
 * often used to turn off sound generation in an interactive component that produces sound by default.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import tambo from '../tambo.js';
import ISoundPlayer from '../ISoundPlayer.js';

class NullSoundPlayer implements ISoundPlayer {

  constructor() {}

  public play(): void {}

  public stop(): void {}
}

// Create the singleton instance.
const nullSoundPlayer = new NullSoundPlayer();

tambo.register( 'nullSoundPlayer', nullSoundPlayer );

export default nullSoundPlayer;