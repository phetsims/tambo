// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for when a toggle button transition to the "off" state, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const toggleOffSoundInfo = require( 'sound!TAMBO/step-back-v2.mp3' );

  // create the shared sound instance
  const toggleOffSoundPlayer = new SharedSoundClip( toggleOffSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.7 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'toggleOffSoundPlayer', toggleOffSoundPlayer );
} );