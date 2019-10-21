// Copyright 2019, University of Colorado Boulder

/**
 * shared sound generator for un-checking a checkbox
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
  const checkboxUncheckedSound = new SharedSoundClip( checkboxUncheckedSoundInfo, { initialOutputLevel: 0.7 } );

  tambo.register( 'checkboxUncheckedSound', checkboxUncheckedSound );

  return checkboxUncheckedSound;
} );