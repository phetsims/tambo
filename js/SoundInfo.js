// Copyright 2019-2020, University of Colorado Boulder

/**
 * SoundInfo is a "definition" type, based off of PaintDef.js, that defines a type that is used in the tambo sound
 * library but is not actually a base class.  This is similar to the idea of an "interface" in Java.  A SoundInfo type
 * is returned from the sound.js plugin.
 *
 * A SoundInfo instance has a "name" field that identifies the sound and then EITHER a "url" field for loading the sound
 * (used in RequireJS mode) or a "base64" field that defines the sound (used in build mode).
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import tambo from './tambo.js';

class SoundInfo {

  static isSoundInfo( objectInstance ) {
    return typeof objectInstance === 'object' &&
           typeof objectInstance.name === 'string' &&
           ( typeof objectInstance.url === 'string' || typeof objectInstance.base64 === 'string' );
  }
}

tambo.register( 'SoundInfo', SoundInfo );
export default SoundInfo;