// Copyright 2018, University of Colorado Boulder

/**
 * main file for the tambo library demo and test harness
 */
define( function( require ) {
  'use strict';

  // modules
  var DemoModel = require( 'TAMBO/demo/model-manipulation/model/DemoModel' );
  var ModelManipulationScreenView = require( 'TAMBO/demo/model-manipulation/view/ModelManipulationScreenView' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var tamboTitleString = require( 'string!TAMBO/tambo.title' );

  // constants

  var simOptions = {
    credits: {
      leadDesign: 'John Blanco'
    }
  };

  var createScreenIcon = function( color ) {
    return new Rectangle(
      0,
      0,
      Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width,
      Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height,
      { fill: color }
    );
  };

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
