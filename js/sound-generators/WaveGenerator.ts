// Copyright 2019-2022, University of Colorado Boulder

/**
 * Plays a sine wave using an Oscillator Node
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import LinearFunction from '../../../dot/js/LinearFunction.js';
import optionize from '../../../phet-core/js/optionize.js';
import SoundGenerator, { SoundGeneratorOptions } from './SoundGenerator.js';
import soundConstants from '../../../tambo/js/soundConstants.js';
import tambo from '../tambo.js';

// For the sound scene, map the amplitude to the output level for the "Play Tone"
const mapAmplitudeToOutputLevel = new LinearFunction(
  0,
  10,
  0,
  0.3 // Max output level
);

type SelfOptions = {
  initialOutputLevel?: number;
  oscillatorType?: OscillatorType;
};

type WaveGeneratorOptions = SelfOptions & SoundGeneratorOptions;

class WaveGenerator extends SoundGenerator {

  // {OscillatorNode|null} created when sound begins and nullified when sound ends, see #373
  private oscillator: OscillatorNode | null;

  public constructor( frequencyProperty: ReadOnlyProperty<number>, amplitudeProperty: ReadOnlyProperty<number>, providedOptions?: WaveGeneratorOptions ) {
    const options = optionize<WaveGeneratorOptions, SelfOptions, SoundGeneratorOptions>()( {
      initialOutputLevel: 0, // Starts silent, see elsewhere in this file for where the outputLevel is set as a function of amplitude
      oscillatorType: 'sine'
    }, providedOptions );
    super( options );

    this.oscillator = null;
    const updateFrequency = () => {
      const value = frequencyProperty.value * 1000; // convert frequency in mHz to Hz
      this.oscillator && this.oscillator.frequency.setValueAtTime( value, this.audioContext.currentTime );
    };
    frequencyProperty.link( updateFrequency );

    this.fullyEnabledProperty.link( fullyEnabled => {
      if ( fullyEnabled && this.oscillator === null ) {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = options.oscillatorType;
        updateFrequency();
        this.oscillator.connect( this.soundSourceDestination );
        this.oscillator.start();
      }
      else if ( !fullyEnabled && this.oscillator !== null ) {

        // Turn off the audio, note that there is no need to disconnect the oscillator - this happens automatically
        this.oscillator.stop( this.audioContext.currentTime + soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME );
        this.oscillator = null;
      }
    } );

    // wire up volume to amplitude
    amplitudeProperty.link( amplitude => this.setOutputLevel( mapAmplitudeToOutputLevel.evaluate( amplitude ) ) );
  }
}

tambo.register( 'WaveGenerator', WaveGenerator );
export default WaveGenerator;