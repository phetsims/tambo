// Copyright 2019, University of Colorado Boulder

/**
 * shared sound generator for when a toggle button transition to the "on" state, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const toggleOnSoundInfo = require( 'sound!TAMBO/step-forward-v2.mp3' );

  // create the shared sound instance
  const toggleOnSoundPlayer = new SharedSoundClip( toggleOnSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.7 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'toggleOnSoundPlayer', toggleOnSoundPlayer );
} );