// Copyright 2019-2020, University of Colorado Boulder

/**
 * A sound generator that plays sounds each time a property changes to a new value.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import tambo from '../tambo.js';
import MultiClip from './MultiClip.js';

class PropertyMultiClip extends MultiClip {

  /**
   * @param {Property.<*>} property - the property for which sounds are played on value changes
   * @param {Map.<*,WrappedAudioBuffer>} valueToSoundMap - a map of values to WrappedAudioBuffer objects that is used to
   * define the association between values and sounds.
   * @param {Object} [options]
   */
  constructor( property, valueToSoundMap, options ) {

    options = merge( {

      // Controls whether the linkage to the property is "lazy", meaning that the first sound isn't played until a
      // change of value occurs.  If set to false, this will attempt to play a sound when the link is initially set up.
      linkLazily: true
    }, options );

    super( valueToSoundMap, options );

    const playSoundForValue = value => { this.playAssociatedSound( value ); };

    if ( options.linkLazily ) {
      property.lazyLink( playSoundForValue );
    }
    else {
      property.link( playSoundForValue );
    }

    // @private - dispose function
    this.disposePropertyMultiClip = () => { property.unlink( playSoundForValue ); };
  }

  /**
   * dispose function
   * @public
   */
  dispose() {
    this.disposePropertyMultiClip();
  }
}

tambo.register( 'PropertyMultiClip', PropertyMultiClip );
export default PropertyMultiClip;