// Copyright 2019, University of Colorado Boulder

/**
 * shared sound generator for pushing a button that uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const pushButtonSoundInfo = require( 'sound!TAMBO/general-button-v4.mp3' );

  // create the shared sound instance
  const pushButtonSoundPlayer = new SharedSoundClip( pushButtonSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.7 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'pushButtonSoundPlayer', pushButtonSoundPlayer );
} );