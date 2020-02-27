// Copyright 2019-2020, University of Colorado Boulder

/**
 * The radioButtonSoundPlayerFactor singleton is where sound players for common radio buttons sounds can be obtained.
 * By providing a factory for these sounds, we can avoid having to construct unique instances for each case where a
 * sound player is needed, thus conserving memory and minimizing load time.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import radioButtonSoundInfo from '../sounds/radio-button-v2_mp3.js';
import SoundClip from './sound-generators/SoundClip.js';
import soundManager from './soundManager.js';
import tambo from './tambo.js';

// sounds

/**
 * definition of the pushButtonSoundPlayer object
 */
class RadioButtonSoundPlayerFactory {

  /**
   * @private
   */
  constructor() {

    // @private - sound player, will be constructed the first time it is requested
    this._radioButtonSoundPlayer = null;

    // @private - instances of sound players, indexed by position in radio button group, created as needed
    this.soundPlayers = [];
  }

  /**
   * get the single instance of the sound player, and create it if it doesn't exist yet
   * @private
   */
  getSoundPlayerInstance() {
    if ( !this._radioButtonSoundPlayer ) {
      this._radioButtonSoundPlayer = new SoundClip( radioButtonSoundInfo, {
        initialOutputLevel: 0.7,
        rateChangesAffectPlayingSounds: false
      } );

      // automatically register the sound generator
      soundManager.addSoundGenerator( this._radioButtonSoundPlayer, { categoryName: 'user-interface' } );
    }
    return this._radioButtonSoundPlayer;
  }

  /**
   * get a player that will play the sound clip at the specified rate
   * @param {number} positionIndex - the position within the radio button group
   * @public
   */
  getRadioButtonSoundPlayer( positionIndex ) {

    if ( !this.soundPlayers[ positionIndex ] ) {

      // calculate a playback rate that starts from the natural frequency of the sound and goes down by whole tones
      const playbackRate = Math.pow( 2, -positionIndex / 12 );

      // create the sound player for this rate
      this.soundPlayers[ positionIndex ] = new FixedSpeedSoundClipPlayer(
        this.getSoundPlayerInstance(),
        playbackRate
      );
    }

    // return the sound player that corresponds to this position in the radio button group
    return this.soundPlayers[ positionIndex ];
  }
}

/**
 * FixedSpeedSoundClipPlayer is an inner class that plays a sound clip at the provided playback rate.  The general
 * idea here is that one sound clip can be used at a number of different speeds, thus saving memory and load time
 * versus having a bunch of separate instances.  The provided sound clip is assumed to be registered with the sound
 * manager already, this class does not register it.
 */
class FixedSpeedSoundClipPlayer {

  /**
   * @param {SoundPlayer} soundPlayer
   * @param {number} playbackRate
   * @public
   */
  constructor( soundPlayer, playbackRate ) {

    // @private
    this.soundPlayer = soundPlayer;
    this.playbackRate = playbackRate;
  }

  play() {
    this.soundPlayer.setPlaybackRate( this.playbackRate );
    this.soundPlayer.play();
  }
}

const radioButtonSoundPlayerFactory = new RadioButtonSoundPlayerFactory();
tambo.register( 'radioButtonSoundPlayerFactory', radioButtonSoundPlayerFactory );
export default radioButtonSoundPlayerFactory;