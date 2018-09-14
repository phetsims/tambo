// Copyright 2018, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var tambo = require( 'TAMBO/tambo' );

  // audio
  var resetAllSound = require( 'audio!TAMBO/reset-all.mp3' );

  /**
   * @param {BooleanProperty} resetInProgressProperty
   * @constructor
   */
  function ResetAllSound( resetInProgressProperty ) {
    var self = this;
    SoundClip.call( this, resetAllSound );
    resetInProgressProperty.link( function( resetInProgress ) {
      if ( resetInProgress ) {
        self.play();
      }
    } );

    // TODO: Need a dispose or this will leak memory if/when removed from soundManager
  }

  tambo.register( 'ResetAllSound', ResetAllSound );

  return inherit( SoundClip, ResetAllSound );
} );