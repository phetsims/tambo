// Copyright 2019, University of Colorado Boulder

/**
 * generates sounds for when the user switches between screens and screen icons
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const MultiClip = require( 'TAMBO/sound-generators/MultiClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const iconSelectedSound = require( 'sound!TAMBO/switching-screen-selector-icons-003.mp3' );
  const screenSelectedSound = require( 'sound!TAMBO/screen-selection.mp3' );
  const homeSelectedSound = require( 'sound!TAMBO/screen-selection-home-v3.mp3' );

  class ScreenSelectionSoundGenerator extends MultiClip {

    /**
     * @param {Property.<Screen|null>} currentScreenProperty - an axon Property that indicates which sim screen is
     * currently selected
     * @param {Property.<number>} iconIndexProperty - an axon Property that indicates which icon on the home screen is
     * currently selected
     * @param {Object} [options]
     */
    constructor( currentScreenProperty, iconIndexProperty, options ) {

      // create the map of screen index values to sounds
      const valuesToSoundInfoMap = new Map(); // can't use initialization constructor since it's not supported in IE
      valuesToSoundInfoMap.set( 0, iconSelectedSound );
      valuesToSoundInfoMap.set( 1, homeSelectedSound );
      valuesToSoundInfoMap.set( 2, screenSelectedSound );

      super( valuesToSoundInfoMap, options );

      // play the sound when the user selects a different icon on the home screen
      iconIndexProperty.lazyLink( () => {

        // only play this sound when on the home screen
        if ( currentScreenProperty.value === null ) {
          this.playAssociatedSound( 0 );
        }
      } );

      // play sounds when the user navigates between screens and to/from the home screen
      currentScreenProperty.lazyLink( currentScreen => {

        // play one sound for the home screen, another for all other screens
        this.playAssociatedSound( currentScreen === null ? 1 : 2 );
      } );
    }
  }

  return tambo.register( 'ScreenSelectionSoundGenerator', ScreenSelectionSoundGenerator );
} );