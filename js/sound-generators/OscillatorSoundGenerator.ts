// Copyright 2020-2022, University of Colorado Boulder

/**
 * OscillatorSoundGenerator is a Web Audio oscillator node wrapped in a sound generator so that it can be easily be used
 * in PhET sims.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import phetAudioContext from '../phetAudioContext.js';
import tambo from '../tambo.js';
import SoundGenerator, { SoundGeneratorOptions } from './SoundGenerator.js';

type SelfOptions = {

  // initial frequency in Hz, can be changed later
  initialFrequency?: number;

  // initial waveform type, can be changed later
  initialWaveformType?: OscillatorType;
};
export type OscillatorSoundGeneratorOptions = SelfOptions & SoundGeneratorOptions;

class OscillatorSoundGenerator extends SoundGenerator {

  // The Web Audio oscillator node that will be created when play is called, and set to null when stopped (Web Audio
  // oscillators are meant to be single use only).
  private oscillatorNode: OscillatorNode | null;

  // other parameters of the oscillator
  private readonly frequency: number;
  private waveformType: OscillatorType;

  public constructor( providedOptions?: OscillatorSoundGeneratorOptions ) {

    const options = optionize<OscillatorSoundGeneratorOptions, SelfOptions, SoundGeneratorOptions>()( {
      initialFrequency: 440,
      initialWaveformType: 'sine'
    }, providedOptions );

    super( options );

    // state initialization
    this.oscillatorNode = null;
    this.frequency = options.initialFrequency;
    this.waveformType = options.initialWaveformType;
  }

  /**
   * Starts the oscillator. The name 'play' is used because this is commonly used in the tambo library for sound
   * generators. If the oscillator is already playing, this has no effect.
   */
  public play(): void {
    if ( !this.oscillatorNode ) {
      this.oscillatorNode = phetAudioContext.createOscillator();
      this.oscillatorNode.type = this.waveformType;
      this.oscillatorNode.frequency.setValueAtTime( this.frequency, phetAudioContext.currentTime );
      this.oscillatorNode.connect( this.masterGainNode );
      this.oscillatorNode.start();
    }
  }

  /**
   * Stops the oscillator. If the oscillator isn't playing, this has no effect.
   */
  public stop(): void {
    if ( this.oscillatorNode ) {
      this.oscillatorNode.stop();
      this.oscillatorNode = null;
    }
  }

  /**
   * Sets the waveform type.
   */
  public setWaveformType( waveformType: OscillatorType ): void {
    this.waveformType = waveformType;
    if ( this.oscillatorNode ) {
      this.oscillatorNode.type = waveformType;
    }
  }
}

tambo.register( 'OscillatorSoundGenerator', OscillatorSoundGenerator );

export default OscillatorSoundGenerator;