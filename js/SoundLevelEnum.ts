// Copyright 2018-2022, University of Colorado Boulder

/**
 * This enum is used to describe whether a sound is part of the "basic" sounds or the "extra" sounds.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Enumeration from '../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../phet-core/js/EnumerationValue.js';
import tambo from './tambo.js';

class SoundScope extends EnumerationValue {
  public static readonly BASIC = new SoundScope();
  public static readonly EXTRA = new SoundScope();

  // Gets a list of keys, values and mapping between them. For use by EnumerationProperty and PhET-iO.
  public static readonly enumeration = new Enumeration( SoundScope, {
    phetioDocumentation: 'describes whether a sound is considered part of the basic or the extra sounds for the sim'
  } );
}

tambo.register( 'SoundScope', SoundScope );
export default SoundScope;