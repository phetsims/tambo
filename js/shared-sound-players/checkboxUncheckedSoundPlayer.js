// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for un-checking a checkbox, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const checkboxUncheckedSoundInfo = require( 'sound!TAMBO/checkbox-unchecked.mp3' );

  // create the shared sound instance
  const checkboxUncheckedSoundPlayer = new SharedSoundClip( checkboxUncheckedSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.7 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'checkboxUncheckedSoundPlayer', checkboxUncheckedSoundPlayer );
} );