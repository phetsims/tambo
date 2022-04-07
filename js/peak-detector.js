// Copyright 2021-2022, University of Colorado Boulder

/**
 * This file defines an AudioWorklet processor for a peak detector.  This code is intended to run on the audio rendering
 * thread in the AudioWorkletGlobalScope.  It must be loaded using audioWorklet.addModule in the main JavaScript thread.
 *
 * Since it is directly loaded onto a separate thread, this file should be in JavaScript and should not be converted to
 * TypeScript.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

const UPDATE_PERIOD = 1000; // in ms

class PeakDetectorProcessor extends AudioWorkletProcessor {

  constructor() {
    super();
    this.lastUpdateTime = 0;
    this.peak = 0;
  }

  /**
   * Process the audio information - see the Web Audio documentation for details about the parameters for this method.
   * @param inputs
   * @param outputs
   * @param parameters
   * @returns {boolean}
   * @public
   */
  process( inputs, outputs, parameters ) {
    const now = Date.now();
    const input = inputs[ 0 ];

    // Scan through the input data and see if the peak value has been exceeded and, if so, set a new value.  This only
    // looks at one channel of the first input, since that's all that has been needed so far.
    const channelData = input[ 0 ];
    for ( let i = 0; i < channelData.length; i++ ) {
      this.peak = Math.max( Math.abs( channelData[ i ] ), this.peak );
    }

    // If the update period has been exceeded, send a message to the main thread with the current peak and reset it.
    if ( now - this.lastUpdateTime >= UPDATE_PERIOD ) {
      this.port.postMessage( { peak: this.peak } );

      // Reset the timer and the peak.
      this.lastUpdateTime = now;
      this.peak = 0;
    }

    return true;
  }
}

registerProcessor( 'peak-detector', PeakDetectorProcessor );