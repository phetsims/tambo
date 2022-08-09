// Copyright 2020-2022, University of Colorado Boulder

/**
 * SoundClipChord plays a chord built from the given sound.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import merge from '../../../phet-core/js/merge.js';
import optionize from '../../../phet-core/js/optionize.js';
import SoundClip, { SoundClipOptions } from '../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../tambo/js/sound-generators/SoundGenerator.js';
import tambo from '../tambo.js';
import WrappedAudioBuffer from '../WrappedAudioBuffer.js';
import TSoundPlayer from '../TSoundPlayer.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {

  // options passed along to each SoundClip used in the chord
  soundClipOptions?: SoundClipOptions | null;

  // When true, the chord will play with a delay between each note, starting with the first note in chordPlaybackRates
  // and ending with the last.
  arpeggiate?: boolean;

  // in seconds, the total time that it will take the chord to arpeggiate
  arpeggiateTime?: number;

  // playback rates for the notes in the chord
  chordPlaybackRates?: number[];
};

export type SoundClipChordOptions = SelfOptions & SoundGeneratorOptions;

class SoundClipChord extends SoundGenerator implements TSoundPlayer {

  // whether to play the chord as an arpeggio
  private readonly arpeggiate: boolean;

  // total time to play arpeggio, if enabled
  private readonly arpeggiateTime: number;

  // sound clips to play in the chord
  private readonly playbackSoundClips: SoundClip[];

  // flag indicating whether this is currently playing
  public readonly isPlayingProperty: TReadOnlyProperty<boolean>;

  public constructor( sound: WrappedAudioBuffer, providedOptions?: SoundClipChordOptions ) {

    const options = optionize<SoundClipChordOptions, SelfOptions, SoundGeneratorOptions>()( {
      initialOutputLevel: 0.7,
      soundClipOptions: null,
      arpeggiate: false,
      arpeggiateTime: 0.10, // in seconds, the total time that it will take the chord to arpeggiate
      chordPlaybackRates: [ Math.pow( 2, 1 / 12 ), Math.pow( 2, 4 / 12 ), Math.pow( 2, 7 / 12 ) ] // default to major chord
    }, providedOptions );

    if ( options.soundClipOptions ) {
      assert && assert(
        options.soundClipOptions.initialPlaybackRate === undefined,
        'SoundClipChord sets the initialPlaybackRate for its SoundClips'
      );
    }

    super( options );

    this.arpeggiate = options.arpeggiate;
    this.arpeggiateTime = options.arpeggiateTime;
    this.playbackSoundClips = options.chordPlaybackRates.map( playbackRate => {
      const soundClip = new SoundClip( sound, merge( {
        initialPlaybackRate: playbackRate
      }, options.soundClipOptions ) );
      soundClip.connect( this.soundSourceDestination );
      return soundClip;
    } );

    this.isPlayingProperty = DerivedProperty.or( this.playbackSoundClips.map( soundClip => soundClip.isPlayingProperty ) );
  }

  /**
   * Play the chord.
   */
  public play(): void {
    this.playbackSoundClips.forEach( ( soundClip, index ) => {
      const delay = this.arpeggiate ? index * this.arpeggiateTime / this.playbackSoundClips.length : 0;
      soundClip.play( delay );
    } );
  }

  /**
   * Stop the chord if it's playing.  This is mostly here to complete the TSoundPlayer interface.
   */
  public stop(): void {
    this.playbackSoundClips.forEach( soundClip => {
      soundClip.stop();
    } );
  }

  /**
   * Release any memory references in order to avoid memory leaks.
   */
  public override dispose(): void {
    this.playbackSoundClips.forEach( soundClip => soundClip.dispose() );
    this.playbackSoundClips.length = 0;
    super.dispose();
  }
}

tambo.register( 'SoundClipChord', SoundClipChord );
export default SoundClipChord;