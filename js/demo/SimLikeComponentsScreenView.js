// Copyright 2018, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that are similar to those found in real sims
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var tambo = require( 'TAMBO/tambo' );

  /**
   * @constructor
   */
  function SimLikeComponentsScreenView() {
    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );
  }

  tambo.register( 'SimLikeComponentsScreenView', SimLikeComponentsScreenView );

  return inherit( ScreenView, SimLikeComponentsScreenView );
} );