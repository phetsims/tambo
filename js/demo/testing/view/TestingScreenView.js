// Copyright 2018-2020, University of Colorado Boulder

/**
 * view for a screen that allows testing and demonstration of various sound components and behaviors
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import stepTimer from '../../../../../axon/js/stepTimer.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import Range from '../../../../../dot/js/Range.js';
import Utils from '../../../../../dot/js/Utils.js';
import merge from '../../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import ComboBox from '../../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../../sun/js/ComboBoxItem.js';
import DemosScreenView from '../../../../../sun/js/demo/DemosScreenView.js';
import HSlider from '../../../../../sun/js/HSlider.js';
import Panel from '../../../../../sun/js/Panel.js';
import VSlider from '../../../../../sun/js/VSlider.js';
import lightningImage from '../../../../images/lightning_png.js';
import marimbaSound from '../../../../sounds/bright-marimba_mp3.js';
import checkboxCheckedSound from '../../../../sounds/checkbox-checked_mp3.js';
import reverbImpulseResponse from '../../../../sounds/empty_apartment_bedroom_06_resampled_mp3.js';
import loonCallSound from '../../../../sounds/loon-call_mp3.js';
import rhodesChordSound from '../../../../sounds/rhodes-chord_mp3.js';
import sliderIncreaseClickSound from '../../../../sounds/slider-click-01_mp3.js';
import sliderDecreaseClickSound from '../../../../sounds/slider-click-02_mp3.js';
import thunderSound from '../../../../sounds/thunder_mp3.js';
import phetAudioContext from '../../../phetAudioContext.js';
import Playable from '../../../Playable.js';
import FourierToneGenerator from '../../../sound-generators/FourierToneGenerator.js';
import OscillatorSoundGenerator from '../../../sound-generators/OscillatorSoundGenerator.js';
import SoundClip from '../../../sound-generators/SoundClip.js';
import SoundLevelEnum from '../../../SoundLevelEnum.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';
import AmplitudeModulatorDemoNode from './AmplitudeModulatorDemoNode.js';
import CompositeSoundClipTestNode from './CompositeSoundClipTestNode.js';
import ContinuousPropertySoundGeneratorTestNode from './ContinuousPropertySoundGeneratorTestNode.js';
import RemoveAndDisposeSoundGeneratorsTestPanel from './RemoveAndDisposeSoundGeneratorsTestPanel.js';
import SoundClipChordTestNode from './SoundClipChordTestNode.js';
import SoundEncodingComparisonPanel from './SoundEncodingComparisonPanel.js';

// constants
const CHECKBOX_SIZE = 16;
const FONT = new PhetFont( 16 );
const LIGHTNING_SHOWN_TIME = 0.750; // in seconds

class TestingScreenView extends DemosScreenView {

  /**
   * @constructor
   */
  constructor() {

    const resetInProgressProperty = new BooleanProperty( false );

    // demo items, selected via the combo box in the parent class
    const demos = [
      {
        label: 'AmplitudeModulatorTest',
        createNode: layoutBounds => new AmplitudeModulatorDemoNode( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'AdditionalAudioNodesTestNode',
        createNode: layoutBounds => new AdditionalAudioNodesTestNode( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'BasicAndEnhancedSounds',
        createNode: layoutBounds => new BasicAndEnhancedSoundTestNode( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'ContinuousPropertySoundGeneratorTest',
        createNode: layoutBounds => new ContinuousPropertySoundGeneratorTestNode( this.stepEmitter, {
          center: layoutBounds.center
        } )
      },
      {
        label: 'CompositeSoundClipTestNode',
        createNode: layoutBounds => new CompositeSoundClipTestNode( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'RemoveAndDisposeSoundGenerators',
        createNode: layoutBounds => new RemoveAndDisposeSoundGeneratorsTestPanel( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'FourierToneGeneratorTestNode',
        createNode: layoutBounds => new FourierToneGeneratorTestNode( resetInProgressProperty, this, {
          center: layoutBounds.center
        } )
      },
      {
        label: 'LongSoundTest',
        createNode: layoutBounds => new LongSoundTestPanel( resetInProgressProperty, {
          center: layoutBounds.center
        } )
      },
      {
        label: 'SliderSoundTest',
        createNode: layoutBounds => new SliderSoundTestNode( resetInProgressProperty, {
          center: layoutBounds.center
        } )
      },
      {
        label: 'SoundClipChordTestNode',
        createNode: layoutBounds => new SoundClipChordTestNode( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'SoundEncodingComparisonPanel',
        createNode: layoutBounds => new SoundEncodingComparisonPanel( this, {
          center: layoutBounds.center
        } )
      }
    ];

    super( demos );

    // step emitter, needed by some of the demos
    this.stepEmitter = new Emitter( {
      parameters: [ { valueType: 'number' } ]
    } );

    // add the reset all button
    const resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.maxX - 25,
      bottom: this.layoutBounds.maxY - 25,
      listener: () => {
        resetInProgressProperty.set( true );
        resetInProgressProperty.set( false );
      }
    } );
    this.addChild( resetAllButton );
  }

  /**
   * @override
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.stepEmitter.emit( dt );
  }
}

/**
 * a node with two buttons, the 2nd of which only produces sound when in 'enhanced sound' mode
 */
class BasicAndEnhancedSoundTestNode extends VBox {

  constructor( options ) {

    // sound clips to be played
    const loonCallSoundClip = new SoundClip( loonCallSound );
    soundManager.addSoundGenerator( loonCallSoundClip );
    const rhodesChordSoundClip = new SoundClip( rhodesChordSound );
    soundManager.addSoundGenerator( rhodesChordSoundClip, { sonificationLevel: SoundLevelEnum.ENHANCED } );

    // add a button to play a basic-mode sound
    const playBasicSoundButton = new TextPushButton( 'Play Basic-Level Sound', {
      baseColor: '#aad6cc',
      font: new PhetFont( 16 ),
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
      listener: () => { loonCallSoundClip.play(); }
    } );

    // add button to play enhanced-mode sound
    const playEnhancedSoundButton = new TextPushButton( 'Play Enhanced-Level Sound', {
      baseColor: '#DBB1CD',
      font: new PhetFont( 16 ),
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
      listener: () => { rhodesChordSoundClip.play(); }
    } );

    super( merge( {
      children: [ playBasicSoundButton, playEnhancedSoundButton ],
      spacing: 20
    }, options ) );

    // @private - dispose function
    this.disposeBasicAndEnhancedSoundTestNode = () => {
      soundManager.removeSoundGenerator( loonCallSoundClip );
      loonCallSoundClip.dispose();
      soundManager.removeSoundGenerator( rhodesChordSoundClip );
      loonCallSoundClip.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeBasicAndEnhancedSoundTestNode();
    super.dispose();
  }
}

/**
 * A node with buttons for playing sounds in conjunction with reverb nodes.
 */
class AdditionalAudioNodesTestNode extends VBox {

  constructor( options ) {

    // convolver node, which will be used to create the reverb effect
    const convolver = phetAudioContext.createConvolver();
    convolver.buffer = reverbImpulseResponse.audioBufferProperty.value;

    // sound clips to be played
    const shortSoundNormal = new SoundClip( checkboxCheckedSound );
    soundManager.addSoundGenerator( shortSoundNormal );
    const shortSoundWithReverb = new SoundClip( checkboxCheckedSound, {
      additionalAudioNodes: [ convolver ]
    } );
    soundManager.addSoundGenerator( shortSoundWithReverb );

    // font for all buttons
    const buttonFont = new PhetFont( 16 );

    // add a button to play the plain sound
    const playNormalSoundButton = new TextPushButton( 'Normal Sound Clip', {
      baseColor: '#CCFF00',
      font: buttonFont,
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
      listener: () => { shortSoundNormal.play(); }
    } );

    // add button to play the sound with the reverb added in the signal path
    const playSoundWithInsertedAudioNodeButton = new TextPushButton( 'Same Clip with In-Line Reverb Node', {
      baseColor: '#CC99FF',
      font: buttonFont,
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
      listener: () => {shortSoundWithReverb.play();}
    } );

    // add button to play both sounds at the same time
    const playBothSounds = new TextPushButton( 'Both Clips Simultaneously', {
      baseColor: '#FF9999',
      font: buttonFont,
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
      listener: () => {
        shortSoundNormal.play();
        shortSoundWithReverb.play();
      }
    } );

    super( merge( {
      children: [ playNormalSoundButton, playSoundWithInsertedAudioNodeButton, playBothSounds ],
      spacing: 20
    }, options ) );

    // @private - dispose function
    this.disposeBasicAndEnhancedSoundTestNode = () => {
      soundManager.removeSoundGenerator( shortSoundNormal );
      shortSoundNormal.dispose();
      soundManager.removeSoundGenerator( shortSoundWithReverb );
      shortSoundWithReverb.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeBasicAndEnhancedSoundTestNode();
    super.dispose();
  }
}

/**
 * A node for testing the sound generator that will be used in the Fourier sim
 */
class FourierToneGeneratorTestNode extends VBox {

  constructor( resetInProgressProperty, listBoxParent, options ) {

    options = merge( { spacing: 20 }, options );

    // Create and hook up the tone generator.
    const fourierToneGenerator = new FourierToneGenerator();
    soundManager.addSoundGenerator( fourierToneGenerator );

    // checkbox for enabling and disabling sound generation
    const soundGenerationEnabled = new BooleanProperty( false );
    const soundGenerationEnabledCheckbox = new Checkbox(
      new Text( 'Enabled', { font: FONT } ),
      soundGenerationEnabled,
      { boxWidth: CHECKBOX_SIZE }
    );
    soundGenerationEnabled.link( enabled => {
      if ( enabled ) {
        fourierToneGenerator.play();
      }
      else {
        fourierToneGenerator.stop();
      }
    } );

    // combo box for selecting they type of wave that the oscillator should generate
    const waveformTypeProperty = new EnumerationProperty(
      OscillatorSoundGenerator.WaveformType,
      OscillatorSoundGenerator.WaveformType.SINE
    );
    waveformTypeProperty.link( waveformType => {
      fourierToneGenerator.setWaveformType( waveformType );
    } );
    const comboBoxItems = [
      new ComboBoxItem( new Text( 'Sine', { font: FONT } ), OscillatorSoundGenerator.WaveformType.SINE ),
      new ComboBoxItem( new Text( 'Square', { font: FONT } ), OscillatorSoundGenerator.WaveformType.SQUARE ),
      new ComboBoxItem( new Text( 'Triangle', { font: FONT } ), OscillatorSoundGenerator.WaveformType.TRIANGLE ),
      new ComboBoxItem( new Text( 'Sawtooth', { font: FONT } ), OscillatorSoundGenerator.WaveformType.SAWTOOTH )
    ];
    const waveformTypeComboBox = new ComboBox( comboBoxItems, waveformTypeProperty, listBoxParent );

    // Create a set of sliders to control the level of the various harmonics in the tone generator.
    const harmonicControllersHBox = new HBox( { spacing: 3 } );
    const harmonicLevelProperties = [];
    _.times( 11, index => {
      const harmonicLevelProperty = new NumberProperty( 0 );
      harmonicLevelProperties.push( harmonicLevelProperty );
      harmonicLevelProperty.link( level => fourierToneGenerator.setOscillatorOutputLevel( index, level ) );
      const toneControlSlider = new VSlider( harmonicLevelProperty, new Range( -1, 1 ), {
        constrainValue: value => Math.abs( value ) < 0.1 ? 0 : value
      } );
      harmonicControllersHBox.addChild( toneControlSlider );
    } );

    // Handle reset.
    resetInProgressProperty.link( resetInProgress => {
      if ( resetInProgress ) {
        soundGenerationEnabled.reset();
        waveformTypeProperty.reset();
        harmonicLevelProperties.forEach( harmonicLevelProperty => harmonicLevelProperty.reset() );
      }
    } );

    super(
      merge( { children: [ soundGenerationEnabledCheckbox, waveformTypeComboBox, harmonicControllersHBox ] }, options )
    );

    // @private - dispose function
    this.disposeFourierToneGeneratorTestNode = () => {
      soundManager.removeSoundGenerator( fourierToneGenerator );
      fourierToneGenerator.dispose();
      harmonicLevelProperties.forEach( harmonicLevelProperty => harmonicLevelProperty.dispose );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeFourierToneGeneratorTestNode();
    super.dispose();
  }
}

/**
 * LongSoundTestPanel is a node that contains a button that produces a long sound, and tests how that sound behaves
 * when things happen like a reset or a disable while sound is in progress.
 */
class LongSoundTestPanel extends Node {

  constructor( resetInProgressProperty, options ) {

    // internal state variables
    const lightningBoltVisibleProperty = new BooleanProperty( false );
    let lightningBoltVisibleTimeout = null;

    // timeout function
    const timeoutFiredListener = () => {
      lightningBoltVisibleProperty.set( false );
      lightningBoltVisibleTimeout = null;
    };

    // button that will trigger thunder and lightning
    const fireLightningButton = new TextPushButton( 'Lightning', {
      font: FONT,
      listener: () => {
        assert && assert( lightningBoltVisibleTimeout === null, 'timer should not be running when this fires' );
        lightningBoltVisibleProperty.value = true;
        lightningBoltVisibleTimeout = stepTimer.setTimeout( timeoutFiredListener, LIGHTNING_SHOWN_TIME * 1000 );
      }
    } );

    // disable the button while lightning is visible
    lightningBoltVisibleProperty.link( lightningBoltVisible => {
      fireLightningButton.enabled = !lightningBoltVisible;
    } );

    // sound generator for thunder
    const thunderSoundClip = new SoundClip( thunderSound, {
      enableControlProperties: [ DerivedProperty.not( resetInProgressProperty ) ],
      initiateWhenDisabled: true
    } );
    soundManager.addSoundGenerator( thunderSoundClip, { associatedViewNode: fireLightningButton } );
    lightningBoltVisibleProperty.link( visible => {
      if ( visible ) {
        thunderSoundClip.play();
      }
    } );

    // check box that controls whether the thunderSoundClip sound is locally enabled
    const thunderEnabledCheckbox = new Checkbox(
      new Text( 'Enabled', { font: FONT } ),
      thunderSoundClip.locallyEnabledProperty,
      { boxWidth: CHECKBOX_SIZE }
    );

    // check box that controls whether the thunderSoundClip sound can be initiated when disabled
    const initiateThunderWhenDisabledProperty = new BooleanProperty( thunderSoundClip.initiateWhenDisabled );
    initiateThunderWhenDisabledProperty.linkAttribute( thunderSoundClip, 'initiateWhenDisabled' );
    const initiateThunderWhenDisabledCheckbox = new Checkbox(
      new Text( 'Initiate when disabled', { font: FONT } ),
      initiateThunderWhenDisabledProperty,
      { boxWidth: CHECKBOX_SIZE }
    );

    // lay out the set of controls for the thunderSoundClip
    const thunderControl = new VBox( {
      children: [
        new Text( 'Thunder: ', { font: new PhetFont( 16 ) } ),
        thunderEnabledCheckbox,
        initiateThunderWhenDisabledCheckbox
      ],
      align: 'left',
      spacing: 8
    } );

    // panel where thunderSoundClip and lightning are controlled
    const lightningControlPanel = new Panel(
      new HBox( { children: [ fireLightningButton, thunderControl ], spacing: 14, align: 'top' } ),
      {
        xMargin: 10,
        yMargin: 8,
        fill: '#FCFBE3'
      }
    );

    // add the lightning bolt that will appear when commanded by the user (and make him/her feel like Zeus)
    const lightningBoltNode = new Image( lightningImage, {
      left: lightningControlPanel.left + 25,
      top: lightningControlPanel.bottom - 3,
      maxHeight: 50
    } );

    // only show the lightning when the model indicates - this is done after the panel is created so the layout works
    lightningBoltVisibleProperty.linkAttribute( lightningBoltNode, 'visible' );

    super( merge( { children: [ lightningBoltNode, lightningControlPanel ] }, options ) );

    // handle reset
    const resetHandler = () => {
      stepTimer.clearTimeout( timeoutFiredListener );
    };
    resetInProgressProperty.link( resetHandler );

    // @private - dispose function
    this.disposeLongSoundTestPanel = () => {
      resetInProgressProperty.unlink( resetHandler );
      soundManager.removeSoundGenerator( thunderSoundClip );
      lightningBoltVisibleTimeout && stepTimer.clearTimeout( lightningBoltVisibleTimeout );
    };
  }

  /**
   * release memory to avoid leaks
   * @public
   */
  dispose() {
    this.disposeLongSoundTestPanel();
    super.dispose();
  }
}

class SliderSoundTestNode extends HBox {

  constructor( resetInProgressProperty, options ) {

    // local constants
    const sliderMax = 5;
    const sliderTrackSize = new Dimension2( 150, 5 );
    const sliderThumbSize = new Dimension2( 22, 45 );
    const numberOfTickMarks = sliderMax + 1;
    const numberOfBinsForContinuousSlider = 8;
    const binSizeForContinuousSlider = sliderMax / numberOfBinsForContinuousSlider;

    // internal state
    const discreteValueProperty = new NumberProperty( 0 );
    const continuousValueProperty = new NumberProperty( 0 );

    // add a slider with snap-to-ticks behavior
    const discreteSlider = new HSlider( discreteValueProperty, new Range( 0, sliderMax ), {
      trackSize: sliderTrackSize,
      thumbSize: sliderThumbSize,
      constrainValue: value => Utils.roundSymmetric( value ),
      keyboardStep: 1
    } );
    _.times( numberOfTickMarks, index => { discreteSlider.addMinorTick( index ); } );

    // create an inverted version of the reset-in-progress Property, used to mute sounds during reset
    const resetNotInProgressProperty = DerivedProperty.not( resetInProgressProperty );

    // add sound generators that will play a sound when the value controlled by the slider changes
    const sliderIncreaseClickSoundClip = new SoundClip( sliderIncreaseClickSound );
    soundManager.addSoundGenerator( sliderIncreaseClickSoundClip );
    const sliderDecreaseClickSoundClip = new SoundClip( sliderDecreaseClickSound, {
      initiateWhenDisabled: false,
      enableControlProperties: [ resetNotInProgressProperty ]
    } );
    soundManager.addSoundGenerator( sliderDecreaseClickSoundClip );
    discreteValueProperty.lazyLink( ( newValue, oldValue ) => {
      if ( newValue > oldValue ) {
        sliderIncreaseClickSoundClip.play();
      }
      else {
        sliderDecreaseClickSoundClip.play();
      }
    } );

    // flag that indicates whether slider is being dragged through keyboard interaction
    let sliderBeingDraggedByKeyboard = false;

    // Add a slider with continuous behavior.  We create our own thumb node so that we can observe it.
    const continuousSlider = new HSlider( continuousValueProperty, new Range( 0, sliderMax ), {
      trackSize: sliderTrackSize,
      thumbSize: sliderThumbSize,
      thumbFill: '#880000',
      thumbFillHighlighted: '#aa0000',
      startDrag: event => {
        if ( event.type === 'keydown' ) {
          sliderBeingDraggedByKeyboard = true;
        }
      },
      endDrag: () => { sliderBeingDraggedByKeyboard = false; }
    } );

    // Play a sound when certain threshold values are crossed by the continuous Property value, or when a change occurs
    // in the absence of interaction with the slider, since that implies keyboard-driven interaction.
    const marimbaSoundClip = new SoundClip( marimbaSound, { enableControlProperties: [ resetNotInProgressProperty ] } );
    soundManager.addSoundGenerator( marimbaSoundClip );

    // define a function that will play the marimba sound at a pitch value based on the continuous value Property
    function playSoundForContinuousValue() {
      const playbackRate = Math.pow( 2, continuousValueProperty.get() / sliderMax );
      marimbaSoundClip.setPlaybackRate( playbackRate );
      marimbaSoundClip.play();
    }

    continuousValueProperty.lazyLink( ( newValue, oldValue ) => {

      const mapValueToBin = value => Math.min(
        Math.floor( value / binSizeForContinuousSlider ),
        numberOfBinsForContinuousSlider - 1
      );

      // Play the sound when certain threshold values are crossed or when a change occurs in the absence of mouse/touch
      // interaction with the slider, which implies keyboard-driven interaction.
      if ( sliderBeingDraggedByKeyboard ||
           mapValueToBin( newValue ) !== mapValueToBin( oldValue ) ||
           newValue === 0 && oldValue !== 0 ||
           newValue === sliderMax && oldValue !== sliderMax ) {

        playSoundForContinuousValue();
      }
    } );

    super( merge( {
      children: [ discreteSlider, continuousSlider ],
      spacing: 20
    }, options ) );

    // reset slider positions when a reset-all event occurs
    const resetListener = resetInProgress => {
      if ( resetInProgress ) {
        continuousValueProperty.reset();
        discreteValueProperty.reset();
      }
    };
    resetInProgressProperty.link( resetListener );

    // @private - dispose function
    this.disposeSliderSoundTestNode = () => {
      resetInProgressProperty.unlink( resetListener );
      soundManager.removeSoundGenerator( sliderIncreaseClickSoundClip );
      soundManager.removeSoundGenerator( sliderDecreaseClickSoundClip );
      soundManager.removeSoundGenerator( marimbaSoundClip );
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeSliderSoundTestNode();
    super.dispose();
  }
}

tambo.register( 'TestingScreenView', TestingScreenView );
export default TestingScreenView;