// Copyright 2021-2022, University of Colorado Boulder

/**
 * PeakDetectorAudioNode is a Web Audio node that can be used to detect peak audio output values in an audio signal
 * chain.  The detected peak audio values are output to the console.  This file contains the portion that runs in the
 * main JavaScript thread, which is referred to as the "AudioWorklet Node" in the online documentation.  There is a
 * counterpart portion that runs in the Web Audio rendering thread that is referred to as the "AudioWorklet Processor".
 *
 * This is intended for diagnostic purposes only, and should not be included in production code.  It likely won't work
 * in built code anyway, since it makes a direct file reference for including the worklet processor code.
 *
 * Also note that as of this writing (Apr 2021), audio worklets are not supported in Safari.
 *
 * To use, create an instance and connect the node whose output you want to measure.  Example:
 *
 *    const peakDetector = new PeakDetectorAudioNode();
 *    this.masterGainNode.connect( peakDetector );
 *
 * TODO: !!! This does not work on all of PhET's supported platforms, so it should not be incorporated into any
 *       production code.  It should be used for debugging only.  See https://github.com/phetsims/tambo/issues/133#issuecomment-861042659.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize from '../../phet-core/js/optionize.js';
import phetAudioContext from './phetAudioContext.js';
import tambo from './tambo.js';

export type PeakDetectorAudioNodeOptions = {

  // If true, zero values will be output, otherwise no output will occur if the peak value detected for a given time
  // interval is zero.
  logZeroValues?: boolean;
};

class PeakDetectorAudioNode extends AudioWorkletNode {

  public constructor( providedOptions?: PeakDetectorAudioNodeOptions ) {

    const options = optionize<PeakDetectorAudioNodeOptions, PeakDetectorAudioNodeOptions>()( {
      logZeroValues: false
    }, providedOptions );

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
console.log( 'loading peak-detector module on audio rendering thread...' );
phetAudioContext.audioWorklet.addModule( '../../tambo/js/peak-detector.js' )
  .then( () => {
    console.log( 'peak detector worklet loaded successfully' );
  } )
  .catch( err => {
    console.warn( `error while loading peak detector worklet, peak detector probably won't work, error: ${err}` );
  } );

tambo.register( 'PeakDetectorAudioNode', PeakDetectorAudioNode );
export default PeakDetectorAudioNode;