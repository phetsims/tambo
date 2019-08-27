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
  const checkboxChecked = require( 'sound!TAMBO/check-box-checked.mp3' );
  const checkboxUnchecked = require( 'sound!TAMBO/check-box-unchecked.mp3' );
  const comboBoxCloseSoundInfo = require( 'sound!TAMBO/combo-box-close.mp3' );
  const comboBoxOpenSoundInfo = require( 'sound!TAMBO/combo-box-open.mp3' );
  const resetAllSoundInfo = require( 'sound!TAMBO/reset-all.mp3' );
  const playButtonSoundInfo = require( 'sound!TAMBO/play-pause-003.mp3' );
  const pauseButtonSoundInfo = require( 'sound!TAMBO/pause.mp3' );
  const stepBackwardButtonSoundInfo = require( 'sound!TAMBO/step-back-v2.mp3' );
  const stepForwardButtonSoundInfo = require( 'sound!TAMBO/step-forward-v2.mp3' );

  /**
   * definition of the pushButtonSoundPlayer object
   */
  class CommonSoundPlayers {

    /**
     * @private
     */
    constructor() {

      // instances of common sound players, created when first requested (i.e. lazily)
      this._checkboxCheckedSoundPlayer = null;
      this._checkboxUncheckedSoundPlayer = null;
      this._comboBoxOpenSoundPlayer = null;
      this._comboBoxCloseSoundPlayer = null;
      this._pauseButtonSoundPlayer = null;
      this._playButtonSoundPlayer = null;
      this._pushButtonSoundPlayer = null;
      this._resetAllSoundPlayer = null;
      this._stepBackwardButtonSoundPlayer = null;
      this._stepForwardButtonSoundPlayer = null;
    }

    /**
     * @public
     * @returns {SoundClipProxy}
     */
    get checkboxCheckedSoundPlayer() {
      if ( this._checkboxCheckedSoundPlayer === null ) {
        this._checkboxCheckedSoundPlayer = new AutoRegisteringSoundClipProxy(
          checkboxChecked,
          { initialOutputLevel: 0.7 }
        );
      }
      return this._checkboxCheckedSoundPlayer;
    }

    /**
     * @public
     * @returns {SoundClipProxy}
     */
    get checkboxUncheckedSoundPlayer() {
      if ( this._checkboxUncheckedSoundPlayer === null ) {
        this._checkboxUncheckedSoundPlayer = new AutoRegisteringSoundClipProxy(
          checkboxUnchecked,
          { initialOutputLevel: 0.7 }
        );
      }
      return this._checkboxUncheckedSoundPlayer;
    }

    /**
     * @public
     * @returns {SoundClipProxy}
     */
    get comboBoxCloseSoundPlayer() {
      if ( this._comboBoxCloseSoundPlayer === null ) {
        this._comboBoxCloseSoundPlayer = new AutoRegisteringSoundClipProxy(
          comboBoxCloseSoundInfo,
          { initialOutputLevel: 0.7 }
        );
      }
      return this._comboBoxCloseSoundPlayer;
    }

    /**
     * @public
     * @returns {SoundClipProxy}
     */
    get comboBoxOpenSoundPlayer() {
      if ( this._comboBoxOpenSoundPlayer === null ) {
        this._comboBoxOpenSoundPlayer = new AutoRegisteringSoundClipProxy(
          comboBoxOpenSoundInfo,
          { initialOutputLevel: 0.7 }
        );
      }
      return this._comboBoxOpenSoundPlayer;
    }

    /**
     * @public
     * @returns {SoundClipProxy}
     */
    get playButtonSoundPlayer() {
      if ( this._playButtonSoundPlayer === null ) {
        this._playButtonSoundPlayer = new AutoRegisteringSoundClipProxy(
          playButtonSoundInfo,
          { initialOutputLevel: 0.7 }
        );
      }
      return this._playButtonSoundPlayer;
    }

    /**
     * @public
     * @returns {SoundClipProxy}
     */
    get pauseButtonSoundPlayer() {
      if ( this._pauseButtonSoundPlayer === null ) {
        this._pauseButtonSoundPlayer = new AutoRegisteringSoundClipProxy(
          pauseButtonSoundInfo,
          { initialOutputLevel: 0.7 }
        );
      }
      return this._pauseButtonSoundPlayer;
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
     * @returns {AutoRegisteringSoundClipProxy}
     */
    get stepForwardButtonSoundPlayer() {
      if ( this._stepForwardButtonSoundPlayer === null ) {
        this._stepForwardButtonSoundPlayer = new AutoRegisteringSoundClipProxy(
          stepForwardButtonSoundInfo,
          { initialOutputLevel: 0.7 }
        );
      }
      return this._stepForwardButtonSoundPlayer;
    }

    /**
     * @public
     * @returns {AutoRegisteringSoundClipProxy}
     */
    get stepBackwardButtonSoundPlayer() {
      if ( this._stepBackwardButtonSoundPlayer === null ) {
        this._stepBackwardButtonSoundPlayer = new AutoRegisteringSoundClipProxy(
          stepBackwardButtonSoundInfo,
          { initialOutputLevel: 0.7 }
        );
      }
      return this._stepBackwardButtonSoundPlayer;
    }

  }

  const commonSoundPlayers = new CommonSoundPlayers();
  return tambo.register( 'commonSoundPlayers', commonSoundPlayers );
} );