// Copyright 2020-2022, University of Colorado Boulder

/**
 * View portion of the demo and test harness for the AmplitudeModulator class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { HBox, Text, VBox, VBoxOptions } from '../../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../../sun/js/AquaRadioButtonGroup.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import HSlider from '../../../../../sun/js/HSlider.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';
import AmplitudeModulatorDemo from '../model/AmplitudeModulatorDemo.js';

type SelfOptions = {};
export type AmplitudeModulatorDemoNodeOptions = SelfOptions & VBoxOptions;

// constants
const LABEL_FONT = new PhetFont( 16 );

class AmplitudeModulatorDemoNode extends VBox {

  constructor( providedOptions: AmplitudeModulatorDemoNodeOptions ) {

    const soundSourceRadioButtonItems = [
      {
        node: new Text( 'None', { font: LABEL_FONT } ),
        value: 0
      },
      {
        node: new Text( 'Sound 1', { font: LABEL_FONT } ),
        value: 1
      },
      {
        node: new Text( 'Sound 2', { font: LABEL_FONT } ),
        value: 2
      },
      {
        node: new Text( 'Sound 3', { font: LABEL_FONT } ),
        value: 3
      }
    ];

    const sourceSoundIndexProperty = new NumberProperty( 0 );
    const soundIndexSelector = new AquaRadioButtonGroup( sourceSoundIndexProperty, soundSourceRadioButtonItems );
    const soundIndexSelectorVBox = new VBox( {
      children: [
        new Text( 'Source Sound:', { font: LABEL_FONT } ),
        soundIndexSelector
      ],
      spacing: 5
    } );

    // Create the amplitude modulator demo instance and add it to the sound manager.
    const amplitudeModulatorDemo = new AmplitudeModulatorDemo( sourceSoundIndexProperty );
    soundManager.addSoundGenerator( amplitudeModulatorDemo );

    // LFO enabled control
    const lfoEnabled = new Checkbox(
      new Text( 'LFO Enabled', { font: LABEL_FONT } ),
      amplitudeModulatorDemo.amplitudeModulator.enabledProperty as BooleanProperty,
      { boxWidth: 16 }
    );

    // frequency control
    const frequencyControlHBox = new HBox( {
      children: [
        new Text( 'Frequency: ', { font: LABEL_FONT } ),
        new HSlider(
          amplitudeModulatorDemo.amplitudeModulator.frequencyProperty,
          new Range( 0.5, 20 )
        )
      ]
    } );

    // depth control
    const depthControlHBox = new HBox( {
      children: [
        new Text( 'Depth: ', { font: LABEL_FONT } ),
        new HSlider(
          amplitudeModulatorDemo.amplitudeModulator.depthProperty,
          new Range( 0, 1 )
        )
      ]
    } );

    // waveform type selector
    const waveformRadioButtonItems = [
      {
        node: new Text( 'Sine', { font: LABEL_FONT } ),
        value: 'sine'
      },
      {
        node: new Text( 'Square', { font: LABEL_FONT } ),
        value: 'square'
      },
      {
        node: new Text( 'Triangle', { font: LABEL_FONT } ),
        value: 'triangle'
      },
      {
        node: new Text( 'Sawtooth', { font: LABEL_FONT } ),
        value: 'sawtooth'
      }
    ];

    const waveformSelector = new AquaRadioButtonGroup(
      amplitudeModulatorDemo.amplitudeModulator.waveformProperty,
      waveformRadioButtonItems
    );
    const waveformSelectorVBox = new VBox( {
      children: [
        new Text( 'Modulation Waveform:', { font: LABEL_FONT } ),
        waveformSelector
      ],
      spacing: 5
    } );

    super( optionize<AmplitudeModulatorDemoNodeOptions, SelfOptions, VBoxOptions>( {
      children: [ soundIndexSelectorVBox, lfoEnabled, frequencyControlHBox, depthControlHBox, waveformSelectorVBox ],
      spacing: 15,
      align: 'left'
    }, providedOptions ) );
  }
}

tambo.register( 'AmplitudeModulatorDemoNode', AmplitudeModulatorDemoNode );
export default AmplitudeModulatorDemoNode;