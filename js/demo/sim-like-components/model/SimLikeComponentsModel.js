// Copyright 2018, University of Colorado Boulder

// Copyright 2015-2017, University of Colorado Boulder

/**
 * A model that exists only for the purposes of demonstrating sonification, particularly how view and model elements are
 * used together to hook up sonification elements.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var BoxOfBalls = require( 'TAMBO/demo/sim-like-components/model/BoxOfBalls' );
  var inherit = require( 'PHET_CORE/inherit' );
  var tambo = require( 'TAMBO/tambo' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @constructor
   */
  function SimLikeComponentsModel() {

    // @public {NumberProperty} - a property that is intended to be hooked up to a slider with discrete values
    this.discreteValueProperty = new NumberProperty( 0 );

    // @public (read-only) {BoxOfBalls) - box containing bouncing balls, size empirically determined
    this.boxOfBalls = new BoxOfBalls( 100, 60, 10 );

    // @public {BooleanProperty} - tracks whether a reset is happening
    this.resetInProgressProperty = new BooleanProperty( false );
  }

  tambo.register( 'SimLikeComponentsModel', SimLikeComponentsModel );

  return inherit( Object, SimLikeComponentsModel, {

    /**
     * @param {number} dt - delta time, in seconds
     * @public
     */
    step: function( dt ) {
      this.boxOfBalls.step( dt );
    },

    /**
     * @public
     */
    reset: function() {
      this.resetInProgressProperty.set( true );
      this.resetInProgressProperty.set( false );
    }

  } );
} );