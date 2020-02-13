// Copyright 2019-2020, University of Colorado Boulder

/**
 * Generates sounds for when the user switches between screens and screen icons
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const MultiClip = require( 'TAMBO/sound-generators/MultiClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const homeSelectedSound = require( 'sound!TAMBO/screen-selection-home-v3.mp3' );
  const iconSelectedSound = require( 'sound!TAMBO/switching-screen-selector-icons-003.mp3' );
  const screenSelectedSound = require( 'sound!TAMBO/screen-selection.mp3' );

  // constants
  const SoundType = Enumeration.byKeys( [ 'ICON_SELECTED', 'HOME_SCREEN', 'OTHER_SCREEN' ] );

  class ScreenSelectionSoundGenerator extends MultiClip {

    /**
     * @param {Property.<Screen>} screenProperty - indicates which sim screen is visible
     * @param {HomeScreen|null} homeScreen - null if the HomeScreen was not created
     * @param {Object} [options]
     */
    constructor( screenProperty, homeScreen, options ) {

      // create the map of screen index values to sounds
      const valuesToSoundInfoMap = new Map();

      // can't use initialization constructor since it's not supported in IE
      valuesToSoundInfoMap.set( SoundType.ICON_SELECTED, iconSelectedSound );
      valuesToSoundInfoMap.set( SoundType.HOME_SCREEN, homeSelectedSound );
      valuesToSoundInfoMap.set( SoundType.OTHER_SCREEN, screenSelectedSound );

      super( valuesToSoundInfoMap, options );

      // play the sound when the user selects a different icon on the home screen
      homeScreen && homeScreen.model.selectedScreenProperty.lazyLink( () => {

        // only play this sound when on the home screen
        if ( screenProperty.value === homeScreen ) {
          this.playAssociatedSound( SoundType.ICON_SELECTED );
        }
      } );

      // play sounds when the user navigates between screens and to/from the home screen
      screenProperty.lazyLink( currentScreen => {

        // play one sound for the home screen, another for all other screens
        this.playAssociatedSound( homeScreen && currentScreen === homeScreen ? SoundType.HOME_SCREEN : SoundType.OTHER_SCREEN );
      } );
    }
  }

  return tambo.register( 'ScreenSelectionSoundGenerator', ScreenSelectionSoundGenerator );
} );