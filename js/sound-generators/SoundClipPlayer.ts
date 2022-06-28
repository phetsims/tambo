// Copyright 2019-2022, University of Colorado Boulder

/**
 * SoundClipPlayer is a limited and automatically registered sound clip.  It is intended to be used for sounds that
 * can be shared in multiple places within a simulation so that separate instances of sound clips don't need to be
 * created and registered in as many places.  See resetAllSoundPlayer for an example.
 *
 * This type wraps the sound clip and only supports the play and stop methods so that attributes such as output level
 * and playback rate can't be easily altered.  A method is supported for retrieving the sound clip itself in case
 * additional information about or manipulation of the sound clip is necessary.
 *
 * If you're familiar with PhET graphics rendering library "scenery", this class is intended to support a feature that
 * is similar to the DAG (directed acyclic graph) feature in that library.  As with that feature, SoundClipPlayer can
 * get a little weird if not used as intended.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import soundManager, { SoundGeneratorAddOptions } from '../soundManager.js';
import tambo from '../tambo.js';
import SoundClip, { SoundClipOptions } from './SoundClip.js';
import WrappedAudioBuffer from '../WrappedAudioBuffer.js';
import optionize from '../../../phet-core/js/optionize.js';

export type SoundClipPlayerOptions = {
  soundClipOptions?: SoundClipOptions;
  soundManagerOptions?: SoundGeneratorAddOptions;
};

class SoundClipPlayer {

  private readonly _soundClip: SoundClip;

  /**
   * @param wrappedAudioBuffer - a Web Audio audio buffer containing decoded audio samples
   * @param [providedOptions]
   */
  public constructor( wrappedAudioBuffer: WrappedAudioBuffer, providedOptions?: SoundClipPlayerOptions ) {

    const options = optionize<SoundClipPlayerOptions, SoundClipPlayerOptions>()( {
      soundClipOptions: {},
      soundManagerOptions: {}
    }, providedOptions );

    this._soundClip = new SoundClip( wrappedAudioBuffer, options.soundClipOptions );

    // automatically register this sound clip with the sound manager
    soundManager.addSoundGenerator( this._soundClip, options.soundManagerOptions );
  }

  /**
   * Play the sound clip.
   */
  public play(): void {
    this._soundClip.play();
  }

  /**
   * Stop the sound clip.  Does nothing if the sound clip is not playing.
   */
  public stop(): void {
    this._soundClip.stop();
  }

  /**
   * Get the sound clip that is wrapped by this player.  USE THIS METHOD CAREFULLY, IF AT ALL.  This class is intended
   * primarily for use in singletons that play a sound.  If the underlying sound clip is manipulated, it will change for
   * all users, so this method should be used with caution and clear intention.
   */
  public getSoundClip(): SoundClip {
    return this._soundClip;
  }
}

tambo.register( 'SoundClipPlayer', SoundClipPlayer );

export default SoundClipPlayer;