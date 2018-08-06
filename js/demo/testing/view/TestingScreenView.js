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
  var RemoveAndDisposeTestPanel = require( 'TAMBO/demo/testing/view/RemoveAndDisposeTestPanel' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var soundManager = require( 'TAMBO/soundManager' );
  var tambo = require( 'TAMBO/tambo' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // audio
  var loonCall = require( 'audio!TAMBO/loon-call.mp3' );
  var rhodesChord = require( 'audio!TAMBO/rhodes-chord.mp3' );

  // The following code segment is for testing the size of audio files in built versions of a simulation.  To use,
  // uncomment to desired line and perform a build, and compare the size to other configurations.

  // var encodingTestAudio = require( 'audio!TAMBO/loon-call.mp3' );
  var encodingTestAudio = null;

  /**
   * @constructor
   */
  function TestingScreenView() {

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    // create two one-shot sounds, one for basic mode and one for enhanced
    var basicModeOneShotSound = new OneShotSoundClip( loonCall );
    soundManager.addSoundGenerator( basicModeOneShotSound );
    var enhancedModeOneShotSound = new OneShotSoundClip( rhodesChord );
    soundManager.addSoundGenerator( enhancedModeOneShotSound, { sonificationLevel: 'enhanced' } );

    // add a button to play a basic-mode sound
    var playBasicSoundButton = new TextPushButton( 'Play Basic-Level Sound', {
      listener: function() { basicModeOneShotSound.play(); },
      baseColor: '#aad6cc',
      left: this.layoutBounds.left + 20,
      top: this.layoutBounds.height * 0.33
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

    // create two one-shot sounds, one for basic mode and one for enhanced
    var encodingTestSound = null;
    if ( encodingTestAudio ) {
      encodingTestSound = new OneShotSoundClip( encodingTestAudio );
      soundManager.addSoundGenerator( encodingTestSound );
    }

    // add a button to play the sound used to test sizes of sounds
    this.addChild( new TextPushButton( 'Play Encoding Test Sound', {
      listener: function() {
        if ( encodingTestSound ) {
          encodingTestSound.play();
        }
        else {
          console.log( 'no encoding test sound loading, no sound will be played' );
        }
      },
      baseColor: '#ffe4e1',
      left: playEnhancedSoundButton.left,
      top: playEnhancedSoundButton.bottom + 10
    } ) );

    // add a panel with controls that allow testing of add, remove, and dispose of sound generator
    this.addChild( new RemoveAndDisposeTestPanel( {
      left: playBasicSoundButton.right + 50,
      top: playBasicSoundButton.top
    } ) );
  }

  tambo.register( 'TestingScreenView', TestingScreenView );

  return inherit( ScreenView, TestingScreenView );
} );