// Copyright 2018-2022, University of Colorado Boulder

/**
 * view for a screen that allows testing and demonstration of various sound components and behaviors
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../../axon/js/Emitter.js';
import stepTimer from '../../../../../axon/js/stepTimer.js';
import merge from '../../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { HBox, Image, Node, NodeOptions, Text, VBox, VBoxOptions } from '../../../../../scenery/js/imports.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import DemosScreenView, { SunDemo } from '../../../../../sun/js/demo/DemosScreenView.js';
import Panel from '../../../../../sun/js/Panel.js';
import lightning_png from '../../../../images/lightning_png.js';
import checkboxChecked_mp3 from '../../../../sounds/checkboxChecked_mp3.js';
import loonCall_mp3 from '../../../../sounds/demo-and-test/loonCall_mp3.js';
import rhodesChord_mp3 from '../../../../sounds/demo-and-test/rhodesChord_mp3.js';
import thunder_mp3 from '../../../../sounds/demo-and-test/thunder_mp3.js';
import emptyApartmentBedroom06Resampled_mp3 from '../../../../sounds/emptyApartmentBedroom06Resampled_mp3.js';
import phetAudioContext from '../../../phetAudioContext.js';
import SoundClip from '../../../sound-generators/SoundClip.js';
import SoundLevelEnum from '../../../SoundLevelEnum.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';
import AmplitudeModulatorDemoNode from './AmplitudeModulatorDemoNode.js';
import CompositeSoundClipTestNode from './CompositeSoundClipTestNode.js';
import ContinuousPropertySoundGeneratorTestNode from './ContinuousPropertySoundGeneratorTestNode.js';
import RemoveAndDisposeSoundGeneratorsTestPanel from './RemoveAndDisposeSoundGeneratorsTestPanel.js';
import SoundClipChordTestNode from './SoundClipChordTestNode.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import { TimerListener } from '../../../../../axon/js/Timer.js';
import nullSoundPlayer from '../../../shared-sound-players/nullSoundPlayer.js';
import TEmitter from '../../../../../axon/js/TEmitter.js';

// constants
const CHECKBOX_SIZE = 16;
const FONT = new PhetFont( 16 );
const LIGHTNING_SHOWN_TIME = 0.750; // in seconds

class TestingScreenView extends DemosScreenView {

  private readonly stepEmitter: TEmitter<[ number ]>;

  public constructor() {

    const resetInProgressProperty = new BooleanProperty( false );

    // demo items, selected via the combo box in the parent class
    const demos: SunDemo[] = [
      {
        label: 'AmplitudeModulatorTest',
        createNode: ( layoutBounds: Bounds2 ) => new AmplitudeModulatorDemoNode( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'AdditionalAudioNodesTestNode',
        createNode: ( layoutBounds: Bounds2 ) => new AdditionalAudioNodesTestNode( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'BasicAndExtraSounds',
        createNode: ( layoutBounds: Bounds2 ) => new BasicAndExtraSoundTestNode( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'ContinuousPropertySoundGeneratorTest',
        createNode: ( layoutBounds: Bounds2 ) => new ContinuousPropertySoundGeneratorTestNode( this.stepEmitter, {
          center: layoutBounds.center
        } )
      },
      {
        label: 'CompositeSoundClipTestNode',
        createNode: ( layoutBounds: Bounds2 ) => new CompositeSoundClipTestNode( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'RemoveAndDisposeSoundGenerators',
        createNode: ( layoutBounds: Bounds2 ) => new RemoveAndDisposeSoundGeneratorsTestPanel( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'LongSoundTest',
        createNode: ( layoutBounds: Bounds2 ) => new LongSoundTestPanel( resetInProgressProperty, {
          center: layoutBounds.center
        } )
      },
      {
        label: 'SoundClipChordTestNode',
        createNode: ( layoutBounds: Bounds2 ) => new SoundClipChordTestNode( {
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

  public override step( dt: number ): void {
    this.stepEmitter.emit( dt );
  }
}

/**
 * a node with two buttons, the 2nd of which only produces sound when in 'extra sound' mode
 */
class BasicAndExtraSoundTestNode extends VBox {

  private readonly disposeBasicAndExtraSoundTestNode: () => void;

  public constructor( options: VBoxOptions ) {

    // sound clips to be played
    const loonCallSoundClip = new SoundClip( loonCall_mp3 );
    soundManager.addSoundGenerator( loonCallSoundClip );
    const rhodesChordSoundClip = new SoundClip( rhodesChord_mp3 );
    soundManager.addSoundGenerator( rhodesChordSoundClip, { sonificationLevel: SoundLevelEnum.EXTRA } );

    // add a button to play a basic-mode sound
    const playBasicSoundButton = new TextPushButton( 'Play Basic-Level Sound', {
      baseColor: '#aad6cc',
      font: new PhetFont( 16 ),
      soundPlayer: loonCallSoundClip
    } );

    // add button to play extra-mode sound
    const playExtraSoundButton = new TextPushButton( 'Play Extra-Level Sound', {
      baseColor: '#DBB1CD',
      font: new PhetFont( 16 ),
      soundPlayer: rhodesChordSoundClip
    } );

    super( merge( {
      children: [ playBasicSoundButton, playExtraSoundButton ],
      spacing: 20
    }, options ) );

    // dispose function
    this.disposeBasicAndExtraSoundTestNode = () => {
      soundManager.removeSoundGenerator( loonCallSoundClip );
      loonCallSoundClip.dispose();
      soundManager.removeSoundGenerator( rhodesChordSoundClip );
      loonCallSoundClip.dispose();
    };
  }

  /**
   * Release references to avoid memory leaks.
   */
  public override dispose(): void {
    this.disposeBasicAndExtraSoundTestNode();
    super.dispose();
  }
}

/**
 * A node with buttons for playing sounds in conjunction with reverb nodes.
 */
class AdditionalAudioNodesTestNode extends VBox {

  private readonly disposeBasicAndExtraSoundTestNode: () => void;

  public constructor( options: VBoxOptions ) {

    // convolver node, which will be used to create the reverb effect
    const convolver = phetAudioContext.createConvolver();
    convolver.buffer = emptyApartmentBedroom06Resampled_mp3.audioBufferProperty.value;

    // sound clips to be played
    const shortSoundNormal = new SoundClip( checkboxChecked_mp3 );
    soundManager.addSoundGenerator( shortSoundNormal );
    const shortSoundWithReverb = new SoundClip( checkboxChecked_mp3, {
      additionalAudioNodes: [ convolver ]
    } );
    soundManager.addSoundGenerator( shortSoundWithReverb );

    // font for all buttons
    const buttonFont = new PhetFont( 16 );

    // add a button to play the plain sound
    const playNormalSoundButton = new TextPushButton( 'Normal Sound Clip', {
      baseColor: '#CCFF00',
      font: buttonFont,
      soundPlayer: shortSoundNormal
    } );

    // add button to play the sound with the reverb added in the signal path
    const playSoundWithInsertedAudioNodeButton = new TextPushButton( 'Same Clip with In-Line Reverb Node', {
      baseColor: '#CC99FF',
      font: buttonFont,
      soundPlayer: shortSoundWithReverb
    } );

    // add button to play both sounds at the same time
    const playBothSounds = new TextPushButton( 'Both Clips Simultaneously', {
      baseColor: '#FF9999',
      font: buttonFont,
      soundPlayer: nullSoundPlayer, // turn off default sound generation
      listener: () => {
        shortSoundNormal.play();
        shortSoundWithReverb.play();
      }
    } );

    super( merge( {
      children: [ playNormalSoundButton, playSoundWithInsertedAudioNodeButton, playBothSounds ],
      spacing: 20
    }, options ) );

    // dispose function
    this.disposeBasicAndExtraSoundTestNode = () => {
      soundManager.removeSoundGenerator( shortSoundNormal );
      shortSoundNormal.dispose();
      soundManager.removeSoundGenerator( shortSoundWithReverb );
      shortSoundWithReverb.dispose();
    };
  }

  /**
   * Release references to avoid memory leaks.
   */
  public override dispose(): void {
    this.disposeBasicAndExtraSoundTestNode();
    super.dispose();
  }
}

/**
 * LongSoundTestPanel is a node that contains a button that produces a long sound, and tests how that sound behaves
 * when things happen like a reset or a disable while sound is in progress.
 */
class LongSoundTestPanel extends Node {

  private readonly disposeLongSoundTestPanel: () => void;

  public constructor( resetInProgressProperty: BooleanProperty, options: NodeOptions ) {

    // internal state variables
    const lightningBoltVisibleProperty = new BooleanProperty( false );
    let lightningBoltVisibleTimeout: null | TimerListener = null;

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
    const thunderSoundClip = new SoundClip( thunder_mp3, {
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
    const thunderEnabledCheckbox = new Checkbox( thunderSoundClip.locallyEnabledProperty, new Text( 'Enabled', { font: FONT } ), { boxWidth: CHECKBOX_SIZE } );

    // check box that controls whether the thunderSoundClip sound can be initiated when disabled
    const initiateThunderWhenDisabledProperty = new BooleanProperty( thunderSoundClip.initiateWhenDisabled );
    initiateThunderWhenDisabledProperty.linkAttribute( thunderSoundClip, 'initiateWhenDisabled' );
    const initiateThunderWhenDisabledCheckbox = new Checkbox( initiateThunderWhenDisabledProperty, new Text( 'Initiate when disabled', { font: FONT } ), { boxWidth: CHECKBOX_SIZE } );

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
    const lightningBoltNode = new Image( lightning_png, {
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

    // dispose function
    this.disposeLongSoundTestPanel = () => {
      resetInProgressProperty.unlink( resetHandler );
      soundManager.removeSoundGenerator( thunderSoundClip );
      lightningBoltVisibleTimeout && stepTimer.clearTimeout( lightningBoltVisibleTimeout );
    };
  }

  /**
   * release memory to avoid leaks
   */
  public override dispose(): void {
    this.disposeLongSoundTestPanel();
    super.dispose();
  }
}

tambo.register( 'TestingScreenView', TestingScreenView );

export default TestingScreenView;