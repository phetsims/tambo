// Copyright 2020, University of Colorado Boulder

/**
 * AmplitudeModulator instances can be used to create low-frequency amplitude oscillation effects on a loop, oscillator,
 * or other steady sound source.  It is not a sound generator itself, and is instead intended to be used as a component
 * within a sound generator.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import StringProperty from '../../axon/js/StringProperty.js';
import merge from '../../phet-core/js/merge.js';
import EnabledComponent from '../../sun/js/EnabledComponent.js';
import phetAudioContext from './phetAudioContext.js';
import tambo from './tambo.js';

// constants
const DEFAULT_FREQUENCY = 5; // Hz
const DEFAULT_DEPTH = 0.9; // proportion
const DEFAULT_WAVEFORM = 'sine'; // proportion

class AmplitudeModulator extends EnabledComponent {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {NumberProperty} - Controls the frequency of modulation, created if not supplied.
      frequencyProperty: null,

      // (NumberProperty} - Controls the depth of modulation, 0 means no modulation, 1 is the max, created if not
      // supplied.
      depthProperty: null,

      // {StringProperty} - Controls the type of waveform being used for the modulation, see the documentation for Web
      // Audio OscillatorNode for the available types.  Created if not supplied.
      waveformProperty: null

    }, options );

    super( options );

    // @public {NumberProperty} - frequency of the oscillation, generally pretty low, like 1 to 20 or so
    this.frequencyProperty = options.frequencyProperty || new NumberProperty( DEFAULT_FREQUENCY );

    // @public {NumberProperty} - 0 for no audible oscillation, 1 for full modulation
    this.depthProperty = options.depthProperty || new NumberProperty( DEFAULT_DEPTH );

    // @public {StringProperty} - Web Audio oscillator type
    this.waveformProperty = options.waveformProperty || new StringProperty( DEFAULT_WAVEFORM );

    // @private - the low frequency oscillator (LFO) that will control the modulation, created in the handler below
    let lowFrequencyOscillator = null;

    // @private {GainNode} - the main gain node that is modulated in order to produce the amplitude modulation effect
    this.modulatedGainNode = phetAudioContext.createGain();
    this.modulatedGainNode.gain.value = 0.5; // this value is added to the attenuated LFO output value

    // A gain node that attenuates the output of the LFO.  This modifies the oscillator output to range from a max
    // range of -0.5 to 0.5, which is shifted up later in the chain to go from 0 to 1.
    const lfoAttenuator = phetAudioContext.createGain();
    lfoAttenuator.connect( this.modulatedGainNode.gain );

    // hook up the LFO-control properties
    const enabledListener = enabled => {
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
        lowFrequencyOscillator.stop();
        lowFrequencyOscillator = null;

        // Set the gain to 1 so that this will act as a pass-through with no effect on the signal.
        this.modulatedGainNode.gain.setValueAtTime( 1, now );
      }
    };
    this.enabledProperty.link( enabledListener );

    const depthListener = depth => {
      if ( lowFrequencyOscillator ) {
        lfoAttenuator.gain.setValueAtTime( depth / 2, phetAudioContext.currentTime );
        this.modulatedGainNode.gain.setValueAtTime( 1 - depth / 2, phetAudioContext.currentTime );
      }
    };
    this.depthProperty.link( depthListener );

    const waveformListener = waveform => {
      if ( lowFrequencyOscillator ) {
        lowFrequencyOscillator.type = waveform;
      }
    };
    this.waveformProperty.link( waveformListener );

    const frequencyListener = frequency => {
      if ( lowFrequencyOscillator ) {
        lowFrequencyOscillator.frequency.setValueAtTime( frequency, phetAudioContext.currentTime );
      }
    };
    this.frequencyProperty.link( frequencyListener );

    // @private
    this.disposeAmplitudeModulator = () => {
      this.enabledProperty.unlink( enabledListener );
      this.depthProperty.unlink( depthListener );
      this.waveformProperty.unlink( waveformListener );
      this.frequencyProperty.unlink( frequencyListener );
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeAmplitudeModulator();
    super.dispose();
  }

  /**
   * get the gain node to which connections should occur
   * @returns {GainNode}
   * @public
   */
  getConnectionPoint() {
    return this.modulatedGainNode;
  }

  /**
   * connect the output of this modulator to a destination
   * @param {AudioNode|AudioParam} destination
   * @public
   */
  connect( destination ) {
    this.modulatedGainNode.connect( destination );
  }
}

tambo.register( 'AmplitudeModulator', AmplitudeModulator );
export default AmplitudeModulator;