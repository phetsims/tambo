// Copyright 2019, University of Colorado Boulder

/**
 * shared sound generator for checking a checkbox
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const checkboxCheckedSoundInfo = require( 'sound!TAMBO/check-box-checked.mp3' );

  // create the shared sound instance
  const checkboxCheckedSound = new SharedSoundClip( checkboxCheckedSoundInfo, { initialOutputLevel: 0.7 } );

  tambo.register( 'checkboxCheckedSound', checkboxCheckedSound );

  return checkboxCheckedSound;
} );