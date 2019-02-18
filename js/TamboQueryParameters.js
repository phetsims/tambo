// Copyright 2018-2019, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  const tambo = require( 'TAMBO/tambo' );

  const TamboQueryParameters = QueryStringMachine.getAll( {

    // Use the stubbed audio context regardless of whether support exists for Web Audio.  This is useful for testing in
    // browsers where the stubbed audio context isn't needed (e.g. Chrome), since the main browser where it IS needed
    // (Internet Explorer) can be difficult to debug in (locks up on my (jbphet) machine when dev tools are opened).
    forceStubbedAudioContext: { type: 'flag' },

    // Output some data when analyzing sound loops for where the start and end points should be.  This was very useful
    // when adding the auto-identification of the loop start and end points, and may be useful again if more refinement
    // of this process is needed in the future.  See https://github.com/phetsims/tambo/issues/35.
    logLoopAnalysisInfo: { type: 'flag' },

    // Enable logging of gain parameters, which can change over time and whose behavior seems to vary between browsers.
    // This can be useful for debugging.  This is used in conjunction with soundManager.logGain.
    gainLoggingEnabled: { type: 'flag' }
  } );

  tambo.register( 'TamboQueryParameters', TamboQueryParameters );

  return TamboQueryParameters;
} );