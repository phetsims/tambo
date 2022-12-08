// Copyright 2020-2022, University of Colorado Boulder

/**
 * WrappedAudioBuffer is an object that contains a Web Audio AudioBuffer and a TinyProperty that indicates whether the
 * audio buffer has been decoded.  This is *only* intended for usage during the loading process, not during run time,
 * which is why it isn't namespaced.  This is part of the mechanism in PhET sims through which sounds are imported using
 * the standard JavaScript 'import' statement.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import TinyProperty from '../../axon/js/TinyProperty.js';
import tambo from './tambo.js';

class WrappedAudioBuffer {

  // This TinyProperty is set to null during construction.  Later, when audio data is loaded and decoded, the client
  // should set this to the resultant AudioBuffer.  Once this is set to an AudioBuffer, it should not be set again.
  public readonly audioBufferProperty: TinyProperty<AudioBuffer | null>;

  public constructor() {

    this.audioBufferProperty = new TinyProperty<AudioBuffer | null>( null );

    // Make sure that the audio buffer is only ever set once.
    assert && this.audioBufferProperty.lazyLink( ( audioBuffer, previousAudioBuffer ) => {
      assert && assert( previousAudioBuffer === null && audioBuffer !== null, 'The audio buffer can only be set once' );
    } );
  }
}

tambo.register( 'WrappedAudioBuffer', WrappedAudioBuffer );
export default WrappedAudioBuffer;