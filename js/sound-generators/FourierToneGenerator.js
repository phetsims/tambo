// Copyright 2018-2020, University of Colorado Boulder

/**
 * FourierToneGenerator is a set of oscillators that play simultaneously and whose output levels can be independently
 * controlled.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import tambo from '../tambo.js';
import OscillatorSoundGenerator from './OscillatorSoundGenerator.js';
import SoundGenerator from './SoundGenerator.js';

// constants
const oscillatorFrequencies = [ 440, 880, 1320, 1760, 2200, 2640, 3080, 3520, 3960, 4400, 4840 ];

class FourierToneGenerator extends SoundGenerator {

  /**
   * @constructor
   * {Object} options
   */
  constructor( options ) {

    super( options );

    this.oscillatorSoundGenerators = [];
    oscillatorFrequencies.forEach( frequency => {
      const oscillatorSoundGenerator = new OscillatorSoundGenerator( {
        initialFrequency: frequency,
        initialOutputLevel: 0
      } );
      oscillatorSoundGenerator.connect( this.masterGainNode );
      this.oscillatorSoundGenerators.push( oscillatorSoundGenerator );
    } );
  }

  /**
   * Start the oscillators.
   * @public
   */
  play() {
    this.oscillatorSoundGenerators.forEach( oscillatorSoundGenerator => oscillatorSoundGenerator.play() );
  }

  /**
   * Stop the oscillators.
   * @public
   */
  stop() {
    this.oscillatorSoundGenerators.forEach( oscillatorSoundGenerator => oscillatorSoundGenerator.stop() );
  }

  /**
   * Set the output level for the specified oscillator.  Note that this does *not* set the overall output level - use
   * `setOutputLevel` for that.
   * @param {number} oscillatorIndex
   * @param {number} outputLevel
   * @public
   */
  setOscillatorOutputLevel( oscillatorIndex, outputLevel ) {
    assert && assert( oscillatorIndex >= 0 && oscillatorIndex < this.oscillatorSoundGenerators.length );
    this.oscillatorSoundGenerators[ oscillatorIndex ].setOutputLevel( outputLevel );
  }

  /**
   * Set the waveform used by all oscillators.
   * @param waveformType
   * @public
   */
  setWaveformType( waveformType ) {
    this.oscillatorSoundGenerators.forEach(
      oscillatorSoundGenerator => oscillatorSoundGenerator.setWaveformType( waveformType )
    );
  }
}

tambo.register( 'FourierToneGenerator', FourierToneGenerator );
export default FourierToneGenerator;