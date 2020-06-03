// Copyright 2019-2020, University of Colorado Boulder

/**
 * a derived boolean property that inverts the provided boolean property
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import tambo from './tambo.js';

class InvertedBooleanProperty extends DerivedProperty {

  /**
   * {DerivedProperty} propertyToInvert
   * @constructor
   */
  constructor( propertyToInvert ) {
    assert && assert( propertyToInvert instanceof BooleanProperty );
    super( [ propertyToInvert ], x => !x );
  }
}

tambo.register( 'InvertedBooleanProperty', InvertedBooleanProperty );
export default InvertedBooleanProperty;