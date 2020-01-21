// Copyright 2019-2020, University of Colorado Boulder

/**
 * shared sound generator for the "step forward" sound, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const stepForwardSoundInfo = require( 'sound!TAMBO/step-forward-v2.mp3' );

  // create the shared sound instance
  const stepForwardSoundPlayer = new SharedSoundClip( stepForwardSoundInfo, {
    soundClipOptions: { initialOutputLevel: 0.7 },
    soundManagerOptions: { categoryName: 'user-interface' }
  } );

  return tambo.register( 'stepForwardSoundPlayer', stepForwardSoundPlayer );
} );