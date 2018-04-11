// Copyright 2018, University of Colorado Boulder

/**
 * view for a screen that allows user to set global sonification settings
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ABSwitch = require( 'SUN/ABSwitch' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SonificationManager = require( 'TAMBO/SonificationManager' );
  var tambo = require( 'TAMBO/tambo' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   */
  function SonificationControlsScreenView() {

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    // add an AB switch that will select between 'basic' and 'enhanced' sonification
    var abSwitch = new ABSwitch(
      SonificationManager.getInstance().levelProperty,
      'basic',
      new Text( 'basic' ),
      'enhanced',
      new Text( 'enhanced' ),
      { switchSize: new Dimension2( 40, 20 ), left: 100, top: 200 }
    );
    this.addChild( abSwitch );
  }

  tambo.register( 'SonificationControlsScreenView', SonificationControlsScreenView );

  return inherit( ScreenView, SonificationControlsScreenView );
} );