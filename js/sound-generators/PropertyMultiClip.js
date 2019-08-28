// Copyright 2019, University of Colorado Boulder

/**
 * A sound generator that plays sounds each time a property changes to a new value.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const MultiClip = require( 'TAMBO/sound-generators/MultiClip' );
  const tambo = require( 'TAMBO/tambo' );

  class PropertyMultiClip extends MultiClip {

    /**
     * @param {Property.<*>} property - the property for which sounds are played on value changes
     * @param {Map<*,SoundInfo>} valueToSoundInfoMap - a map of values to SoundInfo objects (i.e. the type that is
     * returned by the PhET "sound" RequireJS plugin) that is used to define the association between values and sounds.
     * @param {Object} [options]
     */
    constructor( property, valueToSoundInfoMap, options ) {

      options = _.extend( {

        // Controls whether the linkage to the property is "lazy", meaning that the first sound isn't played until a
        // change of value occurs.  If set to false, this will attempt to play a sound when the link is initially set up.
        linkLazily: true
      }, options );

      super( valueToSoundInfoMap, options );

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

  return tambo.register( 'PropertyMultiClip', PropertyMultiClip );
} );