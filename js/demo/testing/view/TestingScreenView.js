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
  var RemoveAndDisposeTestPanel = require( 'TAMBO/demo/testing/view/RemoveAndDisposeTestPanel' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var SoundEncodingComparisonPanel = require( 'TAMBO/demo/testing/view/SoundEncodingComparisonPanel' );
  var soundManager = require( 'TAMBO/soundManager' );
  var tambo = require( 'TAMBO/tambo' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // audio
  var loonCall = require( 'audio!TAMBO/loon-call.mp3' );
  var rhodesChord = require( 'audio!TAMBO/rhodes-chord.mp3' );

  /**
   * @constructor
   */
  function TestingScreenView() {

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    // create two one-shot sounds, one for basic mode and one for enhanced
    var basicModeOneShotSound = new SoundClip( loonCall );
    soundManager.addSoundGenerator( basicModeOneShotSound );
    var enhancedModeOneShotSound = new SoundClip( rhodesChord );
    soundManager.addSoundGenerator( enhancedModeOneShotSound, { sonificationLevel: 'enhanced' } );

    // add a button to play a basic-mode sound
    var playBasicSoundButton = new TextPushButton( 'Play Basic-Level Sound', {
      listener: function() { basicModeOneShotSound.play(); },
      baseColor: '#aad6cc',
      left: this.layoutBounds.left + 20,
      top: this.layoutBounds.top + 20
    } );
    this.addChild( playBasicSoundButton );

    // add button to play enhanced-mode sound
    var playEnhancedSoundButton = new TextPushButton( 'Play Enhanced-Level Sound', {
      listener: function() { enhancedModeOneShotSound.play(); },
      baseColor: '#DBB1CD',
      left: playBasicSoundButton.left,
      top: playBasicSoundButton.bottom + 10
    } );
    this.addChild( playEnhancedSoundButton );

    // add a panel that will allow the user to compare sounds with different encodings
    var soundComparisonPanel = new SoundEncodingComparisonPanel( this, {
      left: playBasicSoundButton.right + 50,
      top: playBasicSoundButton.top
    } );
    this.addChild( soundComparisonPanel );

    // add a panel with controls that allow testing of add, remove, and dispose of sound generator
    this.addChild( new RemoveAndDisposeTestPanel( {
      left: soundComparisonPanel.left,
      top: soundComparisonPanel.bottom + 20
    } ) );

    alert( soundManager.getReverbLevel() );
  }

  tambo.register( 'TestingScreenView', TestingScreenView );

  return inherit( ScreenView, TestingScreenView );
} );