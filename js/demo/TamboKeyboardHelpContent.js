// Copyright 2018-2019, University of Colorado Boulder

/**
 * Content for the "Hot Keys and Help" dialog that can be brought up from the sim navigation bar.  This is stubbed,
 * since we need it for testing but this sim is not meant to be used outside of PhET.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const tambo = require( 'TAMBO/tambo' );

  class TamboKeyboardHelpContent extends HBox {

    /**
     * @constructor
     */
    constructor() {
      super( { children: [ new GeneralKeyboardHelpSection() ], align: 'top', spacing: 30 } );
    }

  }

  tambo.register( 'TamboKeyboardHelpContent', TamboKeyboardHelpContent );

  return TamboKeyboardHelpContent;
} );