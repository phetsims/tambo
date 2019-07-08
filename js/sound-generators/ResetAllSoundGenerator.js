// Copyright 2018, University of Colorado Boulder

define( require => {
  'use strict';

  // modules
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const resetAllSound = require( 'sound!TAMBO/reset-all.mp3' );

  class ResetAllSoundGenerator extends SoundClip {

    /**
     * @param {BooleanProperty} resetInProgressProperty
     * @param {Object} [options]
     * @constructor
     */
    constructor( resetInProgressProperty, options ) {
      super( resetAllSound, options );
      const resetListener = resetInProgress => {
        if ( resetInProgress ) {
          this.play();
        }
      };
      resetInProgressProperty.link( resetListener );

      // @private {function}
      this.disposeResetAllSound = () => { resetInProgressProperty.unlink( resetListener ); };
    }

    /**
     * @public
     */
    dispose() {
      this.disposeResetAllSound();
      super.dispose();
    }

  }

  tambo.register( 'ResetAllSoundGenerator', ResetAllSoundGenerator );

  return ResetAllSoundGenerator;
} );