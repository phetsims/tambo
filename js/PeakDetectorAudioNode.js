// Copyright 2020, University of Colorado Boulder

/**
 * PeakDetectorAudioNode is a Web Audio node that can be used to detect peak audio output values in an audio signal
 * chain.  The detected peak audio values are output to the console.  This file contains the portion that runs in the
 * main JavaScript thread, which appears to be referred to as the "AudioWorklet Node".  There is a counterpart portion
 * that runs in the Web Audio rendering thread that is referred to as the "AudioWorklet Processor".
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import phetAudioContext from './phetAudioContext.js';
import tambo from './tambo.js';

class PeakDetectorAudioNode extends AudioWorkletNode {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {boolean} - If true, zero values will be output, otherwise no output will occur if the peak value detected
      //             for a given time interval is zero.
      logZeroValues: false

    }, options );

    super( phetAudioContext, 'peak-detector' );

    // Listen for messages from the audio worklet processor and log peak values to the console.
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