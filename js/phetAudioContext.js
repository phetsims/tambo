// Copyright 2018-2020, University of Colorado Boulder

/**
 * a singleton instance of a Web Audio audio context that can be included using RequireJS, creates a stubbed version on
 * platforms where Web Audio is not supported
 *
 * @author John Blanco
 */

import tambo from './tambo.js';

// constants
const FORCE_STUBBED_AUDIO_CONTEXT = phet.chipper.queryParameters.forceStubbedAudioContext; // used for testing, see below

// helper function for logging warnings
function logUnimplementedWarning() {
  assert && console.warn( 'warning: method called on stubbed audio context, no sound will be produced' );
}

// silent stub function, used in the stubbed audio context
function silentStub() {}

// Define stubbed objects and ultimately an entire stubbed AudioContext that can be used in cases where browsers don't
// support Web Audio.  This was created manually by identifying what portions of the Web Audio API were being used in
// tambo and adding those methods and properties. Please keep methods and properties are in alphabetical order for ease
// of maintenance.  These objects will likely need to be updated periodically as tambo and our usage of Web Audio
// evolves.  See https://github.com/phetsims/tambo/issues/10.

const STUBBED_AUDIO_PARAM = {
  cancelScheduledValues: silentStub,
  linearRampToValueAtTime: silentStub,
  setTargetAtTime: silentStub,
  setValueAtTime: silentStub
};

const STUBBED_OSCILLATOR_NODE = {
  connect: silentStub,
  frequency: STUBBED_AUDIO_PARAM,
  start: silentStub
};

const STUBBED_GAIN_NODE = {
  connect: silentStub,
  disconnect: silentStub,
  gain: STUBBED_AUDIO_PARAM
};

const STUBBED_DYNAMICS_COMPRESSOR_NODE = {
  attack: {
    setValueAtTime: silentStub
  },
  connect: silentStub,
  knee: {
    setValueAtTime: silentStub
  },
  ratio: {
    setValueAtTime: silentStub
  },
  release: {
    setValueAtTime: silentStub
  },
  threshold: {
    setValueAtTime: silentStub
  }
};

const STUBBED_AUDIO_BUFFER_SOURCE_NODE = {
  connect: silentStub,
  disconnect: silentStub,
  playbackRate: STUBBED_AUDIO_PARAM,
  start: silentStub,
  stop: silentStub
};

const STUBBED_CONVOLVER_NODE = {
  connect: silentStub
};

const STUBBED_BIQUAD_FILTER_NODE = {
  connect: silentStub,
  frequency: STUBBED_AUDIO_PARAM,
  Q: STUBBED_AUDIO_PARAM
};

const STUBBED_AUDIO_BUFFER = {
  getChannelData: function() {
    return {};
  }
};

// Define a stubbed audio context (basically a subset of the API for AudioContext) that can be used in cases where
// browsers don't support Web Audio.  This was created manually by identifying what portions of the Web Audio API were
// being used in tambo and adding those methods and properties. This may need to be updated periodically as tambo and
// our usage of Web Audio evolves.  See https://github.com/phetsims/tambo/issues/10.
const STUBBED_AUDIO_CONTEXT = {

  // methods and properties are in alphabetical order, please maintain this for ease of maintenance
  createBiquadFilter: () => STUBBED_BIQUAD_FILTER_NODE,
  createBuffer: () => STUBBED_AUDIO_BUFFER,
  createBufferSource: () => STUBBED_AUDIO_BUFFER_SOURCE_NODE,
  createConvolver: () => STUBBED_CONVOLVER_NODE,
  createDynamicsCompressor: () => STUBBED_DYNAMICS_COMPRESSOR_NODE,
  createGain: () => STUBBED_GAIN_NODE,
  createOscillator: () => STUBBED_OSCILLATOR_NODE,
  currentTime: 0,
  decodeAudioData: ( arrayBuffer, successCallback, errorCallback ) => {
    successCallback( {} );
  },
  destination: null,
  resume: logUnimplementedWarning,
  state: 'running',

  // this is a flag that is specific to the stubbed audio context, allowing it to be identified
  isStubbed: true
};

// create a Web Audio context
let phetAudioContext = null;
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

export default phetAudioContext;