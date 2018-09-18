// Copyright 2018, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var tambo = require( 'TAMBO/tambo' );

  // sounds
  var resetAllSound = require( 'sound!TAMBO/reset-all.mp3' );

  /**
   * @param {BooleanProperty} resetInProgressProperty
   * @constructor
   */
  function ResetAllSoundGenerator( resetInProgressProperty ) {
    var self = this;
    SoundClip.call( this, resetAllSound );
    var resetListener = function( resetInProgress ) {
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