// Copyright 2019-2020, University of Colorado Boulder

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
   * see if an object is playable by testing whether it has a 'play' method
   * @param objectInstance
   * @returns {boolean}
   * @public
   */
  static isPlayable( objectInstance ) {
    return typeof objectInstance.play === 'function';
  }
}

// A static value that is playable (i.e. has a play method) but produces no sound.  This is used as a constant in
// sound-related code to specify that no sound should be produced.
Playable.NO_SOUND = { play() {} };

tambo.register( 'Playable', Playable );
export default Playable;