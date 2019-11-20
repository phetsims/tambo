// Copyright 2018-2019, University of Colorado Boulder

/**
 * view for a screen that allows user to set global sonification settings
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RemoveAndDisposeCommonUIComponentsTestPanel = require( 'TAMBO/demo/testing/view/RemoveAndDisposeCommonUIComponentsTestPanel' );
  const RemoveAndDisposeSoundGeneratorsTestPanel = require( 'TAMBO/demo/testing/view/RemoveAndDisposeSoundGeneratorsTestPanel' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const SoundEncodingComparisonPanel = require( 'TAMBO/demo/testing/view/SoundEncodingComparisonPanel' );
  const SoundLevelEnum = require( 'TAMBO/SoundLevelEnum' );
  const soundManager = require( 'TAMBO/soundManager' );
  const tambo = require( 'TAMBO/tambo' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // constants
  const PANEL_SPACING = 15;

  // sounds
  const loonCallSound = require( 'sound!TAMBO/loon-call.mp3' );
  const rhodesChordSound = require( 'sound!TAMBO/rhodes-chord.mp3' );

  class TestingScreenView extends ScreenView {

    /**
     * @constructor
     */
    constructor() {

      super();

      // create two one-shot sounds, one for basic mode and one for enhanced
      const loonCallSoundClip = new SoundClip( loonCallSound );
      soundManager.addSoundGenerator( loonCallSoundClip );
      const rhodesChordSoundClip = new SoundClip( rhodesChordSound );
      soundManager.addSoundGenerator( rhodesChordSoundClip, { sonificationLevel: SoundLevelEnum.ENHANCED } );

      // add a button to play a basic-mode sound
      const playBasicSoundButton = new TextPushButton( 'Play Basic-Level Sound', {
        font: new PhetFont( 16 ),
        listener: () => { loonCallSoundClip.play(); },
        baseColor: '#aad6cc',
        left: this.layoutBounds.left + 26,
        top: this.layoutBounds.top + PANEL_SPACING
      } );
      this.addChild( playBasicSoundButton );

      // add button to play enhanced-mode sound
      const playEnhancedSoundButton = new TextPushButton( 'Play Enhanced-Level Sound', {
        font: new PhetFont( 16 ),
        listener: () => { rhodesChordSoundClip.play(); },
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
      const removeAndDisposeSoundGeneratorsTestPanel = new RemoveAndDisposeSoundGeneratorsTestPanel( {
        left: soundComparisonPanel.left,
        top: soundComparisonPanel.bottom + PANEL_SPACING
      } );
      this.addChild( removeAndDisposeSoundGeneratorsTestPanel );

      // add a panel with controls that allow testing of add, remove, and dispose of sound generating common UI components
      this.addChild( new RemoveAndDisposeCommonUIComponentsTestPanel( {
        left: soundComparisonPanel.left,
        top: removeAndDisposeSoundGeneratorsTestPanel.bottom + PANEL_SPACING,
        comboBoxListParent: this
      } ) );
    }

  }

  tambo.register( 'TestingScreenView', TestingScreenView );

  return TestingScreenView;
} );