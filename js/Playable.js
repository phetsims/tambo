// Copyright 2019-2021, University of Colorado Boulder

/**
 * Playable is a "definition" type, based off of PaintDef.js, that defines a type that is used in the tambo sound
 * library but is not actually a base class.  This is similar to the idea of an "interface" in Java.  A Playable type
 * is a sound generator that has a "play" method.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import tambo from './tambo.js';

class Playable {

  /**
   * See if an object is considered "playable" by testing whether it has a 'play' method and a 'stop' method.
   * @param objectInstance
   * @returns {boolean}
   * @public
   */
  static isPlayable( objectInstance ) {
    return typeof objectInstance.play === 'function' && typeof objectInstance.stop === 'function';
  }
}

// A static value that is playable (i.e. has a play method) but produces no sound.  This is used as a constant in
// sound-related code to specify that no sound should be produced.
Playable.NO_SOUND = {
  play() {},
  stop() {}
};

tambo.register( 'Playable', Playable );
export default Playable;