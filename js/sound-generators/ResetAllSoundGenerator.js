// Copyright 2018, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const resetAllSound = require( 'sound!TAMBO/reset-all.mp3' );

  /**
   * @param {BooleanProperty} resetInProgressProperty
   * @param {Object} [options]
   * @constructor
   */
  function ResetAllSoundGenerator( resetInProgressProperty, options ) {
    const self = this;
    SoundClip.call( this, resetAllSound, options );
    const resetListener = function( resetInProgress ) {
      if ( resetInProgress ) {
        self.play();
      }
    };
    resetInProgressProperty.link( resetListener );

    // @private {function}
    this.disposeResetAllSound = function() {
      resetInProgressProperty.unlink( resetListener );
    };
  }

  tambo.register( 'ResetAllSoundGenerator', ResetAllSoundGenerator );

  return inherit( SoundClip, ResetAllSoundGenerator, {

    /**
     * @public
     */
    dispose: function() {
      this.disposeResetAllSound();
      SoundClip.prototype.dispose.call( this );
    }
  } );
} );