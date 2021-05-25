// Copyright 2021, University of Colorado Boulder

/**
 * SoundClipPlayer is a limited and automatically registered sound clip.  It is intended to be used in sound players
 * that can be shared in multiple places within a simulation so that the sound information doesn't need to be decoded
 * and stored multiple times.  See resetAllSoundPlayer for an example.
 *
 * This type wraps the sound clip and only supports the play and stop methods so that attributes such as output level
 * and playback rate can't be easily altered.
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
}

tambo.register( 'SoundClipPlayer', SoundClipPlayer );

export default SoundClipPlayer;