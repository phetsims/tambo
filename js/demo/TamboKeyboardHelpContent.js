// Copyright 2018, University of Colorado Boulder

/**
 * Content for the "Hot Keys and Help" dialog that can be brought up from the sim navigation bar.  This is stubbed,
 * since we need it for testing but this sim is not meant to be used outside of PhET.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  const GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const tambo = require( 'TAMBO/tambo' );

  /**
   * @constructor
   */
  function TamboKeyboardHelpContent() {

    const generalNavigationHelpContent = new GeneralKeyboardHelpSection();

    HBox.call( this, {
      children: [ generalNavigationHelpContent ],
      align: 'top',
      spacing: 30
    } );
  }

  tambo.register( 'TamboKeyboardHelpContent', TamboKeyboardHelpContent );

  return inherit( HBox, TamboKeyboardHelpContent );
} );