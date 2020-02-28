// Copyright 2019-2020, University of Colorado Boulder

/**
 * an object that maps a continuous value to one of a finite number of "bins"
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import tambo from './tambo.js';

class BinMapper {

  /**
   * {Range} valueRange - the range of values covered by this mapper
   * {number} numBins - the number of bins to which the value will be mapped
   * {Object} [options]
   * @constructor
   */
  constructor( valueRange, numBins, options ) {

    // parameter checking
    assert && assert( numBins > 0 );

    options = merge( {

      // allow values that are outside the specified range (if false, an assert occurs on out-of-range values)
      tolerateOutOfRangeValues: false
    }, options );

    // @private
    this.minValue = valueRange.min;
    this.maxValue = valueRange.max;
    this.span = valueRange.getLength();
    this.numBins = numBins;
    this.options = options;
  }

  /**
   * map the provided value in a bin
   * @param value
   * @returns {number}
   * @public
   */
  mapToBin( value ) {
    if ( !this.options.tolerateOutOfRangeValues ) {
      assert && assert( value <= this.maxValue );
      assert && assert( value >= this.minValue );
    }

    const proportion = ( value - this.minValue ) / ( this.span );

    // this calculation means that values on the boundaries will go into the higher bin except for the max value
    return Math.min( Math.floor( proportion * this.numBins ), this.numBins - 1 );
  }
}

tambo.register( 'BinMapper', BinMapper );
export default BinMapper;