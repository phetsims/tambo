// Copyright 2018, University of Colorado Boulder

/**
 * view for a screen that allows user to set global sonification settings
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OneShotSoundClip = require( 'TAMBO/sound-generators/OneShotSoundClip' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var soundManager = require( 'TAMBO/soundManager' );
  var tambo = require( 'TAMBO/tambo' );
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

    // create two one-shot sounds, one for basic mode and one for enhanced
    var basicModeOneShotSound = new OneShotSoundClip( marimbaSound );
    soundManager.addSoundGenerator( basicModeOneShotSound );
    var enhancedModeOneShotSound = new OneShotSoundClip( clickSound );
    soundManager.addSoundGenerator( enhancedModeOneShotSound, { sonificationLevel: 'enhanced' } );

    // add a button to play a basic-mode sound
    var playBasicSoundButton = new TextPushButton( 'Play Basic-Level Sound', {
      listener: function() { basicModeOneShotSound.play(); },
      baseColor: '#aad6cc',
      left: this.layoutBounds.left + 20,
      top: this.layoutBounds.centerY
    } );
    this.addChild( playBasicSoundButton );

    // add button to play enhanced-mode sound
    this.addChild( new TextPushButton( 'Play Enhanced-Level Sound', {
      listener: function() { enhancedModeOneShotSound.play(); },
      baseColor: '#DBB1CD',
      left: playBasicSoundButton.left,
      top: playBasicSoundButton.bottom + 10
    } ) );
  }

  tambo.register( 'SonificationControlsScreenView', SonificationControlsScreenView );

  return inherit( ScreenView, SonificationControlsScreenView );
} );