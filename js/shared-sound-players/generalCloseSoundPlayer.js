// Copyright 2020, University of Colorado Boulder

/**
 * shared sound generator for when something is closed, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const generalCloseSoundInfo = require( 'sound!TAMBO/combo-box-close.mp3' );

  // create the shared sound instance
  const generalCloseSoundPlayer = new SharedSoundClip( generalCloseSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.4 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'generalCloseSoundPlayer', generalCloseSoundPlayer );
} );