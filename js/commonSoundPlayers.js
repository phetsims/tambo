// Copyright 2019, University of Colorado Boulder

/**
 * The commonSoundPlayers singleton is both a factory and repository for sounds that are used in multiple places in the
 * code.  The general idea is that the first time a sound player is requested it is constructed and a reference to the
 * instance is retained, and on subsequent requests the previously constructed instance is returned.  By doing this, a
 * reusable single instance of a sound player is made available for all common UI components that need it.  This is done
 * because having a single instance of a sound clip or other sound generator reduces memory consumption and load time
 * versus creating a separate instance of the same sound clip.
 *
 * Also, if sound is not enabled for this sim, loading and decoding of sound data is skipped altogether to minimize load
 * time and memory usage.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AutoRegisteringSoundClipProxy = require( 'TAMBO/AutoRegisteringSoundClipProxy' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const buttonSoundInfo = require( 'sound!TAMBO/general-button-v4.mp3' );
  const resetAllSoundInfo = require( 'sound!TAMBO/reset-all.mp3' );

  /**
   * definition of the pushButtonSoundPlayer object
   */
  class CommonSoundPlayers {

    /**
     * @private
     */
    constructor() {

      // instances of common sound players, created when first requested (i.e. lazily)
      this._resetAllSoundPlayer = null;
      this._pushButtonSoundPlayer = null;
    }

    /**
     * @public
     * @returns {AutoRegisteringSoundClipProxy}
     */
    get resetAllSoundPlayer() {
      if ( this._resetAllSoundPlayer === null ) {
        this._resetAllSoundPlayer = new AutoRegisteringSoundClipProxy( resetAllSoundInfo, { initialOutputLevel: 0.7 } );
      }
      return this._resetAllSoundPlayer;
    }

    /**
     * @public
     * @returns {SoundClipProxy}
     */
    get pushButtonSoundPlayer() {
      if ( this._pushButtonSoundPlayer === null ) {
        this._pushButtonSoundPlayer = new AutoRegisteringSoundClipProxy( buttonSoundInfo, { initialOutputLevel: 0.7 } );
      }
      return this._pushButtonSoundPlayer;
    }

  }

  const commonSoundPlayers = new CommonSoundPlayers();
  return tambo.register( 'commonSoundPlayers', commonSoundPlayers );
} );