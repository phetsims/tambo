// Copyright 2018-2020, University of Colorado Boulder

/**
 * main file for the tambo library demo and test harness
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import ScreenIcon from '../../joist/js/ScreenIcon.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import RadialGradient from '../../scenery/js/util/RadialGradient.js';
import SimLikeComponentsModel from './demo/sim-like-components/model/SimLikeComponentsModel.js';
import SimLikeComponentsScreenView from './demo/sim-like-components/view/SimLikeComponentsScreenView.js';
import SoundOptionsDialogContent from './demo/SoundOptionsDialogContent.js';
import TamboKeyboardHelpContent from './demo/TamboKeyboardHelpContent.js';
import TestingScreenView from './demo/testing/view/TestingScreenView.js';
import UIComponentsModel from './demo/ui-components/model/UIComponentsModel.js';
import UIComponentsScreenView from './demo/ui-components/view/UIComponentsScreenView.js';
import tamboStrings from './tamboStrings.js';

// constants
const SOUND_OPTIONS_DIALOG_CONTENT = new SoundOptionsDialogContent();

// set up the simulation options
const simOptions = {
  credits: {
    leadDesign: 'John Blanco'
  },
  hasKeyboardHelpContent: true,
  createOptionsDialogContent: () => SOUND_OPTIONS_DIALOG_CONTENT
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

const keyboardHelpNode = new TamboKeyboardHelpContent();

simLauncher.launch( () => {
  new Sim( tamboStrings.tambo.title, [

    // sim-like components screen
    new Screen(
      ( () => new SimLikeComponentsModel() ),
      ( model => new SimLikeComponentsScreenView( model ) ),
      {
        name: 'Sim-Like Components',
        backgroundColorProperty: new Property( '#f3fff3' ),
        homeScreenIcon: new ScreenIcon( createScreenIcon( '#a31515', '#b75e2a', 'radial' ), {
          maxIconWidthProportion: 1,
          maxIconHeightProportion: 1
        } ),
        keyboardHelpNode: keyboardHelpNode
      }
    ),

    // UI-components screen
    new Screen(
      ( () => new UIComponentsModel() ),
      ( model => new UIComponentsScreenView( model ) ),
      {
        name: 'UI Components',
        backgroundColorProperty: new Property( '#fff5ba' ),
        homeScreenIcon: new ScreenIcon( createScreenIcon( '#71ddbf', '#8d49e5', 'linear' ), {
          maxIconWidthProportion: 1,
          maxIconHeightProportion: 1
        } ),
        keyboardHelpNode: keyboardHelpNode
      }
    ),

    // screen with global controls for sonification
    new Screen(
      ( () => {
        return {};
      } ), // no model needed, return a stub
      ( () => new TestingScreenView() ),
      {
        name: 'Testing',
        backgroundColorProperty: new Property( '#F0F8FF' ),
        homeScreenIcon: new ScreenIcon( createScreenIcon( '#ADFF2F', '#FFDAB9', 'radial' ), {
          maxIconWidthProportion: 1,
          maxIconHeightProportion: 1
        } ),
        keyboardHelpNode: keyboardHelpNode
      }
    )

  ], simOptions ).start();

} );