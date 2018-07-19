// Copyright 2018, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var tambo = require( 'TAMBO/tambo' );

  // REVIEW: Tambo query parameters should be in initialize-globals

  var TamboQueryParameters = QueryStringMachine.getAll( {

    // use the stubbed audio context regardless of whether support exists for Web Audio
    forceStubbedAudioContext: { type: 'flag' },

    // turn sound on or off at startup (user can change later)
    soundInitiallyEnabled: {
      type: 'boolean',
      defaultValue: true
    },

    // control whether enhanced sound mode is initially enabled (user can change later)
    // REVIEW: there is a discrepancy between this query string key and the preceding one
    enhancedSoundEnabled: {
      type: 'boolean',
      defaultValue: false
    }

  } );

  tambo.register( 'TamboQueryParameters', TamboQueryParameters );

  return TamboQueryParameters;
} );