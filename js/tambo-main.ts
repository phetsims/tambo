// Copyright 2018-2023, University of Colorado Boulder

/**
 * main file for the tambo library demo and test harness
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import ScreenIcon from '../../joist/js/ScreenIcon.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import { LinearGradient, RadialGradient, Rectangle, TColor } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import SimLikeComponentsModel from './demo/sim-like-components/model/SimLikeComponentsModel.js';
import SimLikeComponentsScreenView from './demo/sim-like-components/view/SimLikeComponentsScreenView.js';
import AudioCustomPreferencesContent from './demo/AudioCustomPreferencesContent.js';
import TamboKeyboardHelpContent from './demo/TamboKeyboardHelpContent.js';
import TestingScreenView from './demo/testing/view/TestingScreenView.js';
import UIComponentsModel from './demo/ui-components/model/UIComponentsModel.js';
import UIComponentsScreenView from './demo/ui-components/view/UIComponentsScreenView.js';
import TamboStrings from './TamboStrings.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import TModel from '../../joist/js/TModel.js';

// constants
const SOUND_OPTIONS_DIALOG_CONTENT = new AudioCustomPreferencesContent();

class Model implements TModel {
  public reset(): void { /* nothing to do */ }
}

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'John Blanco'
  },
  preferencesModel: new PreferencesModel( {
    simulationOptions: {
      customPreferences: [ {

        // In this demo they get added to the "General" tab since there are lots of contents already in the Audio tab.
        // For development purposes there is more space for custom controls in the "General" tab.
        createContent: () => SOUND_OPTIONS_DIALOG_CONTENT
      } ]
    }
  } )
};

// helper function to create screen icons that aren't too bland
function createScreenIcon( color1: TColor, color2: TColor, gradientType: string ): Rectangle {

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

simLauncher.launch( () => {
  new Sim( TamboStrings.tambo.titleStringProperty, [

    // sim-like components screen
    new Screen(
      ( () => new SimLikeComponentsModel() ),
      ( model => new SimLikeComponentsScreenView( model ) ),
      {
        name: new Property( 'Sim-Like Components' ),
        backgroundColorProperty: new Property( '#f3fff3' ),
        homeScreenIcon: new ScreenIcon( createScreenIcon( '#a31515', '#b75e2a', 'radial' ), {
          maxIconWidthProportion: 1,
          maxIconHeightProportion: 1
        } ),
        createKeyboardHelpNode: () => new TamboKeyboardHelpContent(),
        tandem: Tandem.OPT_OUT
      }
    ),

    // UI-components screen
    new Screen(
      ( () => new UIComponentsModel() ),
      ( model => new UIComponentsScreenView( model ) ),
      {
        name: new Property( 'UI Components' ),
        backgroundColorProperty: new Property( '#fff5ba' ),
        homeScreenIcon: new ScreenIcon( createScreenIcon( '#71ddbf', '#8d49e5', 'linear' ), {
          maxIconWidthProportion: 1,
          maxIconHeightProportion: 1
        } ),
        createKeyboardHelpNode: () => new TamboKeyboardHelpContent(),
        tandem: Tandem.OPT_OUT
      }
    ),

    // screen to test and demonstrate more unusual and complex sound generators
    new Screen(
      ( () => new Model() ), // no model needed, return a stub
      ( () => new TestingScreenView() ),
      {
        name: new Property( 'Testing' ),
        backgroundColorProperty: new Property( '#F0F8FF' ),
        homeScreenIcon: new ScreenIcon( createScreenIcon( '#ADFF2F', '#FFDAB9', 'radial' ), {
          maxIconWidthProportion: 1,
          maxIconHeightProportion: 1
        } ),
        createKeyboardHelpNode: () => new TamboKeyboardHelpContent(),
        tandem: Tandem.OPT_OUT
      }
    )

  ], simOptions ).start();

} );