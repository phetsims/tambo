// Copyright 2018-2020, University of Colorado Boulder

/**
 * Content for the "Hot Keys and Help" dialog that can be brought up from the sim navigation bar.  This is stubbed,
 * since we need it for testing but this sim is not meant to be used outside of PhET.
 *
 * @author John Blanco
 */

import GeneralKeyboardHelpSection from '../../../scenery-phet/js/keyboard/help/GeneralKeyboardHelpSection.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import tambo from '../tambo.js';

class TamboKeyboardHelpContent extends HBox {

  /**
   * @constructor
   */
  constructor() {
    super( { children: [ new GeneralKeyboardHelpSection() ], align: 'top', spacing: 30 } );
  }

}

tambo.register( 'TamboKeyboardHelpContent', TamboKeyboardHelpContent );

export default TamboKeyboardHelpContent;