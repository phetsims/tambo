// Copyright 2020, University of Colorado Boulder

/**
 * WrappedAudioBuffer is an object that contains a Web Audio AudioBuffer and a TinyProperty that indicates whether the
 * audio buffer has been decoded.  This is *only* intended for usage during the loading process, not during run time,
 * which is why it isn't namespaced.  This is part of the mechanism in PhET sims through which sounds are imported using
 * the standard JavaScript 'import' statement.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import TinyProperty from '../../axon/js/TinyProperty.js';

class WrappedAudioBuffer {

  constructor() {

    // @public {TinyProperty.<AudioBuffer|null>} - A TinyProperty that is initially set to null and is set to an audio
    // buffer, which contains audio data, when the decoding of that data is complete.
    this.audioBufferProperty = new TinyProperty( null );

    // Make sure that the audio buffer is only ever set once.
    assert && this.audioBufferProperty.lazyLink( ( audioBuffer, previousAudioBuffer ) => {
      assert( previousAudioBuffer === null && audioBuffer !== null, 'The audio buffer can only be set once' );
    } );
  }
}

export default WrappedAudioBuffer;