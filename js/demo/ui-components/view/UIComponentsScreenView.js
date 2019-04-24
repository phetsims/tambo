// Copyright 2018-2019, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HSlider = require( 'SUN/HSlider' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ResetAllSoundGenerator = require( 'TAMBO/sound-generators/ResetAllSoundGenerator' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const tambo = require( 'TAMBO/tambo' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const SLIDER_MAX = 5;
  const SLIDER_TRACK_SIZE = new Dimension2( 150, 5 );
  const SLIDER_THUMB_SIZE = new Dimension2( 22, 45 );
  const NUM_TICK_MARKS = SLIDER_MAX + 1;
  const CHECK_BOX_SIZE = 16;
  const FONT = new PhetFont( 16 );
  const NUM_BINS_FOR_CONTINUOUS_SLIDER = 8;
  const BIN_SIZE_FOR_CONTINUOUS_SLIDER = SLIDER_MAX / NUM_BINS_FOR_CONTINUOUS_SLIDER;

  // images
  const lightningImage = require( 'image!TAMBO/lightning.png' );

  // sounds
  const chargesInBodySound = require( 'sound!TAMBO/charges-in-body-better.mp3' );
  const marimbaSound = require( 'sound!TAMBO/bright-marimba.mp3' );
  const sliderDecreaseClickSound = require( 'sound!TAMBO/slider-click-02.mp3' );
  const sliderIncreaseClickSound = require( 'sound!TAMBO/slider-click-01.mp3' );
  const thunderSound = require( 'sound!TAMBO/thunder.mp3' );

  /**
   * @constructor
   */
  function UIComponentsScreenView( model ) {
    ScreenView.call( this );

    // add a slider with snap-to-ticks behavior
    const discreteSlider = new HSlider( model.discreteValueProperty, new Range( 0, SLIDER_MAX ), {
      trackSize: SLIDER_TRACK_SIZE,
      thumbSize: SLIDER_THUMB_SIZE,
      left: 115,
      top: 115,
      constrainValue: function( value ) {
        return Util.roundSymmetric( value );
      },
      keyboardStep: 1
    } );
    _.times( NUM_TICK_MARKS, function( index ) {
      discreteSlider.addMinorTick( index );
    } );
    this.addChild( discreteSlider );

    // create an inverted version of the reset-in-progress Property, used to mute sounds during reset
    const resetNotInProgressProperty = new DerivedProperty(
      [ model.resetInProgressProperty ],
      function( resetInProgress ) {
        return !resetInProgress;
      }
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
      { switchSize: new Dimension2( 60, 30 ), centerX: discreteSlider.centerX, top: discreteSlider.bottom + 50 }
    );
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
    var sliderBeingDraggedByKeyboard = false;

    // Add a slider with continuous behavior.  We create our own thumb node so that we can observe it.
    const continuousSlider = new HSlider( model.continuousValueProperty, new Range( 0, SLIDER_MAX ), {
      trackSize: SLIDER_TRACK_SIZE,
      thumbSize: SLIDER_THUMB_SIZE,
      thumbFill: '#880000',
      thumbFillHighlighted: '#aa0000',
      left: discreteSlider.left,
      top: abSwitch.bottom + 50,
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

      function mapValueToBin( value ) {
        return Math.min( Math.floor( value / BIN_SIZE_FOR_CONTINUOUS_SLIDER ), NUM_BINS_FOR_CONTINUOUS_SLIDER - 1 );
      }

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
      listener: function() {
        model.lightningBoltVisibleProperty.set( true );
      }
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
      { boxWidth: CHECK_BOX_SIZE }
    );

    // a check box that controls whether the thunderSoundClip sound can be initiated when disabled
    const initiateThunderWhenDisabledProperty = new BooleanProperty( thunderSoundClip.initiateWhenDisabled );
    initiateThunderWhenDisabledProperty.linkAttribute( thunderSoundClip, 'initiateWhenDisabled' );
    const initiateThunderWhenDisabledCheckbox = new Checkbox(
      new Text( 'Initiate when disabled', { font: FONT } ),
      initiateThunderWhenDisabledProperty,
      { boxWidth: CHECK_BOX_SIZE }
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
        left: discreteSlider.right + 25,
        top: discreteSlider.top
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

    // only show the lightening when the model indicates - this is done after the panel is created so the layout works
    model.lightningBoltVisibleProperty.linkAttribute( lightningBoltNode, 'visible' );

    // add the reset all button
    const resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.maxX - 25,
      bottom: this.layoutBounds.maxY - 25,
      listener: function() {
        model.reset();
        thunderSoundClip.locallyEnabledProperty.reset();
      }
    } );
    this.addChild( resetAllButton );
    soundManager.addSoundGenerator( new ResetAllSoundGenerator( model.resetInProgressProperty ) );
  }

  tambo.register( 'UIComponentsScreenView', UIComponentsScreenView );

  return inherit( ScreenView, UIComponentsScreenView );
} );