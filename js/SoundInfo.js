// Copyright 2019, University of Colorado Boulder

/**
 * SoundInfo is a "definition" type, based off of PaintDef.js, that defines a type that is used in the tambo sound
 * library but is not actually a base class.  This is similar to the idea of an "interface" in Java.  A SoundInfo type
 * is returned from the sound.js plugin.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  const tambo = require( 'TAMBO/tambo' );

  class SoundInfo {

    static isSoundInfo( objectInstance ) {
      return typeof objectInstance === 'object' &&
             ( typeof objectInstance.url === 'string' || typeof objectInstance.base64 === 'string' );
    }
  }

  return tambo.register( 'SoundInfo', SoundInfo );
} );
