// Copyright 2024, University of Colorado Boulder

/**
 * CrossFadeSoundClip is a sound generator that combines two sound clips and allows the user to set the relative mix -
 * aka fade - between them.  This can be useful in situations where there are a number of similar UI elements that need
 * to have similar but somewhat distinct interaction sounds.
 *
 * This was created specifically for the needs of the "Mean: Share and Balance" simulation, and there is at least one
 * example of how it was intended to be used in that sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import tambo from '../tambo.js';
import TSoundPlayer from '../TSoundPlayer.js';
import WrappedAudioBuffer from '../WrappedAudioBuffer.js';
import SoundClip from './SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from './SoundGenerator.js';

type SelfOptions = {

  // The amount of cross-fade from 0 to 1.  Can be provided, will be created locally if not supplied.
  crossFadeProperty?: NumberProperty | null;

  // Initial value of the cross-fade.  This is only used if the crossFadeProperty is not provided.  Valid values are
  // from 0 to 1 inclusive.
  initialCrossFadeValue?: number;
};
type CrossFadeSoundClipOptions = SoundGeneratorOptions & SelfOptions;

class CrossFadeSoundClip extends SoundGenerator implements TSoundPlayer {

  public readonly crossFadeProperty: NumberProperty;
  private readonly soundClipA: SoundClip;
  private readonly soundClipB: SoundClip;

  /**
   * @param audioBufferA - audio buffer for sound A
   * @param audioBufferB - audio buffer for sound B
   * @param [providedOptions]
   */
  public constructor( audioBufferA: WrappedAudioBuffer,
                      audioBufferB: WrappedAudioBuffer,
                      providedOptions?: CrossFadeSoundClipOptions ) {

    const options = optionize<CrossFadeSoundClipOptions, SelfOptions, SoundGeneratorOptions>()( {
      crossFadeProperty: null,
      initialCrossFadeValue: 0
    }, providedOptions );

    assert && assert(
    options.initialCrossFadeValue >= 0 && options.initialCrossFadeValue <= 1,
      'initialCrossFadeValue must be between 0 and 1 (inclusive)'
    );

    super( options );

    this.crossFadeProperty = options.crossFadeProperty || new NumberProperty( options.initialCrossFadeValue );
    this.soundClipA = new SoundClip( audioBufferA, {
      rateChangesAffectPlayingSounds: false
    } );
    this.soundClipA.connect( this.soundSourceDestination );
    this.soundClipB = new SoundClip( audioBufferB, {
      rateChangesAffectPlayingSounds: false
    } );
    this.soundClipB.connect( this.soundSourceDestination );

    // Adjust the volume levels of the individual clips as the cross-fade values changes.
    this.crossFadeProperty.link( crossFade => {

      // range check
      assert && assert( crossFade >= 0 && crossFade <= 1, 'out of range cross fade value' );

      // A simple linear cross-fade algorithm is used here, which was deemed adequate for the use cases supported as of
      // the time of this writing.  If needed, other algorithms could be created and supplied as an option.
      this.soundClipA.outputLevel = 1 - crossFade;
      this.soundClipB.outputLevel = crossFade;
    } );
  }

  public play(): void {
    this.soundClipA.play();
    this.soundClipB.play();
  }

  public stop(): void {
    this.soundClipA.stop();
    this.soundClipB.stop();
  }

  public setPlaybackRate( playbackRate: number ): void {
    this.soundClipA.setPlaybackRate( playbackRate );
    this.soundClipB.setPlaybackRate( playbackRate );
  }
}

tambo.register( 'CrossFadeSoundClip', CrossFadeSoundClip );

export default CrossFadeSoundClip;