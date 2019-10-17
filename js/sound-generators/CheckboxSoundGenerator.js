// Copyright 2019, University of Colorado Boulder

/**
 * sound generator for when check boxes are checked on unchecked
 *
 * TODO: This is a stopgap class whose functionality should at some point be moved into the Checkbox type.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const MultiClip = require( 'TAMBO/sound-generators/MultiClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const checkboxChecked = require( 'sound!TAMBO/check-box-checked.mp3' );
  const checkboxUnchecked = require( 'sound!TAMBO/check-box-unchecked.mp3' );

  class CheckboxSoundGenerator extends MultiClip {

    /**
     * @param {BooleanProperty} checkboxProperty - the property that is set by the Checkbox
     * @param {BooleanProperty} resetInProgressProperty - whether a reset is in progress
     * @param {Object} [options]
     * @constructor
     */
    constructor( checkboxProperty, resetInProgressProperty, options ) {

      options = merge( {
        orderedValueList: [ true, false ],
        initialOutputLevel: 0.7
      }, options );

      // create the map of boolean values to sounds
      const valuesToSoundInfoMap = new Map(); // can't use initialization constructor since it's not supported in IE
      valuesToSoundInfoMap.set( true, checkboxChecked );
      valuesToSoundInfoMap.set( false, checkboxUnchecked );

      super( valuesToSoundInfoMap, options );

      const checkboxPropertyListener = value => {
        if ( !resetInProgressProperty.value ) {
          this.playAssociatedSound( value );
        }
      };
      checkboxProperty.lazyLink( checkboxPropertyListener );

      // @private {function}
      this.disposeCheckboxSoundGenerator = () => { checkboxProperty.unlink( checkboxPropertyListener ); };
    }

    /**
     * @public
     */
    dispose() {
      this.disposeCheckboxSoundGenerator();
      super.dispose();
    }
  }

  tambo.register( 'CheckboxSoundGenerator', CheckboxSoundGenerator );

  return CheckboxSoundGenerator;
} );