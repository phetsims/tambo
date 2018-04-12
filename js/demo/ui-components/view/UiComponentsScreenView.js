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
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HSlider = require( 'SUN/HSlider' );
  var Range = require( 'DOT/Range' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ResetAllSound = require( 'TAMBO/demo/common/audio/ResetAllSound' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SonificationManager = require( 'TAMBO/SonificationManager' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var tambo = require( 'TAMBO/tambo' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var SLIDER_MAX = 5;
  var NUM_TICK_MARKS = SLIDER_MAX + 1;

  /**
   * @constructor
   */
  function UiComponentsScreenView( model ) {
    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    var sonificationManager = SonificationManager.getInstance();

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

    // add a sound generator that will play a sound when the value controlled by the slider changes
    var increaseClickSound = new SoundClip( './audio/slider-click-01.mp3' );
    sonificationManager.addSoundGenerator( increaseClickSound );
    var decreaseClickSound = new SoundClip( './audio/slider-click-02.mp3' );
    sonificationManager.addSoundGenerator( decreaseClickSound );
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
    var loopingSound = new SoundClip( './audio/charges-in-body-better.mp3', {
      loop: true,
      associatedViewNode: abSwitch
    } );
    sonificationManager.addSoundGenerator( loopingSound );
    model.loopOnProperty.link( function( loopOn ) {

      // start the loop the first time the switch is set to the on position
      if ( loopOn && !loopingSound.isPlaying() ) {
        loopingSound.play();
      }
      else if ( !loopOn && loopingSound.isPlaying() ) {
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
    var marimbaSound = new SoundClip( './audio/bright-marimba.mp3' );
    sonificationManager.addSoundGenerator( marimbaSound );
    model.continuousValueProperty.lazyLink( function( newValue, oldValue ) {

      // calculate the playback rate of the sound based on the property value
      var playbackRate = Math.pow( 2, (newValue / SLIDER_MAX) * 3 ) / 3;

      var binSize = SLIDER_MAX / 10;
      if ( Math.floor( oldValue / binSize ) !== Math.floor( newValue / binSize ) || newValue === 0 && oldValue !== 0 ) {
        marimbaSound.setPlaybackSpeed( playbackRate );
        marimbaSound.play();
      }

    } );

    // add the reset all button
    var resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.maxX - 20,
      bottom: this.layoutBounds.maxY - 20,
      listener: function() {
        model.reset();
      }
    } );
    this.addChild( resetAllButton );
    sonificationManager.addSoundGenerator( new ResetAllSound( model.resetInProgressProperty ) );

    // add the sound toggle button
    var soundToggleButton = new SoundToggleButton( sonificationManager.enabledProperty, {
      right: resetAllButton.left - 10,
      centerY: resetAllButton.centerY
    } );
    this.addChild( soundToggleButton );
  }

  tambo.register( 'UiComponentsScreenView', UiComponentsScreenView );

  return inherit( ScreenView, UiComponentsScreenView );
} );