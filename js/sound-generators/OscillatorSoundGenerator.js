// Copyright 2018-2020, University of Colorado Boulder

/**
 * OscillatorSoundGenerator is a Web Audio oscillator node wrapped in a sound generator so that it can be easily be used
 * in PhET sims.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import phetAudioContext from '../phetAudioContext.js';
import tambo from '../tambo.js';
import SoundGenerator from './SoundGenerator.js';

class OscillatorSoundGenerator extends SoundGenerator {

  /**
   * @constructor
   * {Object} options
   */
  constructor( options ) {

    options = merge( {

      initialFrequency: 440

    }, options );

    super( options );

    // @private {OscillatorNode|null} - The Web Audio oscillator node that will be created when play is called, and set
    // to null when stopped (Web Audio oscillators are meant to be single use only).
    this.oscillatorNode = null;

    // @private
    this.frequency = options.initialFrequency;
  }

  /**
   * Start the oscillator.  The name 'play' is used because this is commonly used in the tambo library for sound
   * generators.
   * @public
   */
  play() {
    if ( !this.oscillatorNode ) {
      this.oscillatorNode = phetAudioContext.createOscillator();
      this.oscillatorNode.frequency.setValueAtTime( this.frequency, phetAudioContext.currentTime );
      this.oscillatorNode.connect( this.masterGainNode );
      this.oscillatorNode.start();
    }
  }

  /**
   * stop the oscillator (if it's playing)
   * @public
   */
  stop() {
    if ( this.oscillatorNode ) {
      this.oscillatorNode.stop();
      this.oscillatorNode = null;
    }
  }
}

tambo.register( 'OscillatorSoundGenerator', OscillatorSoundGenerator );
export default OscillatorSoundGenerator;