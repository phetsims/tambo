// Copyright 2018, University of Colorado Boulder

/**
 * view for a screen that allows user to set global sonification settings
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
  var OneShotSoundClip = require( 'TAMBO/sound-generators/OneShotSoundClip' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var soundManager = require( 'TAMBO/soundManager' );
  var tambo = require( 'TAMBO/tambo' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // audio
  var marimbaSound = require( 'audio!TAMBO/bright-marimba.mp3' );
  var clickSound = require( 'audio!TAMBO/slider-click-01.mp3' );

  /**
   * @constructor
   */
  function SonificationControlsScreenView() {

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    // add an AB switch that will select between 'basic' and 'enhanced' sonification
    var abSwitch = new ABSwitch(
      soundManager.enhancedSoundEnabledProperty,
      false,
      new Text( 'basic' ),
      true,
      new Text( 'enhanced' ),
      { switchSize: new Dimension2( 40, 20 ), left: 100, top: 200 }
    );
    this.addChild( abSwitch );

    // create two one-shot sounds, one for basic mode and one for enhanced
    var basicModeOneShotSound = new OneShotSoundClip( marimbaSound );
    soundManager.addSoundGenerator( basicModeOneShotSound );
    var enhancedModeOneShotSound = new OneShotSoundClip( clickSound );
    soundManager.addSoundGenerator( enhancedModeOneShotSound, { sonificationLevel: 'enhanced' } );

    // add a button to play a basic-mode sound
    this.addChild( new TextPushButton( 'Play Basic-Level Sound', {
      listener: function() { basicModeOneShotSound.play(); },
      baseColor: '#aad6cc',
      left: abSwitch.left,
      top: abSwitch.bottom + 10
    } ) );

    // add button to play enhanced-mode sound
    this.addChild( new TextPushButton( 'Play Enhanced-Level Sound', {
      listener: function() { enhancedModeOneShotSound.play(); },
      baseColor: '#DBB1CD',
      left: abSwitch.left,
      top: abSwitch.bottom + 40
    } ) );
  }

  tambo.register( 'SonificationControlsScreenView', SonificationControlsScreenView );

  return inherit( ScreenView, SonificationControlsScreenView );
} );