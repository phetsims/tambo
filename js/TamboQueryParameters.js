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
    forceStubbedAudioContext: { type: 'flag' }
  } );

  tambo.register( 'TamboQueryParameters', TamboQueryParameters );

  return TamboQueryParameters;
} );