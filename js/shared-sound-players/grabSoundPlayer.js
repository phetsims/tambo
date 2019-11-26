// Copyright 2019, University of Colorado Boulder

/**
 * shared sound generator for picking something up, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const grabSoundInfo = require( 'sound!TAMBO/grab-v2.mp3' );

  // create the shared sound instance
  const grabSoundPlayer = new SharedSoundClip( grabSoundInfo, { initialOutputLevel: 0.7 } );

  return tambo.register( 'grabSoundPlayer', grabSoundPlayer );
} );