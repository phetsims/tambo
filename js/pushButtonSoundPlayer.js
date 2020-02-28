// Copyright 2019-2020, University of Colorado Boulder

/**
 * The pushButtonSoundPlayer singleton is used to play the default sound for buttons.  It loads the sound only once,
 * thus preventing it from being loaded for every push button.  It also does not load at all if sound is not enabled
 * in order to minimize load time and memory usage.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import buttonSound from '../sounds/general-button-v4_mp3.js';
import SoundClip from './sound-generators/SoundClip.js';
import soundManager from './soundManager.js';
import tambo from './tambo.js';

// sounds

// the instance that is created the first time getInstance is called
let instance = null;

/**
 * definition of the pushButtonSoundPlayer object
 */
class pushButtonSoundPlayer {

  /**
   * @private
   */
  constructor() {

    // state checking
    assert && assert( !instance, 'the constructor should only be invoked once' );

    // create the sound clip if sound is enabled for this sim, otherwise don't
    if ( phet.joist.sim.supportsSound ) {

      // @private {SoundClip}
      this.soundClip = new SoundClip( buttonSound, { initialOutputLevel: 0.7 } );

      // automatically register this sound clip with the sound manager so that the client does have to
      soundManager.addSoundGenerator( this.soundClip );
    }
  }

  static getInstance() {
    if ( instance === null ) {
      instance = new pushButtonSoundPlayer();
    }
    return instance;
  }

  /**
   * play the sound if it was created
   * @public
   */
  play() {
    this.soundClip && this.soundClip.play();
  }

  /**
   * set the playback rate if the sound clip was created
   * @public
   */
  setPlaybackRate( rate ) {
    this.soundClip && this.soundClip.setPlaybackRate( rate );
  }
}

tambo.register( 'pushButtonSoundPlayer', pushButtonSoundPlayer );
export default pushButtonSoundPlayer;