// Copyright 2018, University of Colorado Boulder

/**
 * a Web Audio audio context that can be included using RequireJS
 */
define( function( require ) {
  'use strict';

  // modules
  var tambo = require( 'TAMBO/tambo' );

  var phetAudioContext = new ( window.AudioContext || window.webkitAudioContext )();
  tambo.register( 'phetAudioContext', phetAudioContext );
  return phetAudioContext;
} );