// Copyright 2020, University of Colorado Boulder

/**
 * A sound generator that is composed of multiple SoundClips that are all started and stopped at the same time.
 * Basically, this is a container to create and control multiple SoundClip instances as one.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import tambo from '../tambo.js';
import SoundClip from './SoundClip.js';
import SoundGenerator from './SoundGenerator.js';

class CompositeSoundClip extends SoundGenerator {

  /**
   * @param {Array.<{sound:WrappedAudioBuffer, [options]:Object}>} soundsAndOptionsTuples
   * @param {Object} [options]
   */
  constructor( soundsAndOptionsTuples, options ) {
    super( options );

    // @private {Array.<SoundClip>}
    this.soundClips = [];

    for ( let i = 0; i < soundsAndOptionsTuples.length; i++ ) {
      const soundAndOptions = soundsAndOptionsTuples[ i ];
      assert && assert( soundAndOptions.hasOwnProperty( 'sound' ), 'sound is a required member of the tuples' );
      const soundClip = new SoundClip( soundAndOptions.sound, soundAndOptions.options );
      soundClip.connect( this.soundSourceDestination );
      this.soundClips.push( soundClip );
    }
  }

  /**
   * @public
   */
  play() {
    this.soundClips.forEach( soundClip => soundClip.play() );
  }

  /**
   * @public
   */
  stop() {
    this.soundClips.forEach( soundClip => soundClip.stop() );
  }

  /**
   * @public
   */
  connect( destination ) {
    this.soundClips.forEach( soundClip => soundClip.connect( destination ) );
  }

  /**
   * @public
   */
  dispose() {
    this.soundClips.forEach( soundClip => soundClip.dispose() );
  }

  /**
   * @returns {boolean} - true if any of the soundClips are playing.
   */
  get isPlaying() {
    return _.some( this.soundClips, soundClip => soundClip.isPlaying );
  }

  /**
   * @public
   * @param {number} outputLevel
   * @param {number} timeConstant
   */
  setOutputLevel( outputLevel, timeConstant ) {
    this.soundClips.forEach( soundClip => soundClip.setOutputLevel( outputLevel, timeConstant ) );
  }
}

tambo.register( 'CompositeSoundClip', CompositeSoundClip );

export default CompositeSoundClip;