// Copyright 2019, University of Colorado Boulder

/**
 * shared sound generator for reset all, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const resetAllSoundInfo = require( 'sound!TAMBO/reset-all.mp3' );

  // create the shared sound instance
  const resetAllSoundPlayer = new SharedSoundClip( resetAllSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.7 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'resetAllSoundPlayer', resetAllSoundPlayer );
} );