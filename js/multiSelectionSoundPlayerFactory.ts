// Copyright 2019-2022, University of Colorado Boulder

/**
 * The multiSelectionSoundPlayerFactory singleton is used to create a set of sound players that are similar to one
 * another but slightly different, and can thus be used to sonically indicate that a selection is being made from a
 * group of available options. It was originally developed to support radio buttons (and was called
 * radioButtonSoundPlayerFactory), but its usage was expanded to combo boxes, so the name was generalized.  It may be
 * appropriate to use in other contexts as well.
 *
 * By providing a factory for these sound players, we can avoid having to construct unique instances for each case where
 * a sound player is needed, thus conserving memory and minimizing load time.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import radioButtonV2_mp3 from '../sounds/radioButtonV2_mp3.js';
import SoundClip from './sound-generators/SoundClip.js';
import soundManager from './soundManager.js';
import tambo from './tambo.js';
import TSoundPlayer from './TSoundPlayer.js';

class MultiSelectionSoundPlayerFactory {

  // sound clip that will serve as the basis for all sound plays, will be constructed the first time it is requested
  private _basisSoundClip: SoundClip | null;

  // instances of sound players, indexed by position in the group, created as needed
  private readonly soundPlayers: TSoundPlayer[];

  public constructor() {
    this._basisSoundClip = null;
    this.soundPlayers = [];
  }

  /**
   * get the single instance of the sound player, and create it if it doesn't exist yet
   */
  private getSoundClipInstance(): SoundClip {
    if ( !this._basisSoundClip ) {
      this._basisSoundClip = new SoundClip( radioButtonV2_mp3, {
        initialOutputLevel: 0.7,
        rateChangesAffectPlayingSounds: false
      } );

      // automatically register the sound generator
      soundManager.addSoundGenerator( this._basisSoundClip, { categoryName: 'user-interface' } );
    }
    return this._basisSoundClip;
  }

  /**
   * Get a sound player for the specified position that will produce a sound that varies from the primary sound based on
   * provided parameter.
   * @param positionIndex - the position within the radio button group, combo box, or whatever
   */
  public getSelectionSoundPlayer( positionIndex: number ): TSoundPlayer {

    if ( !this.soundPlayers[ positionIndex ] ) {

      // calculate a playback rate that starts from the natural frequency of the sound and goes down by whole tones
      const playbackRate = Math.pow( 2, -positionIndex / 12 );

      // create the sound player for this rate
      this.soundPlayers[ positionIndex ] = new FixedSpeedSoundClipPlayer(
        this.getSoundClipInstance(),
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

  private readonly soundPlayer: SoundClip;
  private readonly playbackRate: number;

  public constructor( soundPlayer: SoundClip, playbackRate: number ) {
    this.soundPlayer = soundPlayer;
    this.playbackRate = playbackRate;
  }

  public play(): void {
    this.soundPlayer.setPlaybackRate( this.playbackRate );
    this.soundPlayer.play();
  }

  public stop(): void {
    this.soundPlayer.stop();
  }
}

const multiSelectionSoundPlayerFactory = new MultiSelectionSoundPlayerFactory();
tambo.register( 'multiSelectionSoundPlayerFactory', multiSelectionSoundPlayerFactory );
export default multiSelectionSoundPlayerFactory;