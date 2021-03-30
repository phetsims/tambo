// Copyright 2020, University of Colorado Boulder

/**
 * PeakDetectorAudioNode is a Web Audio node that can be used to detect peak audio output values in an audio signal
 * chain.  This is the portion that runs in the main JavaScript thread.  There is a counterpart portion that runs in
 * the Web Audio rendering thread.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import phetAudioContext from './phetAudioContext.js';
import tambo from './tambo.js';

class PeakDetectorAudioNode extends AudioWorkletNode {

  /**
   * @param {Object} [options]
   *
   */
  constructor( options ) {

    options = merge( {

      // {boolean} - if true, zero values will be output, otherwise they will be ignored
      logZeroValues: false

    }, options );

    super( phetAudioContext, 'peak-detector' );

    this.port.onmessage = event => {
      if ( event.data.peak !== undefined ) {
        const peak = event.data.peak;
        if ( peak > 0 || options.logZeroValues ) {
          console.log( `peak = ${peak}` );
        }
      }
    };
  }
}

// Load the worklet code that will run on the audio rendering thread.
phetAudioContext.audioWorklet.addModule( '../../tambo/js/peak-detector.js' )
  .then( () => {
    console.log( 'peak detector worklet loaded successfully' );
  } )
  .catch( err => {
    console.log( `error while loading peak detector worklet: ${err}` );
  } );

tambo.register( 'PeakDetectorAudioNode', PeakDetectorAudioNode );
export default PeakDetectorAudioNode;