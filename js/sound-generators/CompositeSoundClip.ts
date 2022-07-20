// Copyright 2020-2022, University of Colorado Boulder

/**
 * A sound generator that is composed of multiple SoundClips that are all started and stopped at the same time.
 * Basically, this is a container to create and control multiple SoundClip instances as one.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import tambo from '../tambo.js';
import SoundClip, { SoundClipOptions } from './SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from './SoundGenerator.js';
import WrappedAudioBuffer from '../WrappedAudioBuffer.js';
import { EmptySelfOptions } from '../../../phet-core/js/optionize.js';

export type SoundAndOptions = {
  sound: WrappedAudioBuffer;
  options?: SoundClipOptions;
};

type SelfOptions = EmptySelfOptions;
export type CompositeSoundClipOptions = SelfOptions & SoundGeneratorOptions;

class CompositeSoundClip extends SoundGenerator {

  // array that will hold the individual sound clips
  private readonly soundClips: SoundClip[];

  public constructor( soundsAndOptionsTuples: SoundAndOptions[], options?: CompositeSoundClipOptions ) {
    super( options );

    this.soundClips = [];

    for ( let i = 0; i < soundsAndOptionsTuples.length; i++ ) {
      const soundAndOptions = soundsAndOptionsTuples[ i ];
      const soundClip = new SoundClip( soundAndOptions.sound, soundAndOptions.options );
      soundClip.connect( this.soundSourceDestination );
      this.soundClips.push( soundClip );
    }
  }

  public play(): void {
    this.soundClips.forEach( soundClip => soundClip.play() );
  }

  public stop(): void {
    this.soundClips.forEach( soundClip => soundClip.stop() );
  }

  public override connect( destination: AudioParam | AudioNode ): void {
    this.soundClips.forEach( soundClip => soundClip.connect( destination ) );
  }

  public override dispose(): void {
    this.soundClips.forEach( soundClip => soundClip.dispose() );
  }

  public get isPlaying(): boolean {
    return _.some( this.soundClips, soundClip => soundClip.isPlaying );
  }

  public override setOutputLevel( outputLevel: number, timeConstant: number ): void {
    this.soundClips.forEach( soundClip => soundClip.setOutputLevel( outputLevel, timeConstant ) );
  }
}

tambo.register( 'CompositeSoundClip', CompositeSoundClip );

export default CompositeSoundClip;