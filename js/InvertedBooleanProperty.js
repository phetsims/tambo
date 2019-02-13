// Copyright 2019, University of Colorado Boulder

/**
 * a boolean property that is always the opposite of the provided boolean property
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const tambo = require( 'TAMBO/tambo' );

  /**
   * {BooleanProperty} propertyToInvert
   * @constructor
   */
  class InvertedBooleanProperty extends BooleanProperty {

    constructor( propertyToInvert ) {

      assert && assert( propertyToInvert instanceof BooleanProperty );

      super( !propertyToInvert.value );

      propertyToInvert.link( value => {
        this.set( !value );
      } );
    }
  }

  return tambo.register( 'InvertedBooleanProperty', InvertedBooleanProperty );
} );