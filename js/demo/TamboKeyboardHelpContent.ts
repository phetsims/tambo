// Copyright 2018-2022, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.  This is stubbed,
 * since we need it for testing but this sim is not meant to be used outside of PhET.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import { HBox } from '../../../scenery/js/imports.js';
import tambo from '../tambo.js';

class TamboKeyboardHelpContent extends HBox {
  public constructor() {
    super( { children: [ new BasicActionsKeyboardHelpSection() ], align: 'top', spacing: 30 } );
  }
}

tambo.register( 'TamboKeyboardHelpContent', TamboKeyboardHelpContent );

export default TamboKeyboardHelpContent;