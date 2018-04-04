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
  var inherit = require( 'PHET_CORE/inherit' );
  var tambo = require( 'TAMBO/tambo' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @constructor
   */
  function SimLikeComponentsModel() {

    // @public {NumberProperty} - a property that is intended to be hooked up to a slider with discrete values
    this.discreteValueProperty = new NumberProperty( 0 );
  }

  tambo.register( 'SimLikeComponentsModel', SimLikeComponentsModel );

  return inherit( Object, SimLikeComponentsModel, {} );
} );