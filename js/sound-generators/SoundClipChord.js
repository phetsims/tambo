// Copyright 2020, University of Colorado Boulder

/**
 * Given a sound, make a chord based on it, and provided playback rates that correspond to notes.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import merge from '../../../phet-core/js/merge.js';
import SoundClip from '../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../tambo/js/sound-generators/SoundGenerator.js';
import tambo from '../tambo.js';

class SoundClipChord extends SoundGenerator {

  /**
   * @param {WrappedAudioBuffer} sound
   * @param {Object} [options]
   */
  constructor( sound, options ) {
    options = merge( {
      initialOutputLevel: 0.7,

      // When true, the chord will play with a delay between each note, starting with the first note in chordPlaybackRates
      // and ending with the last.
      arpeggiate: false,
      arpeggiateTime: 0.10, // in seconds, the total time that it will take the chord to arpeggiate
      chordPlaybackRates: [ Math.pow( 2, 1 / 12 ), Math.pow( 2, 4 / 12 ), Math.pow( 2, 7 / 12 ) ] // default to major chord
    }, options );

    super( options );

    // @private
    this.arpeggiate = options.arpeggiate;
    this.arpeggiateTime = options.arpeggiateTime;

    // @private
    this.playbackSoundClips = options.chordPlaybackRates.map( playbackRate => {
      const soundClip = new SoundClip( sound, { initialPlaybackRate: playbackRate } );
      soundClip.connect( this.soundSourceDestination );
      return soundClip;
    } );

    // @public
    this.isPlayingProperty = DerivedProperty.or( this.playbackSoundClips.map( soundClip => soundClip.isPlayingProperty ) );
  }

  /**
   * @public
   */
  play() {
    this.playbackSoundClips.forEach( ( soundClip, index ) => {
      const delay = this.arpeggiate ? index * this.arpeggiateTime / this.playbackSoundClips.length : 0;
      soundClip.play( delay );
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.playbackSoundClips.forEach( soundClip => soundClip.dispose() );
    this.playbackSoundClips.length = 0;
    super.dispose();
  }
}

tambo.register( 'SoundClipChord', SoundClipChord );
export default SoundClipChord;