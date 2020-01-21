// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for releasing something, uses the singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const releaseSoundInfo = require( 'sound!TAMBO/release-002.mp3' );

  // create the shared sound instance
  const releaseSoundPlayer = new SharedSoundClip( releaseSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.7 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'releaseSoundPlayer', releaseSoundPlayer );
} );