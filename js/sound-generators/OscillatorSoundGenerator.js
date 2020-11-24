// Copyright 2018-2020, University of Colorado Boulder

/**
 * OscillatorSoundGenerator is a Web Audio oscillator node wrapped in a sound generator so that it can be easily be used
 * in PhET sims.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Enumeration from '../../../phet-core/js/Enumeration.js';
import merge from '../../../phet-core/js/merge.js';
import phetAudioContext from '../phetAudioContext.js';
import tambo from '../tambo.js';
import SoundGenerator from './SoundGenerator.js';

// constants
const WaveformType = Enumeration.byKeys( [ 'SINE', 'SQUARE', 'TRIANGLE', 'SAWTOOTH' ] );

// map of the waveform type enum values to the values used by Web Audio oscillators
const WAVEFORM_NAME_MAP = new Map( [
  [ WaveformType.SINE, 'sine' ],
  [ WaveformType.SQUARE, 'square' ],
  [ WaveformType.TRIANGLE, 'triangle' ],
  [ WaveformType.SAWTOOTH, 'sawtooth' ]
] );

class OscillatorSoundGenerator extends SoundGenerator {

  /**
   * @constructor
   * {Object} options
   */
  constructor( options ) {

    options = merge( {

      // {number} - initial frequency in Hz, can be changed later
      initialFrequency: 440,

      // {WaveformType}
      initialWaveformType: WaveformType.SINE

    }, options );

    super( options );

    // @private {OscillatorNode|null} - The Web Audio oscillator node that will be created when play is called, and set
    // to null when stopped (Web Audio oscillators are meant to be single use only).
    this.oscillatorNode = null;

    // @private
    this.frequency = options.initialFrequency;
    this.waveformType = options.initialWaveformType;
  }

  /**
   * Starts the oscillator. The name 'play' is used because this is commonly used in the tambo library for sound
   * generators. If the oscillator is already playing, this has no effect.
   * @public
   */
  play() {
    if ( !this.oscillatorNode ) {
      this.oscillatorNode = phetAudioContext.createOscillator();
      this.oscillatorNode.type = WAVEFORM_NAME_MAP.get( this.waveformType );
      this.oscillatorNode.frequency.setValueAtTime( this.frequency, phetAudioContext.currentTime );
      this.oscillatorNode.connect( this.masterGainNode );
      this.oscillatorNode.start();
    }
  }

  /**
   * Stops the oscillator. If the oscillator isn't playing, this has no effect.
   * @public
   */
  stop() {
    if ( this.oscillatorNode ) {
      this.oscillatorNode.stop();
      this.oscillatorNode = null;
    }
  }

  /**
   * Sets the waveform type.
   * @param {WaveformType} waveformType
   * @public
   */
  setWaveformType( waveformType ) {
    assert && assert( WaveformType.includes( waveformType ), `invalid waveform type ${waveformType}` );
    this.waveformType = waveformType;
    if ( this.oscillatorNode ) {
      this.oscillatorNode.type = WAVEFORM_NAME_MAP.get( waveformType );
    }
  }
}

// @public
OscillatorSoundGenerator.WaveformType = WaveformType;

tambo.register( 'OscillatorSoundGenerator', OscillatorSoundGenerator );
export default OscillatorSoundGenerator;