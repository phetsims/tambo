// Copyright 2018, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var tambo = require( 'TAMBO/tambo' );

  var TamboQueryParameters = QueryStringMachine.getAll( {

    // use the stubbed audio context regardless of whether support exists for Web Audio
    forceStubbedAudioContext: { type: 'flag' },

    // control the initial sonification level (user can change later)
    initialSonificationLevel: {
      type: 'string',
      defaultValue: 'basic'
    },

    // turn sound on or off at startup (user can change later)
    soundInitiallyEnabled: {
      type: 'boolean',
      defaultValue: true
    }

  } );

  tambo.register( 'TamboQueryParameters', TamboQueryParameters );

  return TamboQueryParameters;
} );