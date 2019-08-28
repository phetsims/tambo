// Copyright 2019, University of Colorado Boulder

/**
 * The commonSoundPlayers singleton is both a factory and repository for SoundClip-based sound players that are used in
 * multiple places in the code.  The general idea is that the first time a sound player is requested it is constructed
 * and a reference to the instance is retained, and on subsequent requests the previously constructed instance is
 * returned.  By doing this, a reusable single instance of the sound clip is made available for all common UI components
 * that need it.  This is done because having a single instance of a sound clip reduces memory consumption and load time
 * versus creating multiple instances.
 *
 * Also, if sound is not enabled for this sim, loading and decoding of sound data is skipped altogether to minimize load
 * time and memory usage.
 *
 * During construction of the singleton instance, getters are added for each sound, so the usage looks like this:
 *    const resetAllSoundPlayer = commonSoundPlayer.resetAll;
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AutoRegisteringSoundClipProxy = require( 'TAMBO/AutoRegisteringSoundClipProxy' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const pushButtonSoundInfo = require( 'sound!TAMBO/general-button-v4.mp3' );
  const checkboxCheckedSoundInfo = require( 'sound!TAMBO/check-box-checked.mp3' );
  const checkboxUncheckedSoundInfo = require( 'sound!TAMBO/check-box-unchecked.mp3' );
  const comboBoxCloseSoundInfo = require( 'sound!TAMBO/combo-box-close.mp3' );
  const comboBoxOpenSoundInfo = require( 'sound!TAMBO/combo-box-open.mp3' );
  const resetAllSoundInfo = require( 'sound!TAMBO/reset-all.mp3' );
  const playButtonSoundInfo = require( 'sound!TAMBO/play-pause-003.mp3' );
  const pauseButtonSoundInfo = require( 'sound!TAMBO/pause.mp3' );
  const stepBackwardButtonSoundInfo = require( 'sound!TAMBO/step-back-v2.mp3' );
  const stepForwardButtonSoundInfo = require( 'sound!TAMBO/step-forward-v2.mp3' );

  // constants
  const DEFAULT_OUTPUT_LEVEL = 0.7;

  /**
   * definition of the pushButtonSoundPlayer object
   */
  class CommonSoundPlayers {

    /**
     * @private
     */
    constructor() {

      // An object that maps the names of common sound players to the information needed to create them and the players
      // themselves.  The players are not created until needed.  Please keep this alphabetical by key when adding new
      // common sounds.
      this.commonSoundPlayers = {
        checkboxChecked: {
          soundInfo: checkboxCheckedSoundInfo,
          soundPlayer: null
        },
        checkboxUnchecked: {
          soundInfo: checkboxUncheckedSoundInfo,
          soundPlayer: null
        },
        comboBoxClose: {
          soundInfo: comboBoxCloseSoundInfo,
          soundPlayer: null
        },
        comboBoxOpen: {
          soundInfo: comboBoxOpenSoundInfo,
          soundPlayer: null
        },
        pauseButton: {
          soundInfo: pauseButtonSoundInfo,
          soundPlayer: null
        },
        playButton: {
          soundInfo: playButtonSoundInfo,
          soundPlayer: null
        },
        pushButton: {
          soundInfo: pushButtonSoundInfo,
          soundPlayer: null
        },
        resetAll: {
          soundInfo: resetAllSoundInfo,
          soundPlayer: null
        },
        stepBackwardButton: {
          soundInfo: stepBackwardButtonSoundInfo,
          soundPlayer: null
        },
        stepForwardButton: {
          soundInfo: stepForwardButtonSoundInfo,
          soundPlayer: null
        }
      };

      // add a getter for each common sound generator
      _.keys( this.commonSoundPlayers ).forEach( soundPlayerName => {
        Object.defineProperty( this, soundPlayerName, {
          get: () => {
            return this.getSoundPlayerByName( soundPlayerName );
          }
        } );
      } );
    }

    /**
     * get the sound player using the specified name
     * @param {string} name, see the common sound player hash defined above for a list of the possibilities
     * @public
     * TODO: Decide whether the getter pattern, the get-by-name pattern, or both are preferred by the dev team and
     * modify this method accordingly.
     */
    getSoundPlayerByName( name ) {
      assert && assert( this.commonSoundPlayers[ name ], 'requested sound player does not exist: ' + name );
      const playerInfo = this.commonSoundPlayers[ name ];
      if ( !playerInfo.soundPlayer ) {
        playerInfo.soundPlayer = new AutoRegisteringSoundClipProxy( playerInfo.soundInfo, {
          initialOutputLevel: DEFAULT_OUTPUT_LEVEL
        } );
      }
      return playerInfo.soundPlayer;
    }
  }

  const commonSoundPlayers = new CommonSoundPlayers();
  return tambo.register( 'commonSoundPlayers', commonSoundPlayers );
} );