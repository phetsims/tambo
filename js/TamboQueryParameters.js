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

    // Use the stubbed audio context regardless of whether support exists for Web Audio.  This is useful for testing in
    // browsers where the stubbed audio context isn't needed (e.g. Chrome), since the main browser where it IS needed
    // (Internet Explorer) can be difficult to debug in (locks up on my (jbphet) machine when dev tools are opened).
    forceStubbedAudioContext: { type: 'flag' },

    // Output some data when analyzing sound loops for where the start and end points should be.  This was very useful
    // when adding the auto-identification of the loop start and end points, and may be useful again if more refinement
    // of this process is needed in the future.  See https://github.com/phetsims/tambo/issues/35.
    logLoopAnalysisInfo: { type: 'flag' }
  } );

  tambo.register( 'TamboQueryParameters', TamboQueryParameters );

  return TamboQueryParameters;
} );