// Copyright 2017, University of Colorado Boulder

/**
 * singleton type that registers sound generators used for sonification
 */

define( function( require ) {
  'use strict';

  // modules
  var tambo = require( 'TAMBO/tambo' );

  // Create the audio context that should be used by all sounds registered with the sonification manager.  This is done
  // in order to limit the number of audio contexts that are created, since browsers generally only allow a limited
  // number per tab.
  var audioContext = new ( window.AudioContext || window.webkitAudioContext )();

  // NOTE: singleton pattern
  var SonificationManager = {

    /**
     * @public (read-only)
     */
    audioContext: audioContext,

    registerSoundGenerator: function( soundGenerator ){
      console.log( 'registerSoundGenerator called' );
      soundGenerator.connect( audioContext.destination );
    }
  };

  tambo.register( 'SonificationManager', SonificationManager );

  return SonificationManager;
} );