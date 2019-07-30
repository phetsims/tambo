// Copyright 2019, University of Colorado Boulder

/**
 * sound generator for a set up radio buttons, plays the same sound at different speeds based on the selection
 *
 * TODO: This is a stopgap class whose functionality should at some point be moved into radio button common code.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const radioButtonSound = require( 'sound!TAMBO/radio-button-v2.mp3' );

  class RadioButtonSoundGenerator extends SoundClip {

    /**
     * @param {BooleanProperty} selectedIndexProperty - the property that is set by the radio buttons
     * @param {BooleanProperty} resetInProgressProperty - whether a reset is in progress
     * @param {Object[]} items - see VerticalAquaRadioButtonGroup
     * @param {Object} [options]
     * @constructor
     */
    constructor( selectedIndexProperty, resetInProgressProperty, items, options ) {

      options = _.extend( {
        initialOutputLevel: 0.7,
        baseSound: radioButtonSound
      }, options );

      super( options.baseSound, options );

      const playRadioButtonSound = ( selectedItem ) => {

        const itemIndex = items.indexOf( selectedItem );
        assert && assert( itemIndex >= 0 );

        // calculate a playback rate that starts from the natural frequency of the sound and goes down by whole tones
        const playbackRate = Math.pow( 2, -itemIndex / 12 );
        this.setPlaybackRate( playbackRate );
        this.play();
      };

      selectedIndexProperty.lazyLink( playRadioButtonSound );

      // @private {function}
      this.disposeRadioButtonSoundGenerator = () => { selectedIndexProperty.unlink( playRadioButtonSound ); };
    }

    /**
     * @public
     */
    dispose() {
      this.disposeRadioButtonSoundGenerator();
      super.dispose();
    }
  }

  tambo.register( 'RadioButtonSoundGenerator', RadioButtonSoundGenerator );

  return RadioButtonSoundGenerator;
} );