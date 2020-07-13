// Copyright 2019-2020, University of Colorado Boulder

/**
 * SharedSoundClip is used to create sound clips that can be shared by multiple objects so that multiple instances don't
 * have to be created, which saves memory and load time.  This is essentially a singleton pattern, and also auto-
 * registers the sound with the sound manager.
 *
 * This type wraps the sound clip an only passes through the "play()" method, since attributes of the shared clip, such
 * as output level and playback rate, should not be altered.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import soundManager from '../soundManager.js';
import tambo from '../tambo.js';
import SoundClip from './SoundClip.js';

class SharedSoundClip {

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
   * the only supported method is "play", since no clients should be changing things like the playback rate or output
   * level
   * @public
   */
  play() {
    this.soundClip.play();
  }
}

tambo.register( 'SharedSoundClip', SharedSoundClip );

export default SharedSoundClip;