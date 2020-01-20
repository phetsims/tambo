// Copyright 2019, University of Colorado Boulder

/**
 * shared sound generator for the "play" state of the play/pause button, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const playSoundInfo = require( 'sound!TAMBO/play-pause-003.mp3' );

  // create the shared sound instance
  const playSoundPlayer = new SharedSoundClip( playSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.7 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'playSoundPlayer', playSoundPlayer );
} );