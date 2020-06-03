// Copyright 2019-2020, University of Colorado Boulder

/**
 * A boolean property that is always the opposite of the provided boolean property
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import tambo from './tambo.js';

class InvertedBooleanProperty extends BooleanProperty {

  /**
   * {BooleanProperty} propertyToInvert
   * @constructor
   */
  constructor( propertyToInvert ) {

    assert && assert( propertyToInvert instanceof BooleanProperty );

    super( !propertyToInvert.value );

    propertyToInvert.link( value => {
      this.set( !value );
    } );
  }
}

tambo.register( 'InvertedBooleanProperty', InvertedBooleanProperty );
export default InvertedBooleanProperty;