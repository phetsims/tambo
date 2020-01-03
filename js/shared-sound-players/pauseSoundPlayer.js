// Copyright 2019, University of Colorado Boulder

/**
 * shared sound generator for the "pause" state of the play/pause button, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const pauseSoundInfo = require( 'sound!TAMBO/pause.mp3' );

  // create the shared sound instance
  const pauseSoundPlayer = new SharedSoundClip( pauseSoundInfo, { initialOutputLevel: 0.7 } );

  return tambo.register( 'pauseSoundPlayer', pauseSoundPlayer );
} );