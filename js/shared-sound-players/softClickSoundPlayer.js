// Copyright 2019, University of Colorado Boulder

/**
 * shared sound generator that produces a soft click, often used to produce discrete sounds for some continuous
 * quantity, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const softClickSoundInfo = require( 'sound!TAMBO/click-001.mp3' );

  // create the shared sound instance
  const softClickSoundPlayer = new SharedSoundClip( softClickSoundInfo, { initialOutputLevel: 0.2 } );

  return tambo.register( 'softClickSoundPlayer', softClickSoundPlayer );
} );