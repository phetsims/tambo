// Copyright 2022, University of Colorado Boulder

import ValueChangeSoundPlayer from '../../../sound-generators/ValueChangeSoundPlayer.js';
import tambo from '../../../tambo.js';
import SoundClip from '../../../sound-generators/SoundClip.js';
import brightMarimbaShort_mp3 from '../../../../sounds/brightMarimbaShort_mp3.js';
import soundManager from '../../../soundManager.js';
import Range from '../../../../../dot/js/Range.js';

/**
 * SliderPitchChangeSoundGenerator is intended as a demonstration of a ValueChangeSoundPlayer that changes the pitch
 * (aka the playback rate) of its produced sounds as the slider values change.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */


class SliderPitchChangeSoundGenerator extends ValueChangeSoundPlayer {

  /**
   * @param valueRange - the range of values expected and over which sounds will be played
   */
  public constructor( valueRange: Range ) {

    // sound clip to be used in both the up and down directions for the middle sounds
    const marimbaSoundClip = new SoundClip( brightMarimbaShort_mp3, {
      initialOutputLevel: 0.2,
      rateChangesAffectPlayingSounds: false
    } );
    soundManager.addSoundGenerator( marimbaSoundClip );

    // playback rate mapping function
    const middleMovingUpPlaybackRateMapper = ( value: number ) => 0.5 + ( value - valueRange.min ) / valueRange.getLength();
    const middleMovingDownPlaybackRateMapper = ( value: number ) => 0.4 + ( value - valueRange.min ) / valueRange.getLength();

    super( valueRange, {
      middleMovingUpSoundPlayer: marimbaSoundClip,
      middleMovingDownSoundPlayer: marimbaSoundClip,
      middleMovingUpPlaybackRateMapper: middleMovingUpPlaybackRateMapper,
      middleMovingDownPlaybackRateMapper: middleMovingDownPlaybackRateMapper,
      numberOfMiddleThresholds: 7
    } );
  }
}

tambo.register( 'SliderPitchChangeSoundGenerator', SliderPitchChangeSoundGenerator );

export default SliderPitchChangeSoundGenerator;