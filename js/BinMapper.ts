// Copyright 2019-2022, University of Colorado Boulder

/**
 * BinMapper is an object that maps a continuous value to one of a finite number of "bins".
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import tambo from './tambo.js';
import Range from '../../dot/js/Range.js';
import optionize from '../../phet-core/js/optionize.js';

export type BinMapperOptions = {

  // Allow values that are outside the specified range (if false, an assert occurs on out-of-range values).
  tolerateOutOfRangeValues?: boolean;
};

class BinMapper {
  private readonly minValue: number;
  private readonly maxValue: number;
  private readonly span: number;
  private readonly numBins: number;
  private readonly options: BinMapperOptions;

  public constructor( valueRange: Range, numBins: number, providedOptions?: BinMapperOptions ) {

    // parameter checking
    assert && assert( numBins > 0 );

    const options = optionize<BinMapperOptions, BinMapperOptions>()( {
      tolerateOutOfRangeValues: false
    }, providedOptions );

    this.minValue = valueRange.min;
    this.maxValue = valueRange.max;
    this.span = valueRange.getLength();
    this.numBins = numBins;
    this.options = options;
  }

  /**
   * Map the provided value to a bin.
   */
  public mapToBin( value: number ): number {
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