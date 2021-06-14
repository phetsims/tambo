// Copyright 2019-2021, University of Colorado Boulder

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

import merge from '../../../phet-core/js/merge.js';
import soundManager from '../soundManager.js';
import tambo from '../tambo.js';
import SoundClip from './SoundClip.js';

class SoundClipPlayer {

  /**
   * @param {WrappedAudioBuffer} wrappedAudioBuffer - a Web Audio audio buffer containing decoded audio samples
   * @param {Object} [options]
   * @constructor
   */
  constructor( wrappedAudioBuffer, options ) {

    options = merge( {
      soundClipOptions: null,
      soundManagerOptions: null
    }, options );

    // {SoundClip} @private
    this.soundClip = new SoundClip( wrappedAudioBuffer, options.soundClipOptions );

    // automatically register this sound clip with the sound manager
    soundManager.addSoundGenerator( this.soundClip, options.soundManagerOptions );
  }

  /**
   * Plays the sound clip.
   * @public
   */
  play() {
    this.soundClip.play();
  }

  /**
   * Stops the sound clip.
   * @public
   */
  stop() {
    this.soundClip.stop();
  }

  /**
   * Get the sound clip that is wrapped by this player.  USE THIS METHOD CAREFULLY, IF AT ALL.  This class is intended
   * primarily for use in singletons that play a sound.  If the underlying sound clip is manipulated, it will change for
   * all users, so this should be used with caution and clear intention.
   * @returns {SoundClip}
   * @public
   */
  getSoundClip() {
    return this.soundClip;
  }
}

tambo.register( 'SoundClipPlayer', SoundClipPlayer );

export default SoundClipPlayer;