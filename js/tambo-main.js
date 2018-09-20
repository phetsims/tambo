// Copyright 2018, University of Colorado Boulder

/**
 * main file for the tambo library demo and test harness
 */
define( function( require ) {
  'use strict';

  // modules
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Property = require( 'AXON/Property' );
  const RadialGradient = require( 'SCENERY/util/RadialGradient' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Screen = require( 'JOIST/Screen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const SimLikeComponentsModel = require( 'TAMBO/demo/sim-like-components/model/SimLikeComponentsModel' );
  const SimLikeComponentsScreenView = require( 'TAMBO/demo/sim-like-components/view/SimLikeComponentsScreenView' );
  const TamboKeyboardHelpContent = require( 'TAMBO/demo/TamboKeyboardHelpContent' );
  const TestingScreenView = require( 'TAMBO/demo/testing/view/TestingScreenView' );
  const UIComponentsModel = require( 'TAMBO/demo/ui-components/model/UIComponentsModel' );
  const UIComponentsScreenView = require( 'TAMBO/demo/ui-components/view/UIComponentsScreenView' );

  // strings
  const tamboTitleString = require( 'string!TAMBO/tambo.title' );

  // set up the simulation options
  const keyboardHelpContent = new TamboKeyboardHelpContent();
  const simOptions = {
    accessibility: true,
    credits: {
      leadDesign: 'John Blanco'
    },
    keyboardHelpNode: keyboardHelpContent,
    supportsEnhancedSound: true,
    supportsSound: true
  };

  // helper function to create screen icons that aren't too bland
  function createScreenIcon( color1, color2, gradientType ) {

    let colorGradient;
    if ( gradientType === 'radial' ) {
      colorGradient = new RadialGradient(
        Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width / 2,
        Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height / 2,
        0,
        Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width / 2,
        Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height / 2,
        Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width * 0.67
      ).addColorStop( 0, color1 ).addColorStop( 1, color2 );
    }
    else {
      colorGradient = new LinearGradient( 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width, 0 )
        .addColorStop( 0, color1 )
        .addColorStop( 1, color2 );
    }

    return new Rectangle(
      0,
      0,
      Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width,
      Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height,
      { fill: colorGradient }
    );
  }

  SimLauncher.launch( function() {
    new Sim( tamboTitleString, [

      // sim-like components screen
      new Screen(
        function() { return new SimLikeComponentsModel(); },
        function( model ) { return new SimLikeComponentsScreenView( model ); },
        {
          name: 'Sim-Like Components',
          backgroundColorProperty: new Property( '#f3fff3' ),
          homeScreenIcon: createScreenIcon( '#a31515', '#b75e2a', 'radial' )
        }
      ),

      // UI-components screen
      new Screen(
        function() { return new UIComponentsModel(); },
        function( model ) { return new UIComponentsScreenView( model ); },
        {
          name: 'UI Components',
          backgroundColorProperty: new Property( '#fff5ba' ),
          homeScreenIcon: createScreenIcon( '#71ddbf', '#8d49e5', 'linear' )
        }
      ),

      // screen with global controls for sonification
      new Screen(
        function() { return {}; }, // no model needed, return a stub
        function() { return new TestingScreenView(); },
        {
          name: 'Testing',
          backgroundColorProperty: new Property( '#F0F8FF' ),
          homeScreenIcon: createScreenIcon( '#ADFF2F', '#FFDAB9', 'radial' )
        }
      )

    ], simOptions ).start();

  } );
} );
