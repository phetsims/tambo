// Copyright 2020, University of Colorado Boulder

/**
 * shared sound generator for when something is opened, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const generalOpenSoundInfo = require( 'sound!TAMBO/general-open.mp3' );

  // create the shared sound instance
  const generalOpenSoundPlayer = new SharedSoundClip( generalOpenSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.4 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'generalOpenSoundPlayer', generalOpenSoundPlayer );
} );