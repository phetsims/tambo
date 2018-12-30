// Copyright 2018, University of Colorado Boulder

/**
 * view for a screen that allows user to set global sonification settings
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RemoveAndDisposeTestPanel = require( 'TAMBO/demo/testing/view/RemoveAndDisposeTestPanel' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const SoundEncodingComparisonPanel = require( 'TAMBO/demo/testing/view/SoundEncodingComparisonPanel' );
  const SoundLevelEnum = require( 'TAMBO/SoundLevelEnum' );
  const soundManager = require( 'TAMBO/soundManager' );
  const tambo = require( 'TAMBO/tambo' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // sounds
  const loonCallSound = require( 'sound!TAMBO/loon-call.mp3' );
  const rhodesChordSound = require( 'sound!TAMBO/rhodes-chord.mp3' );

  /**
   * @constructor
   */
  function TestingScreenView() {

    ScreenView.call( this );

    // create two one-shot sounds, one for basic mode and one for enhanced
    const loonCallSoundClip = new SoundClip( loonCallSound );
    soundManager.addSoundGenerator( loonCallSoundClip );
    const rhodesChordSoundClip = new SoundClip( rhodesChordSound );
    soundManager.addSoundGenerator( rhodesChordSoundClip, { sonificationLevel: SoundLevelEnum.ENHANCED } );

    // add a button to play a basic-mode sound
    const playBasicSoundButton = new TextPushButton( 'Play Basic-Level Sound', {
      font: new PhetFont( 16 ),
      listener: function() { loonCallSoundClip.play(); },
      baseColor: '#aad6cc',
      left: this.layoutBounds.left + 26,
      top: this.layoutBounds.top + 26
    } );
    this.addChild( playBasicSoundButton );

    // add button to play enhanced-mode sound
    const playEnhancedSoundButton = new TextPushButton( 'Play Enhanced-Level Sound', {
      font: new PhetFont( 16 ),
      listener: function() { rhodesChordSoundClip.play(); },
      baseColor: '#DBB1CD',
      left: playBasicSoundButton.left,
      top: playBasicSoundButton.bottom + 14
    } );
    this.addChild( playEnhancedSoundButton );

    // add a panel that will allow the user to compare sounds with different encodings
    const soundComparisonPanel = new SoundEncodingComparisonPanel( this, {
      left: playBasicSoundButton.right + 65,
      top: playBasicSoundButton.top
    } );
    this.addChild( soundComparisonPanel );

    // add a panel with controls that allow testing of add, remove, and dispose of sound generator
    this.addChild( new RemoveAndDisposeTestPanel( {
      left: soundComparisonPanel.left,
      top: soundComparisonPanel.bottom + 28
    } ) );
  }

  tambo.register( 'TestingScreenView', TestingScreenView );

  return inherit( ScreenView, TestingScreenView );
} );