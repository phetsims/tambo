// Copyright 2019-2020, University of Colorado Boulder

/**
 * a derived boolean property that inverts the provided boolean property
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import tambo from './tambo.js';

class InvertedBooleanProperty extends DerivedProperty {

  /**
   * @param {DerivedProperty} propertyToInvert
   * @param {Object} [options] - see Property
   * @constructor
   */
  constructor( propertyToInvert, options ) {
    assert && assert( propertyToInvert instanceof BooleanProperty );
    super( [ propertyToInvert ], x => !x, options );
  }
}

tambo.register( 'InvertedBooleanProperty', InvertedBooleanProperty );
export default InvertedBooleanProperty;