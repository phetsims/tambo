// Copyright 2019, University of Colorado Boulder

/**
 * The commonSoundPlayers singleton is both a factory and repository for sounds that are used in multiple places in the
 * code.  This is done because having a single instance of a sound clip or other sound generator reduces memory
 * consumption and load time versus creating a separate instance of the same sound clip.
 *
 * Also, if sound is not enabled for this sim, loading and decoding of sound data is skipped altogether to minimize load
 * time and memory usage.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
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
     * @returns {SoundClipProxy}
     */
    get resetAllSoundPlayer() {
      if ( this._resetAllSoundPlayer === null ) {
        this._resetAllSoundPlayer = new SoundClipProxy( resetAllSoundInfo, { initialOutputLevel: 0.7 } );
      }
      return this._resetAllSoundPlayer;
    }

    /**
     * @public
     * @returns {SoundClipProxy}
     */
    get pushButtonSoundPlayer() {
      if ( this._pushButtonSoundPlayer === null ) {
        this._pushButtonSoundPlayer = new SoundClipProxy( buttonSoundInfo, { initialOutputLevel: 0.7 } );
      }
      return this._pushButtonSoundPlayer;
    }

  }

  /**
   * SoundClipProxy is an inner class that acts mostly like a sound clip except that if sound is not enabled for a
   * simulation it doesn't actually load and decode the sound - it just provides stubbed methods.
   *
   * Also, the sound clip is auto-registered with the sound manager if created so that clients can just use it without
   * having to be concerned about registration.
   */
  class SoundClipProxy {

    constructor( soundInfo, options ) {

      // create the sound clip if sound is enabled for this sim, otherwise don't
      if ( phet.joist.sim.supportsSound ) {

        // @private {SoundClip}
        this.soundClip = new SoundClip( soundInfo, options );

        // automatically register this sound clip with the sound manager so that the client does have to
        soundManager.addSoundGenerator( this.soundClip );
      }
    }

    // **NOTE** - not all SoundClip methods have been added proactively, feel free to add more if and when needed

    /**
     * play the sound if it was created, do nothing if not
     * @public
     */
    play() {
      this.soundClip && this.soundClip.play();
    }

    /**
     * set the playback rate if the sound clip was created, do nothing if not
     * @public
     */
    setPlaybackRate( rate ) {
      this.soundClip && this.soundClip.setPlaybackRate( rate );
    }
  }

  const commonSoundPlayers = new CommonSoundPlayers();
  return tambo.register( 'commonSoundPlayers', commonSoundPlayers );
} );