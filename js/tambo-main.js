// Copyright 2018-2020, University of Colorado Boulder

/**
 * main file for the tambo library demo and test harness
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import RadialGradient from '../../scenery/js/util/RadialGradient.js';
import SimLikeComponentsModel from './demo/sim-like-components/model/SimLikeComponentsModel.js';
import SimLikeComponentsScreenView from './demo/sim-like-components/view/SimLikeComponentsScreenView.js';
import TamboKeyboardHelpContent from './demo/TamboKeyboardHelpContent.js';
import TestingScreenView from './demo/testing/view/TestingScreenView.js';
import UIComponentsModel from './demo/ui-components/model/UIComponentsModel.js';
import UIComponentsScreenView from './demo/ui-components/view/UIComponentsScreenView.js';
import tamboStrings from './tambo-strings.js';

const tamboTitleString = tamboStrings.tambo.title;

// set up the simulation options
const keyboardHelpContent = new TamboKeyboardHelpContent();
const simOptions = {
  credits: {
    leadDesign: 'John Blanco'
  },
  keyboardHelpNode: keyboardHelpContent
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

SimLauncher.launch( () => {
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