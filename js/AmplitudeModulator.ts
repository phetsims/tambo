// Copyright 2020-2022, University of Colorado Boulder

/**
 * AmplitudeModulator instances can be used to create low-frequency amplitude oscillation effects on a loop, oscillator,
 * or other steady sound source.  It is not a sound generator itself, and is instead intended to be used as a component
 * within a sound generator.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import EnabledComponent, { EnabledComponentOptions } from '../../axon/js/EnabledComponent.js';
import phetAudioContext from './phetAudioContext.js';
import tambo from './tambo.js';
import optionize from '../../phet-core/js/optionize.js';
import Property from '../../axon/js/Property.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {

  // controls the frequency of modulation, created if not supplied
  frequencyProperty?: NumberProperty | null;

  // controls the depth of modulation, 0 means no modulation, 1 is the max, created if not supplied
  depthProperty?: NumberProperty | null;

  // Controls the type of waveform being used for the modulation, see the documentation for Web Audio OscillatorNode for
  // the available types.  Created if not supplied.
  waveformProperty?: Property<OscillatorType> | null;
};

export type AmplitudeModulatorOptions = SelfOptions & StrictOmit<EnabledComponentOptions, 'enabledProperty'>;

// constants
const DEFAULT_FREQUENCY = 5; // Hz
const DEFAULT_DEPTH = 0.9; // proportion
const DEFAULT_WAVEFORM = 'sine'; // proportion

class AmplitudeModulator extends EnabledComponent {

  // frequency of the oscillation, generally pretty low, like 1 to 20 or so
  public readonly frequencyProperty: NumberProperty;

  // depth of modulation, 0 for none, 1 for full modulation
  public readonly depthProperty: NumberProperty;

  // Web Audio oscillator type
  public readonly waveformProperty: Property<OscillatorType>;

  // the main gain node that is modulated in order to produce the amplitude modulation effect
  private readonly modulatedGainNode: GainNode;

  // dispose function
  private readonly disposeAmplitudeModulator: () => void;

  public readonly myEnabledProperty: Property<boolean>;

  public constructor( providedOptions?: AmplitudeModulatorOptions ) {

    const options = optionize<AmplitudeModulatorOptions, SelfOptions, EnabledComponentOptions>()( {
      frequencyProperty: null,
      depthProperty: null,
      waveformProperty: null
    }, providedOptions );

    super( options );

    assert && assert( this.enabledProperty instanceof Property, 'enabledProperty must be of type Property' );
    this.myEnabledProperty = this.enabledProperty as Property<boolean>;

    this.frequencyProperty = options.frequencyProperty || new NumberProperty( DEFAULT_FREQUENCY );
    this.depthProperty = options.depthProperty || new NumberProperty( DEFAULT_DEPTH );
    this.waveformProperty = options.waveformProperty || new Property<OscillatorType>( DEFAULT_WAVEFORM );
    this.modulatedGainNode = phetAudioContext.createGain();
    this.modulatedGainNode.gain.value = 0.5; // this value is added to the attenuated LFO output value

    // A gain node that attenuates the output of the LFO.  This modifies the oscillator output to range from a max
    // range of -0.5 to 0.5, which is shifted up later in the chain to go from 0 to 1.
    const lfoAttenuator = phetAudioContext.createGain();
    lfoAttenuator.connect( this.modulatedGainNode.gain );

    let lowFrequencyOscillator: OscillatorNode | null = null;

    // hook up the LFO-control properties
    const enabledListener = ( enabled: boolean ) => {
      const now = phetAudioContext.currentTime;
      if ( enabled ) {

        // state checking
        assert && assert( !lowFrequencyOscillator, 'LFO should\'t exist yet on transition to enabled' );

        // set up the modulation
        const depth = this.depthProperty.value;
        lfoAttenuator.gain.setValueAtTime( depth / 2, phetAudioContext.currentTime );
        this.modulatedGainNode.gain.setValueAtTime( 1 - depth / 2, phetAudioContext.currentTime );

        // create, configure, and start the LFO
        lowFrequencyOscillator = phetAudioContext.createOscillator();
        lowFrequencyOscillator.frequency.setValueAtTime( this.frequencyProperty.value, now );
        lowFrequencyOscillator.type = this.waveformProperty.value;
        lowFrequencyOscillator.connect( lfoAttenuator );
        lowFrequencyOscillator.start();
      }
      else {

        // Stop the oscillator.  According to the spec, there is no need to disconnect - it's automatic.
        lowFrequencyOscillator!.stop();
        lowFrequencyOscillator = null;

        // Set the gain to 1 so that this will act as a pass-through with no effect on the signal.
        this.modulatedGainNode.gain.setValueAtTime( 1, now );
      }
    };
    this.enabledProperty.link( enabledListener );

    const depthListener = ( depth: number ) => {
      if ( lowFrequencyOscillator ) {
        lfoAttenuator.gain.setValueAtTime( depth / 2, phetAudioContext.currentTime );
        this.modulatedGainNode.gain.setValueAtTime( 1 - depth / 2, phetAudioContext.currentTime );
      }
    };
    this.depthProperty.link( depthListener );

    const waveformListener = ( waveform: OscillatorType ) => {
      if ( lowFrequencyOscillator ) {
        lowFrequencyOscillator.type = waveform;
      }
    };
    this.waveformProperty.link( waveformListener );

    const frequencyListener = ( frequency: number ) => {
      if ( lowFrequencyOscillator ) {
        lowFrequencyOscillator.frequency.setValueAtTime( frequency, phetAudioContext.currentTime );
      }
    };
    this.frequencyProperty.link( frequencyListener );

    // dispose function
    this.disposeAmplitudeModulator = () => {
      this.enabledProperty.unlink( enabledListener );
      this.depthProperty.unlink( depthListener );
      this.waveformProperty.unlink( waveformListener );
      this.frequencyProperty.unlink( frequencyListener );
    };
  }

  /**
   * Clean up memory references to avoid memory leaks.
   */
  public override dispose(): void {
    this.disposeAmplitudeModulator();
    super.dispose();
  }

  /**
   * Get the gain node to which connections should occur.
   */
  public getConnectionPoint(): GainNode {
    return this.modulatedGainNode;
  }

  /**
   * Connect the output of this modulator to a destination.
   */
  public connect( destination: AudioNode | AudioParam ): void {
    this.modulatedGainNode.connect( destination as AudioNode );
  }
}

tambo.register( 'AmplitudeModulator', AmplitudeModulator );

export default AmplitudeModulator;