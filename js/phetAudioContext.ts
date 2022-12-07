// Copyright 2018-2022, University of Colorado Boulder

/**
 * `phetAudioContext` is a singleton instance of a Web Audio context that is used for all Web Audio interaction within
 * a sim.
 *
 * @author John Blanco
 */

import IntentionalAny from '../../phet-core/js/types/IntentionalAny.js';
import tambo from './tambo.js';

// create a Web Audio context
let phetAudioContext: AudioContext;
if ( window.AudioContext ) {
  phetAudioContext = new window.AudioContext();
}
else if ( ( window as IntentionalAny ).webkitAudioContext ) {
  phetAudioContext = new ( ( window as IntentionalAny ).webkitAudioContext )(); // eslint-disable-line new-cap
}
else {

  // The browser doesn't support creating an audio context, create an empty object.  Failures will occur the first time
  // any code tries to do anything with the audio context.
  phetAudioContext = {} as AudioContext;
  console.error( 'error: this browser does not support Web Audio' );
}

// register for phet-io
tambo.register( 'phetAudioContext', phetAudioContext );

export default phetAudioContext;