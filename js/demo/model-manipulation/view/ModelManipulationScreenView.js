// Copyright 2018, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HSlider = require( 'SUN/HSlider' );
  var Range = require( 'DOT/Range' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SonificationManager = require( 'TAMBO/SonificationManager' );
  var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var tambo = require( 'TAMBO/tambo' );

  // constants
  var SLIDER_MAX = 5;
  var NUM_TICK_MARKS = SLIDER_MAX + 1;

  /**
   * @constructor
   */
  function ModelManipulationScreenView( model ) {
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
      }
    } );
    _.times( NUM_TICK_MARKS, function( index ) {
      discreteSlider.addMinorTick( index  );
    } );
    this.addChild( discreteSlider );

    // add a sound generator that will play a sound when the value controlled by the slider changes
    var increaseClickSound = new SoundClip( './audio/slider-click-01.mp3', {
      audioContext: sonificationManager.audioContext
    } );
    sonificationManager.addSoundGenerator( increaseClickSound, 0 );
    var decreaseClickSound = new SoundClip( './audio/slider-click-02.mp3', {
      audioContext: sonificationManager.audioContext
    } );
    sonificationManager.addSoundGenerator( decreaseClickSound, 0 );
    model.discreteValueProperty.lazyLink( function( newValue, oldValue ) {
      if ( newValue > oldValue ) {
        increaseClickSound.play();
      }
      else {
        decreaseClickSound.play();
      }
    } );
  }

  tambo.register( 'ModelManipulationScreenView', ModelManipulationScreenView );

  return inherit( ScreenView, ModelManipulationScreenView );
} );