// Copyright 2018, University of Colorado Boulder

/**
 * a Web Audio audio context that can be included using RequireJS, creates a stubbed version on platforms where Web
 * Audio is not supported
 */
define( function( require ) {
  'use strict';

  // modules
  var tambo = require( 'TAMBO/tambo' );
  var TamboQueryParameters = require( 'TAMBO/TamboQueryParameters' );

  // constants
  var FORCE_STUBBED_AUDIO_CONTEXT = TamboQueryParameters.forceStubbedAudioContext; // used for testing, see below

  // helper function for logging warnings
  function logUnimplementedWarning() {
    assert && console.warn( 'warning: method called on stubbed audio context, no sound will be produced' );
  }

  // silent stub function, used in the stubbed audio context
  function silentStub() {}

  // Define a stubbed audio context that can be used in cases where browsers don't support Web Audio.  This was created
  // manually by identifying what portions of the Web Audio API were being used in tambo and adding those methods and
  // properties. This may need to be updated periodically as tambo and our usage of Web Audio evolves.  See
  // https://github.com/phetsims/tambo/issues/10.
  var STUBBED_AUDIO_CONTEXT = {

    // methods and properties are in alphabetical order, please maintain this for ease of maintenance

    createConvolver: function() {
      logUnimplementedWarning();
      return {
        connect: silentStub
      };
    },
    createDynamicsCompressor: function() {
      logUnimplementedWarning();
      return {
        threshold: {},
        knee: {},
        ratio: {},
        attack: {},
        release: {},
        connect: silentStub
      };
    },
    createGain: function() {
      logUnimplementedWarning();
      return {
        connect: silentStub,
        disconnect: silentStub,
        gain: {
          cancelScheduledValues: silentStub,
          setTargetAtTime: silentStub,
          setValueAtTime: silentStub
        }
      };
    },
    createOscillator: function() {
      logUnimplementedWarning();
      return {
        connect: silentStub,
        start: silentStub,
        frequency: {
          linearRampToValueAtTime: silentStub,
          setValueAtTime: silentStub
        }
      };
    },
    currentTime: 0,
    decodeAudioData: logUnimplementedWarning,
    destination: null,
    resume: logUnimplementedWarning,
    state: 'running'
  };

  // create a Web Audio context
  var phetAudioContext = null;
  if ( window.AudioContext && !FORCE_STUBBED_AUDIO_CONTEXT ) {
    phetAudioContext = new window.AudioContext();
  }
  else if ( window.webkitAudioContext && !FORCE_STUBBED_AUDIO_CONTEXT ) {
    phetAudioContext = new window.webkitAudioContext();
  }
  else {

    // the browser doesn't support creating an audio context, so use a stubbed out version
    phetAudioContext = STUBBED_AUDIO_CONTEXT;
    console.warn( 'warning: using stubbed audio context' );
  }

  // register for phet-io
  tambo.register( 'phetAudioContext', phetAudioContext );

  return phetAudioContext;
} );