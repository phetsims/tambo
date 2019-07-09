// Copyright 2019, University of Colorado Boulder

/**
 * sound generator for when check boxes are checked on unchecked
 * TODO: This is a stopgap object whose functionality should at some point be moved into the Checkbox type.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
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

      options = _.extend( {
        orderedValueList: [ true, false ],
        initialOutputLevel: 0.7
      }, options );

      super( [ checkboxChecked, checkboxUnchecked ], options );

      const checkboxPropertyListener = value => {
        if ( !resetInProgressProperty.value ) {
          this.playByValue( value );
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