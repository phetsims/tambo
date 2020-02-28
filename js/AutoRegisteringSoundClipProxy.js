// Copyright 2019-2020, University of Colorado Boulder

/**
 * AutoRegisteringSoundClipProxy is a light wrapper around SoundClip that acts as a "pass through" if sound is enabled
 * for the simulation, but skips loading and provides stubbed methods if sound is *not* enabled.  Its purpose is to keep
 * load times and memory usage minimized in cases where sound is not being utilized.
 *
 * Also, when sound is enabled for this sim, instances of this type automatically register the sound clip with the sound
 * manager upon construction so that the client doesn't have to be concerned about it.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundClip from './sound-generators/SoundClip.js';
import soundManager from './soundManager.js';
import tambo from './tambo.js';

class AutoRegisteringSoundClipProxy {

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

tambo.register( 'AutoRegisteringSoundClipProxy', AutoRegisteringSoundClipProxy );

export default AutoRegisteringSoundClipProxy;