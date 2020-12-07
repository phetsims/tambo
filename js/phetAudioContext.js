// Copyright 2018-2020, University of Colorado Boulder

/**
 * phetAudioContext is a singleton instance of a Web Audio context that is used for all Web Audio interaction
 *
 * @author John Blanco
 */

import tambo from './tambo.js';

// create a Web Audio context
let phetAudioContext = null;
if ( window.AudioContext ) {
  phetAudioContext = new window.AudioContext();
}
else if ( window.webkitAudioContext ) {
  phetAudioContext = new window.webkitAudioContext();
}
else {

  // The browser doesn't support creating an audio context, create an empty object.  Failures will occur the first time
  // any code tries to do anything with the audio context.
  phetAudioContext = {};
  console.error( 'error: this browser does not support Web Audio' );
}

// register for phet-io
tambo.register( 'phetAudioContext', phetAudioContext );

export default phetAudioContext;