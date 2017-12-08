// Copyright 2017, University of Colorado Boulder

/**
 * singleton type that registers sound generators used for sonification
 */

define( function( require ) {
  'use strict';

  // modules
  var tambo = require( 'TAMBO/tambo' );

  // NOTE: singleton pattern
  var SonificationManager = {

    // This is the audio context the should be use by all sound generators that are controlled by the sonification
    // manager.
    audioContext: new ( window.AudioContext || window.webkitAudioContext )(),

    registerSoundGenerator: function( soundGenerator ){
      console.log( 'registerSoundGenerator called' );
    }
  };

  tambo.register( 'SonificationManager', SonificationManager );

  return SonificationManager;
} );