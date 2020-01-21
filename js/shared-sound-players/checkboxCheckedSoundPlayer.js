// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for checking a checkbox that uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const checkboxCheckedSoundInfo = require( 'sound!TAMBO/checkbox-checked.mp3' );

  // create the shared sound instance
  const checkboxCheckedSoundPlayer = new SharedSoundClip( checkboxCheckedSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.7 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'checkboxCheckedSoundPlayer', checkboxCheckedSoundPlayer );
} );