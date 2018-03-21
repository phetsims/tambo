// Copyright 2018, University of Colorado Boulder

/**
 * main file for the tambo library demo and test harness
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DemoModel = require( 'TAMBO/demo/model-manipulation/model/DemoModel' );
  var ModelManipulationScreenView = require( 'TAMBO/demo/model-manipulation/view/ModelManipulationScreenView' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var SonificationManager = require( 'TAMBO/SonificationManager' );
  var StringProperty = require( 'AXON/StringProperty' );

  // strings
  var tamboTitleString = require( 'string!TAMBO/tambo.title' );

  var simOptions = {
    credits: {
      leadDesign: 'John Blanco'
    }
  };

  // initialize the sonification manager
  SonificationManager.createInstance(
    // TODO: These properties are essentially stubbed for now, should be populated with the real things
    new BooleanProperty( false ),
    new BooleanProperty( true ),
    new StringProperty( 'enhanced' )
  );

  function createScreenIcon( color ) {
    return new Rectangle(
      0,
      0,
      Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width,
      Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height,
      { fill: color }
    );
  }

  SimLauncher.launch( function() {
    new Sim( tamboTitleString, [

      // sim-like components screen
      new Screen(
        function(){ return new DemoModel(); },
        function( model ) { return new ModelManipulationScreenView( model ); },
        {
          name: 'Sim-Like Components',
          backgroundColorProperty: new Property( '#f3fff3' ),
          homeScreenIcon: createScreenIcon( 'red' )
        }
      ),

      // UI-components screen
      new Screen(
        function(){ return new DemoModel(); },
        function( model ) { return new ModelManipulationScreenView( model ); },
        {
          name: 'UI Components',
          backgroundColorProperty: new Property( '#fff5ba' ),
          homeScreenIcon: createScreenIcon( 'blue' )
        }
      )

      // screen with global controls for sonification
      // TODO: add this

    ], simOptions ).start();
  } );
} );
