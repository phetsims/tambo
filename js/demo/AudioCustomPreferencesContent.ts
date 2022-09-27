// Copyright 2020-2022, University of Colorado Boulder

/**
 * AudioCustomPreferencesContent is intended as an example of a node that can serve as the content the Preferences
 * dialog that enables the user to select between different candidate sounds that are under consideration for use in a
 * sound design.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import PreferencesDialog from '../../../joist/js/preferences/PreferencesDialog.js';
import { Node, Text } from '../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../tandem/js/Tandem.js';
import tambo from '../tambo.js';

class AudioCustomPreferencesContent extends Node {

  public constructor() {

    // global property that specifies which sound to use when balls bounce on the walls of the box (but not the ceiling)
    phet.tambo.soundIndexForWallBounceProperty = new NumberProperty( 0 );

    const items = [
      {
        value: 0,
        createNode: ( tandem: Tandem ) => new Text( '1st option', PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS )
      },
      {
        value: 1,
        createNode: ( tandem: Tandem ) => new Text( '2nd option', PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS )
      },
      {
        value: 2,
        createNode: ( tandem: Tandem ) => new Text( '3rd option', PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS )
      }
    ];

    const radioButtonGroup = new AquaRadioButtonGroup( phet.tambo.soundIndexForWallBounceProperty, items, {
      orientation: 'vertical',
      align: 'left'
    } );

    super( { children: [ radioButtonGroup ] } );
  }
}

tambo.register( 'AudioCustomPreferencesContent', AudioCustomPreferencesContent );

export default AudioCustomPreferencesContent;