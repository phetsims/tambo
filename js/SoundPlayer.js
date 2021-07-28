// Copyright 2021, University of Colorado Boulder

/**
 * SoundPlayer is a "definition" type, based off of PaintDef.js, that defines a type that is used in the tambo sound
 * library but is not actually a base class.  This is similar to the idea of an "interface" in Java.  A SoundPlayer type
 * is a sound generator that has just the most basic methods for playing a sound.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import tambo from './tambo.js';

class SoundPlayer {

  /**
   * See if an object has the necessary methods to be considered a SoundPlayer.
   * @param objectInstance
   * @returns {boolean}
   * @public
   */
  static isSoundPlayer( objectInstance ) {
    return typeof objectInstance.play === 'function' && typeof objectInstance.stop === 'function';
  }
}

// A static value that is a sound player but produces no sound.  This is used as a constant in sound-related code to
// specify that no sound should be produced.
SoundPlayer.NO_SOUND = {
  play() {},
  stop() {}
};

tambo.register( 'SoundPlayer', SoundPlayer );
export default SoundPlayer;