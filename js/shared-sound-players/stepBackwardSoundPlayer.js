// Copyright 2019, University of Colorado Boulder

/**
 * shared sound generator for the "step backward" sound, uses singleton pattern
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SharedSoundClip = require( 'TAMBO/sound-generators/SharedSoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const stepBackwardSoundInfo = require( 'sound!TAMBO/step-back-v2.mp3' );

  // create the shared sound instance
  const stepBackwardSoundPlayer = new SharedSoundClip( stepBackwardSoundInfo, { initialOutputLevel: 0.7 } );

  return tambo.register( 'stepBackwardSoundPlayer', stepBackwardSoundPlayer );
} );