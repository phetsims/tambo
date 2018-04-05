// Copyright 2018, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var tambo = require( 'TAMBO/tambo' );

  /**
   * @param {BooleanProperty} resetInProgressProperty
   * @constructor
   */
  function ResetAllSound( resetInProgressProperty ) {
    var self = this;
    SoundClip.call( this, './audio/reset-all.mp3' );
    resetInProgressProperty.link( function( resetInProgress ) {
      if ( resetInProgress ) {
        self.play();
      }
    } );

    // TODO: Need a dispose or this will leak memory if/when removed from SonificationManager
  }

  tambo.register( 'ResetAllSound', ResetAllSound );

  return inherit( SoundClip, ResetAllSound );
} );