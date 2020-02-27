// Copyright 2018-2020, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Property from '../../../../../axon/js/Property.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import Range from '../../../../../dot/js/Range.js';
import Utils from '../../../../../dot/js/Utils.js';
import ScreenView from '../../../../../joist/js/ScreenView.js';
import PlayPauseButton from '../../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import ResetAllButton from '../../../../../scenery-phet/js/buttons/ResetAllButton.js';
import StepBackwardButton from '../../../../../scenery-phet/js/buttons/StepBackwardButton.js';
import StepForwardButton from '../../../../../scenery-phet/js/buttons/StepForwardButton.js';
import NumberPicker from '../../../../../scenery-phet/js/NumberPicker.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import DragListener from '../../../../../scenery/js/listeners/DragListener.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import ABSwitch from '../../../../../sun/js/ABSwitch.js';
import AquaRadioButton from '../../../../../sun/js/AquaRadioButton.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import ComboBox from '../../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../../sun/js/ComboBoxItem.js';
import HSlider from '../../../../../sun/js/HSlider.js';
import Panel from '../../../../../sun/js/Panel.js';
import lightningImage from '../../../../images/lightning_png.js';
import marimbaSound from '../../../../sounds/bright-marimba_mp3.js';
import chargesInBodySound from '../../../../sounds/charges-in-body-better_mp3.js';
import edgeBoundarySound from '../../../../sounds/edge-boundary-bottle_mp3.js';
import grab001Sound from '../../../../sounds/grab-001_mp3.js';
import grab002Sound from '../../../../sounds/grab-002_mp3.js';
import grabReleaseV2Sound from '../../../../sounds/grab-release-v2_mp3.js';
import grabV2Sound from '../../../../sounds/grab-v2_mp3.js';
import pause001Sound from '../../../../sounds/pause-001_mp3.js';
import pauseSound from '../../../../sounds/pause_mp3.js';
import playPause001Sound from '../../../../sounds/play-pause-001_mp3.js';
import playPause002Sound from '../../../../sounds/play-pause-002_mp3.js';
import playPause003Sound from '../../../../sounds/play-pause-003_mp3.js';
import playPause004Sound from '../../../../sounds/play-pause-004_mp3.js';
import release001Sound from '../../../../sounds/release-001_mp3.js';
import release002Sound from '../../../../sounds/release-002_mp3.js';
import sliderIncreaseClickSound from '../../../../sounds/slider-click-01_mp3.js';
import sliderDecreaseClickSound from '../../../../sounds/slider-click-02_mp3.js';
import stepBack001Sound from '../../../../sounds/step-back-001_mp3.js';
import stepBack002Sound from '../../../../sounds/step-back-002_mp3.js';
import stepBackV2Sound from '../../../../sounds/step-back-v2_mp3.js';
import stepBackSound from '../../../../sounds/step-back_mp3.js';
import stepForward001Sound from '../../../../sounds/step-forward-001_mp3.js';
import stepForward002Sound from '../../../../sounds/step-forward-002_mp3.js';
import stepForwardV2Sound from '../../../../sounds/step-forward-v2_mp3.js';
import stepForwardSound from '../../../../sounds/step-forward_mp3.js';
import thunderSound from '../../../../sounds/thunder_mp3.js';
import radioButtonSoundPlayerFactory from '../../../radioButtonSoundPlayerFactory.js';
import SoundClip from '../../../sound-generators/SoundClip.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';

// constants
const SLIDER_MAX = 5;
const SLIDER_TRACK_SIZE = new Dimension2( 150, 5 );
const SLIDER_THUMB_SIZE = new Dimension2( 22, 45 );
const NUM_TICK_MARKS = SLIDER_MAX + 1;
const CHECKBOX_SIZE = 16;
const FONT = new PhetFont( 16 );
const NUM_BINS_FOR_CONTINUOUS_SLIDER = 8;
const BIN_SIZE_FOR_CONTINUOUS_SLIDER = SLIDER_MAX / NUM_BINS_FOR_CONTINUOUS_SLIDER;
const RADIO_BUTTON_FONT = new PhetFont( 14 );
const RADIO_BUTTON_RADIUS = 6;


// sounds

const playSounds = [

  // the order here is important, since the first sound is meant to be the current favorite
  playPause003Sound,
  playPause001Sound,
  playPause002Sound,
  playPause004Sound
];

const pauseSounds = [

  // the order here is important, since the first sound is meant to be the current favorite
  pauseSound,
  pause001Sound,
  pauseSound, // TODO: Why are these duplicated?
  pause001Sound
];

const stepForwardSounds = [

  // the order here is important, since the first sound is meant to be the current favorite
  stepForwardV2Sound,
  stepForwardSound,
  stepForward001Sound,
  stepForward002Sound
];

const stepBackwardSounds = [

  // the order here is important, since the first sound is meant to be the current favorite
  stepBackV2Sound,
  stepBackSound,
  stepBack001Sound,
  stepBack002Sound
];

const grabSounds = [

  // the order here is important, since the first sound is meant to be the current favorite
  grabV2Sound,
  grab002Sound,
  grab001Sound
];

const releaseSounds = [

  // the order here is important, since the first sound is meant to be the current favorite
  grabReleaseV2Sound,
  release002Sound,
  release001Sound
];

class UIComponentsScreenView extends ScreenView {

  /**
   * @constructor
   */
  constructor( model ) {
    super();

    // add a slider with snap-to-ticks behavior
    const discreteSlider = new HSlider( model.discreteValueProperty, new Range( 0, SLIDER_MAX ), {
      trackSize: SLIDER_TRACK_SIZE,
      thumbSize: SLIDER_THUMB_SIZE,
      left: 115,
      top: 115,
      constrainValue: value => Utils.roundSymmetric( value ),
      keyboardStep: 1
    } );
    _.times( NUM_TICK_MARKS, index => { discreteSlider.addMinorTick( index ); } );
    this.addChild( discreteSlider );

    // create an inverted version of the reset-in-progress Property, used to mute sounds during reset
    const resetNotInProgressProperty = new DerivedProperty(
      [ model.resetInProgressProperty ],
      resetInProgress => !resetInProgress
    );

    // add sound generators that will play a sound when the value controlled by the slider changes
    const sliderIncreaseClickSoundClip = new SoundClip( sliderIncreaseClickSound );
    soundManager.addSoundGenerator( sliderIncreaseClickSoundClip );
    const sliderDecreaseClickSoundClip = new SoundClip( sliderDecreaseClickSound, {
      initiateWhenDisabled: false,
      enableControlProperties: [ resetNotInProgressProperty ]
    } );
    soundManager.addSoundGenerator( sliderDecreaseClickSoundClip );
    model.discreteValueProperty.lazyLink( ( newValue, oldValue ) => {
      if ( newValue > oldValue ) {
        sliderIncreaseClickSoundClip.play();
      }
      else {
        sliderDecreaseClickSoundClip.play();
      }
    } );

    // add an AB switch that will turn on/off a looping sound
    const abSwitch = new ABSwitch(
      model.loopOnProperty,
      false,
      new Text( 'Off', { font: FONT } ),
      true,
      new Text( 'On', { font: FONT } ),
      {
        toggleSwitchOptions: { size: new Dimension2( 60, 30 ) },
        centerX: discreteSlider.centerX,
        top: discreteSlider.bottom + 30
      } );
    this.addChild( abSwitch );

    // add a looping sound that is turned on/off by the switch
    const chargesInBodySoundClip = new SoundClip( chargesInBodySound, { loop: true } );
    soundManager.addSoundGenerator( chargesInBodySoundClip, { associatedViewNode: abSwitch } );
    model.loopOnProperty.link( loopOn => {

      // start the loop the first time the switch is set to the on position
      if ( loopOn && !chargesInBodySoundClip.isPlaying ) {
        chargesInBodySoundClip.play();
      }
      else if ( !loopOn && chargesInBodySoundClip.isPlaying ) {
        chargesInBodySoundClip.stop();
      }
    } );

    // flag that indicates whether slider is being dragged through keyboard interaction
    let sliderBeingDraggedByKeyboard = false;

    // Add a slider with continuous behavior.  We create our own thumb node so that we can observe it.
    const continuousSlider = new HSlider( model.continuousValueProperty, new Range( 0, SLIDER_MAX ), {
      trackSize: SLIDER_TRACK_SIZE,
      thumbSize: SLIDER_THUMB_SIZE,
      thumbFill: '#880000',
      thumbFillHighlighted: '#aa0000',
      left: discreteSlider.left,
      top: abSwitch.bottom + 30,
      startDrag: event => {
        if ( event.type === 'keydown' ) {
          sliderBeingDraggedByKeyboard = true;
        }
      },
      endDrag: () => { sliderBeingDraggedByKeyboard = false; }
    } );
    this.addChild( continuousSlider );

    // Play a sound when certain threshold values are crossed by the continuous Property value, or when a change occurs
    // in the absence of interaction with the slider, since that implies keyboard-driven interaction.
    const marimbaSoundClip = new SoundClip( marimbaSound, { enableControlProperties: [ resetNotInProgressProperty ] } );
    soundManager.addSoundGenerator( marimbaSoundClip );

    // define a function that will play the marimba sound at a pitch value based on the continuous value Property
    function playSoundForContinuousValue() {
      const playbackRate = Math.pow( 2, model.continuousValueProperty.get() / SLIDER_MAX );
      marimbaSoundClip.setPlaybackRate( playbackRate );
      marimbaSoundClip.play();
    }

    model.continuousValueProperty.lazyLink( ( newValue, oldValue ) => {

      const mapValueToBin = value => Math.min(
        Math.floor( value / BIN_SIZE_FOR_CONTINUOUS_SLIDER ),
        NUM_BINS_FOR_CONTINUOUS_SLIDER - 1
      );

      // Play the sound when certain threshold values are crossed or when a change occurs in the absence of mouse/touch
      // interaction with the slider, which implies keyboard-driven interaction.
      if ( sliderBeingDraggedByKeyboard ||
           mapValueToBin( newValue ) !== mapValueToBin( oldValue ) ||
           newValue === 0 && oldValue !== 0 ||
           newValue === SLIDER_MAX && oldValue !== SLIDER_MAX ) {

        playSoundForContinuousValue();
      }
    } );

    // add the button that will cause a lightening bolt to be shown
    const fireLightningButton = new TextPushButton( 'Lightning', {
      font: FONT,
      listener: () => { model.lightningBoltVisibleProperty.value = true; }
    } );

    // disable button while lightning is visible
    model.lightningBoltVisibleProperty.link( lightningBoltVisible => {
      fireLightningButton.enabled = !lightningBoltVisible;
    } );

    // add a sound generator for thunder
    const thunderSoundClip = new SoundClip( thunderSound, {
      enableControlProperties: [ resetNotInProgressProperty ],
      initiateWhenDisabled: true
    } );
    soundManager.addSoundGenerator( thunderSoundClip );
    model.lightningBoltVisibleProperty.link( visible => {
      if ( visible ) {
        thunderSoundClip.play();
      }
    } );

    // a check box that controls whether the thunderSoundClip sound is locally enabled
    const thunderEnabledCheckbox = new Checkbox(
      new Text( 'Enabled', { font: FONT } ),
      thunderSoundClip.locallyEnabledProperty,
      { boxWidth: CHECKBOX_SIZE }
    );

    // a check box that controls whether the thunderSoundClip sound can be initiated when disabled
    const initiateThunderWhenDisabledProperty = new BooleanProperty( thunderSoundClip.initiateWhenDisabled );
    initiateThunderWhenDisabledProperty.linkAttribute( thunderSoundClip, 'initiateWhenDisabled' );
    const initiateThunderWhenDisabledCheckbox = new Checkbox(
      new Text( 'Initiate when disabled', { font: FONT } ),
      initiateThunderWhenDisabledProperty,
      { boxWidth: CHECKBOX_SIZE }
    );

    // create a set of controls for the thunderSoundClip
    const thunderControl = new VBox( {
      children: [
        new Text( 'Thunder: ', { font: new PhetFont( 16 ) } ),
        thunderEnabledCheckbox,
        initiateThunderWhenDisabledCheckbox
      ],
      align: 'left',
      spacing: 8
    } );

    // add a panel where thunderSoundClip and lightning are controlled
    const lightningControlPanel = new Panel(
      new HBox( { children: [ fireLightningButton, thunderControl ], spacing: 14, align: 'top' } ),
      {
        xMargin: 10,
        yMargin: 8,
        fill: '#FCFBE3',
        left: continuousSlider.left,
        top: continuousSlider.bottom + 30
      }
    );

    // add the lightning bolt that will appear when commanded by the user (and make him/her feel like Zeus)
    const lightningBoltNode = new Image( lightningImage, {
      left: lightningControlPanel.left + 25,
      top: lightningControlPanel.bottom - 3,
      maxHeight: 50
    } );

    // add in order for desired layering
    this.addChild( lightningBoltNode );
    this.addChild( lightningControlPanel );

    // only show the lightning when the model indicates - this is done after the panel is created so the layout works
    model.lightningBoltVisibleProperty.linkAttribute( lightningBoltNode, 'visible' );

    // add a push button that will play the standard button sound
    const playSoundButton = new TextPushButton( 'Play Standard Button Sound', {
      font: new PhetFont( 16 ),
      baseColor: 'lightgreen',
      left: lightningControlPanel.right + 60,
      top: discreteSlider.top
    } );
    this.addChild( playSoundButton );

    // create a small group of radio buttons
    const smallerRadioButtonSelectorValueProperty = new NumberProperty( 0 );
    const smallerRadioButtonGroupButtons = [];
    _.times( 2, index => {
      smallerRadioButtonGroupButtons.push( new AquaRadioButton(
        smallerRadioButtonSelectorValueProperty,
        index,
        new Text( String.fromCharCode( 65 + index ), { font: RADIO_BUTTON_FONT } ),
        {
          radius: RADIO_BUTTON_RADIUS,
          soundPlayer: radioButtonSoundPlayerFactory.getRadioButtonSoundPlayer( index )
        }
      ) );
    } );

    const smallerRadioButtonBox = new VBox( {
      children: smallerRadioButtonGroupButtons,
      align: 'left',
      spacing: 10
    } );

    // create a larger group of radio buttons
    const largerRadioButtonSelectorValueProperty = new NumberProperty( 0 );
    const largerRadioButtonGroupButtons = [];
    _.times( 7, index => {
      largerRadioButtonGroupButtons.push( new AquaRadioButton(
        largerRadioButtonSelectorValueProperty,
        index,
        new Text( String.fromCharCode( 65 + index ), { font: RADIO_BUTTON_FONT } ),
        {
          radius: RADIO_BUTTON_RADIUS,
          soundPlayer: radioButtonSoundPlayerFactory.getRadioButtonSoundPlayer( index )
        }
      ) );
    } );

    const largerRadioButtonBox = new VBox( {
      children: largerRadioButtonGroupButtons,
      align: 'left',
      spacing: 10
    } );

    // create a panel with the radio button sets
    const radioButtonSoundPanel = new Panel(
      new VBox(
        {
          children: [
            new Text( 'Radio Buttons', { font: new PhetFont( 14 ) } ),
            new HBox(
              {
                children: [
                  smallerRadioButtonBox,
                  largerRadioButtonBox
                ],
                spacing: 50
              }
            )
          ],
          spacing: 20
        }
      ),
      {
        fill: '#FCFBE3',
        left: playSoundButton.left,
        top: playSoundButton.bottom + 30
      }
    );
    this.addChild( radioButtonSoundPanel );

    //-----------------------------------------------------------------------------------------------------------------
    // play/pause sounds
    //-----------------------------------------------------------------------------------------------------------------

    // create the sounds for play/pause/step
    const playSoundClips = [];
    playSounds.forEach( sound => {
      const playPauseSoundClip = new SoundClip( sound );
      soundManager.addSoundGenerator( playPauseSoundClip );
      playSoundClips.push( playPauseSoundClip );
    } );
    const pauseSoundClips = [];
    pauseSounds.forEach( sound => {
      const pausePauseSoundClip = new SoundClip( sound );
      soundManager.addSoundGenerator( pausePauseSoundClip );
      pauseSoundClips.push( pausePauseSoundClip );
    } );
    const stepForwardSoundClips = [];
    stepForwardSounds.forEach( sound => {
      const stepForwardSoundClip = new SoundClip( sound );
      soundManager.addSoundGenerator( stepForwardSoundClip );
      stepForwardSoundClips.push( stepForwardSoundClip );
    } );
    const stepBackwardSoundClips = [];
    stepBackwardSounds.forEach( sound => {
      const stepBackwardSoundClip = new SoundClip( sound );
      soundManager.addSoundGenerator( stepBackwardSoundClip );
      stepBackwardSoundClips.push( stepBackwardSoundClip );
    } );

    // create a number picker for choosing the button sound
    const selectedPlayPauseSoundProperty = new NumberProperty( 1 );
    const playPauseSoundNumberPicker = new NumberPicker(
      selectedPlayPauseSoundProperty,
      new Property( new Range( 1, playSoundClips.length ) ),
      {
        font: new PhetFont( 20 ),
        arrowHeight: 6,
        arrowYSpacing: 6
      }
    );

    const playingProperty = new BooleanProperty( true );
    const playPauseButton = new PlayPauseButton( playingProperty, { radius: 25 } );
    const stepBackwardButton = new StepBackwardButton( {
      listener: () => {
        stepBackwardSoundClips[ selectedPlayPauseSoundProperty.value - 1 ].play();
      },
      isPlayingProperty: playingProperty,
      radius: 15
    } );
    const stepForwardButton = new StepForwardButton( {
      listener: () => {
        stepForwardSoundClips[ selectedPlayPauseSoundProperty.value - 1 ].play();
      },
      isPlayingProperty: playingProperty,
      radius: 15
    } );

    // play the play-pause sound when the playing state changes
    playingProperty.lazyLink( playing => {
      if ( playing ) {
        playSoundClips[ selectedPlayPauseSoundProperty.value - 1 ].play();
      }
      else {
        pauseSoundClips[ selectedPlayPauseSoundProperty.value - 1 ].play();
      }
    } );

    // create a text indicator of the current play/pause state (makes it easier to understand what's going on)
    const playPauseStateIndicator = new Text( '', { font: new PhetFont( 18 ) } );
    playingProperty.link( playing => { playPauseStateIndicator.text = playing ? 'playing' : 'paused'; } );

    const playPauseSoundPanel = new Panel(
      new VBox( {
        children: [
          new HBox( {
            children: [
              stepBackwardButton,
              playPauseButton,
              stepForwardButton,
              playPauseSoundNumberPicker
            ],
            spacing: 20
          } ),
          playPauseStateIndicator
        ],
        spacing: 10,
        align: 'left'
      } ),
      {
        fill: '#FCFBE3',
        left: radioButtonSoundPanel.left,
        top: radioButtonSoundPanel.bottom + 30
      }
    );
    this.addChild( playPauseSoundPanel );

    //-----------------------------------------------------------------------------------------------------------------
    // grab/release sounds
    //-----------------------------------------------------------------------------------------------------------------

    const grabbableNodePanel = new PanelWithGrabbableItem( {
      left: radioButtonSoundPanel.right + 30,
      top: radioButtonSoundPanel.top
    } );
    this.addChild( grabbableNodePanel );

    // add the reset all button
    const resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.maxX - 25,
      bottom: this.layoutBounds.maxY - 25,
      listener: () => {
        model.reset();
        thunderSoundClip.locallyEnabledProperty.reset();
        selectedPlayPauseSoundProperty.reset();
        smallerRadioButtonSelectorValueProperty.reset();
        largerRadioButtonSelectorValueProperty.reset();
        grabbableNodePanel.reset();
      }
    } );

    //---------------------------------------------------------------------------------------------------------------
    // combo box and sounds
    //---------------------------------------------------------------------------------------------------------------

    // create the selection items for the range selection combo box
    const comboBoxItems = [];
    const items = [ 'this', 'that', 'the other' ];
    const selectedItemProperty = new Property( items[ 0 ] );
    items.forEach( label => {
      comboBoxItems.push(
        new ComboBoxItem( new Text( label, { font: new PhetFont( 16 ) } ), label )
      );
    } );

    // combo box for selecting the range
    const comboBox = new ComboBox(
      comboBoxItems,
      selectedItemProperty,
      this,
      {
        xMargin: 13,
        yMargin: 6,
        cornerRadius: 4,
        right: grabbableNodePanel.right,
        top: grabbableNodePanel.bottom + 10
      }
    );
    this.addChild( comboBox );

    // reset all button
    this.addChild( resetAllButton );
  }
}

// inner class for testing grab and release sounds
class PanelWithGrabbableItem extends Node {

  constructor( options ) {
    super();

    const width = 200;
    const height = 120;
    const squareLength = 20;

    // background
    const background = new Rectangle( 0, 0, width, height, 5, 5, {
      fill: 'white',
      stroke: 'black'
    } );

    // caption
    const caption = new Text( 'Grab/Release Sound Test', {
      font: new PhetFont( 12 ),
      centerX: width / 2,
      top: 5
    } );
    this.addChild( background );

    // this class assumes that grab and release sounds come as a set, so make sure we have an equal number of them
    assert && assert(
      grabSounds.length === releaseSounds.length,
      'there are an unequal number of grab and release sounds'
    );

    // sound clips for grab and release
    const grabSoundClips = [];
    grabSounds.forEach( sound => {
      const soundClip = new SoundClip( sound );
      soundManager.addSoundGenerator( soundClip );
      grabSoundClips.push( soundClip );
    } );
    const releaseSoundClips = [];
    releaseSounds.forEach( sound => {
      const soundClip = new SoundClip( sound );
      soundManager.addSoundGenerator( soundClip );
      releaseSoundClips.push( soundClip );
    } );
    const edgeBoundarySoundClip = new SoundClip( edgeBoundarySound );
    soundManager.addSoundGenerator( edgeBoundarySoundClip );

    // @private
    this.grabAndReleaseSoundIndexProperty = new NumberProperty( 1 );

    // number picker for choosing the grab and release sound set
    const grabAndReleaseSoundNumberPicker = new NumberPicker(
      this.grabAndReleaseSoundIndexProperty,
      new Property( new Range( 1, grabSoundClips.length ) ),
      {
        font: new PhetFont( 20 ),
        arrowHeight: 6,
        arrowYSpacing: 6
      }
    );

    // add the caption and number picker as a unit
    this.addChild( new HBox( {
      children: [ caption, grabAndReleaseSoundNumberPicker ],
      spacing: 15,
      centerX: width / 2,
      top: 3
    } ) );

    // @private {Node} - the draggable node
    this.draggableNode = new Rectangle( -squareLength / 2, -squareLength / 2, squareLength, squareLength, {
      fill: 'orange',
      stroke: 'black',
      centerX: width / 2,
      centerY: height * 0.67,
      cursor: 'pointer'
    } );
    this.addChild( this.draggableNode );

    // @private
    this.draggableNodeInitialPosition = this.draggableNode.center.copy();

    // add the drag handler, which will move the node and play the sounds
    const boundsDilation = -squareLength / 2 - 4;
    const dragBounds = background.bounds.dilated( boundsDilation );
    let previousDraggableNodeCenter = this.draggableNode.center.copy;
    this.draggableNode.addInputListener( new DragListener( {
      dragBoundsProperty: new Property( dragBounds ),
      translateNode: true,
      start: () => { grabSoundClips[ this.grabAndReleaseSoundIndexProperty.value - 1 ].play(); },
      drag: () => {
        const currentPosition = this.draggableNode.center;
        let boundaryHit = false;
        if ( previousDraggableNodeCenter.x > dragBounds.minX && currentPosition.x === dragBounds.minX ) {
          boundaryHit = true;
        }
        else if ( previousDraggableNodeCenter.x < dragBounds.maxX && currentPosition.x === dragBounds.maxX ) {
          boundaryHit = true;
        }
        if ( previousDraggableNodeCenter.y > dragBounds.minY && currentPosition.y === dragBounds.minY ) {
          boundaryHit = true;
        }
        else if ( previousDraggableNodeCenter.y < dragBounds.maxY && currentPosition.y === dragBounds.maxY ) {
          boundaryHit = true;
        }
        if ( boundaryHit ) {
          edgeBoundarySoundClip.play();
        }
        previousDraggableNodeCenter = this.draggableNode.center;
      },
      end: () => { releaseSoundClips[ this.grabAndReleaseSoundIndexProperty.value - 1 ].play(); }
    } ) );

    this.mutate( options );
  }

  reset() {
    this.grabAndReleaseSoundIndexProperty.reset();
    this.draggableNode.center = this.draggableNodeInitialPosition;
  }
}

tambo.register( 'UIComponentsScreenView', UIComponentsScreenView );

export default UIComponentsScreenView;