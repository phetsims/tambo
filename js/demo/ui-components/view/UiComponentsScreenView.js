// Copyright 2018, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ABSwitch = require( 'SUN/ABSwitch' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Checkbox = require( 'SUN/Checkbox' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  var LoopingSoundClip = require( 'TAMBO/sound-generators/LoopingSoundClip' );
  var OneShotSoundClip = require( 'TAMBO/sound-generators/OneShotSoundClip' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ResetAllSound = require( 'TAMBO/demo/common/audio/ResetAllSound' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var soundManager = require( 'TAMBO/soundManager' );
  var tambo = require( 'TAMBO/tambo' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var SLIDER_MAX = 5;
  var NUM_TICK_MARKS = SLIDER_MAX + 1;
  var CHECK_BOX_SIZE = 12;

  // images
  var lightningImage = require( 'image!TAMBO/lightning.png' );

  // audio
  var chargesInBody = require( 'audio!TAMBO/charges-in-body-better.mp3' );
  var marimbaSound = require( 'audio!TAMBO/bright-marimba.mp3' );
  var sliderIncreaseClickSound = require( 'audio!TAMBO/slider-click-01.mp3' );
  var sliderDecreaseClickSound = require( 'audio!TAMBO/slider-click-02.mp3' );
  var thunderSound = require( 'audio!TAMBO/thunder.mp3' );

  /**
   * @constructor
   */
  function UiComponentsScreenView( model ) {
    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    // add a slider with snap-to-ticks behavior
    var discreteSlider = new HSlider( model.discreteValueProperty, new Range( 0, SLIDER_MAX ), {
      left: 100,
      top: 100,
      constrainValue: function( value ) {
        return Math.round( value );
      },
      keyboardStep: 1
    } );
    _.times( NUM_TICK_MARKS, function( index ) {
      discreteSlider.addMinorTick( index );
    } );
    this.addChild( discreteSlider );

    // create an inverted version of the reset-in-progress property, used to mute sounds during reset
    var resetNotInProgressProperty = new DerivedProperty(
      [ model.resetInProgressProperty ],
      function( resetInProgress ) {
        return !resetInProgress;
      }
    );

    // add a sound generator that will play a sound when the value controlled by the slider changes
    var increaseClickSound = new OneShotSoundClip( sliderIncreaseClickSound );
    soundManager.addSoundGenerator( increaseClickSound );
    var decreaseClickSound = new OneShotSoundClip( sliderDecreaseClickSound, {
      initialEnableControlProperties: [ resetNotInProgressProperty ]
    } );
    soundManager.addSoundGenerator( decreaseClickSound );
    model.discreteValueProperty.lazyLink( function( newValue, oldValue ) {
      if ( newValue > oldValue ) {
        increaseClickSound.play();
      }
      else {
        decreaseClickSound.play();
      }
    } );

    // add an AB switch that will turn on/off a looping sound
    var abSwitch = new ABSwitch(
      model.loopOnProperty,
      false,
      new Text( 'Off' ),
      true,
      new Text( 'On' ),
      { switchSize: new Dimension2( 40, 20 ), centerX: discreteSlider.centerX, top: discreteSlider.bottom + 40 }
    );
    this.addChild( abSwitch );

    // add a looping sound that is turned on/off by the switch
    var loopingSound = new LoopingSoundClip( chargesInBody );
    soundManager.addSoundGenerator( loopingSound, { associatedViewNode: abSwitch } );
    model.loopOnProperty.link( function( loopOn ) {

      // start the loop the first time the switch is set to the on position
      if ( loopOn && !loopingSound.isPlaying ) {
        loopingSound.start();
      }
      else if ( !loopOn && loopingSound.isPlaying ) {
        loopingSound.stop();
      }
    } );

    // Add a slider with continuous behavior.  We create our own thumb node so that we can observe it.
    var continuousSlider = new HSlider( model.continuousValueProperty, new Range( 0, SLIDER_MAX ), {
      thumbFillEnabled: '#880000',
      thumbFillHighlighted: '#aa0000',
      left: discreteSlider.left,
      top: abSwitch.bottom + 40
    } );
    this.addChild( continuousSlider );

    // Play a sound when certain threshold values are crossed by the continuous property value, or when a change occurs
    // in the absence of interaction with the slider, since that implies keyboard-driven interaction.
    var marimbaSoundGenerator = new OneShotSoundClip( marimbaSound );
    soundManager.addSoundGenerator( marimbaSoundGenerator );

    // define a function that will play the marimba sound at a pitch value based on the continuous value property
    function playSoundForContinuousValue() {
      var playbackRate = Math.pow( 2, model.continuousValueProperty.get() / SLIDER_MAX );
      marimbaSoundGenerator.setPlaybackRate( playbackRate );
      marimbaSoundGenerator.play();
    }

    // add sound generation for changes that occur due to keyboard interaction
    continuousSlider.addAccessibleInputListener( {
      keydown: function( event ) {
        if ( KeyboardUtil.isRangeKey( event.keyCode ) ) {
          playSoundForContinuousValue();
        }
      }
    } );

    model.continuousValueProperty.lazyLink( function( newValue, oldValue ) {

      // TODO: Parts of the following code may eventually be moved to constants, but it is here for now to make it
      // easier to grab this chunk of code and turn it into a standalone sound generator, which is the most likely
      // scenario at the time of this writing.
      var numBins = 8;
      var binSize = SLIDER_MAX / numBins;

      function mapValueToBin( value ) {
        return Math.min( Math.floor( value / binSize ), numBins - 1 );
      }

      // Play the sound when certain threshold values are crossed or when a change occurs in the absence of mouse/touch
      // interaction with the slider, which implies keyboard-driven interaction.
      if ( continuousSlider.thumbDragging && (
        mapValueToBin( newValue ) !== mapValueToBin( oldValue ) ||
        newValue === 0 && oldValue !== 0 ||
        newValue === SLIDER_MAX && oldValue !== SLIDER_MAX ) ) {

        playSoundForContinuousValue();
      }
    } );

    // add the button that will cause a lightening bolt to be shown
    var fireLightningButton = new TextPushButton( 'Lightning', {
      listener: function() {
        model.lightningBoltVisibleProperty.set( true );
      }
    } );

    // disable button while lightning is visible
    model.lightningBoltVisibleProperty.link( function( lightningBoltVisible ) {
      fireLightningButton.enabled = !lightningBoltVisible;
    } );

    // add a sound generator for thunderSoundGenerator
    var thunderSoundGenerator = new OneShotSoundClip( thunderSound, {
      initialEnableControlProperties: [ resetNotInProgressProperty ],
      initiateWhenDisabled: true
    } );
    soundManager.addSoundGenerator( thunderSoundGenerator );
    model.lightningBoltVisibleProperty.link( function( visible ) {
      if ( visible ) {
        thunderSoundGenerator.play();
      }
    } );

    // a check box that controls whether the thunderSoundGenerator sound is locally enabled
    var thunderEnabledCheckbox = new Checkbox(
      new Text( 'Enabled' ),
      thunderSoundGenerator.locallyEnabledProperty,
      { boxWidth: CHECK_BOX_SIZE }
    );

    // a check box that controls whether the thunderSoundGenerator sound can be initiated when disabled
    var initiateThunderWhenDisabledProperty = new BooleanProperty( thunderSoundGenerator.initiateWhenDisabled );
    initiateThunderWhenDisabledProperty.linkAttribute( thunderSoundGenerator, 'initiateWhenDisabled' );
    var initiateThunderWhenDisabledCheckbox = new Checkbox(
      new Text( 'Initiate when disabled' ),
      initiateThunderWhenDisabledProperty,
      { boxWidth: CHECK_BOX_SIZE }
    );

    // create a set of controls for the thunderSoundGenerator
    var thunderControl = new VBox( {
      children: [
        new Text( 'Thunder: ', { font: new PhetFont( 12 ) } ),
        thunderEnabledCheckbox,
        initiateThunderWhenDisabledCheckbox
      ],
      align: 'left',
      spacing: 5
    } );

    // add a panel where thunderSoundGenerator and lightning are controlled
    var lightningControlPanel = new Panel(
      new HBox( { children: [ fireLightningButton, thunderControl ], spacing: 10, align: 'top' } ),
      {
        fill: '#FCFBE3',
        left: discreteSlider.right + 20,
        top: discreteSlider.top
      }
    );

    // add the lightning bolt that will appear when commanded by the user (and make him/her feel like Zeus)
    var lightningBoltNode = new Image( lightningImage, {
      left: lightningControlPanel.left + 20,
      top: lightningControlPanel.bottom - 3,
      maxHeight: 50
    } );

    // add in order for desired layering
    this.addChild( lightningBoltNode );
    this.addChild( lightningControlPanel );

    // only show the lightening when the model indicates - this is done after the panel is created so the layout works
    model.lightningBoltVisibleProperty.linkAttribute( lightningBoltNode, 'visible' );

    // add the reset all button
    var resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.maxX - 20,
      bottom: this.layoutBounds.maxY - 20,
      listener: function() {
        model.reset();
        thunderSoundGenerator.locallyEnabledProperty.reset();
      }
    } );
    this.addChild( resetAllButton );
    soundManager.addSoundGenerator( new ResetAllSound( model.resetInProgressProperty ) );
  }

  tambo.register( 'UiComponentsScreenView', UiComponentsScreenView );

  return inherit( ScreenView, UiComponentsScreenView );
} );