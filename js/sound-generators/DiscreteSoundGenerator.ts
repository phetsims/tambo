// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiscreteSoundGenerator produces sounds based on the value of a number property.  It monitors the property value and
 * maps it to one of a finite number of bins, and produces a discrete sound when the bin to which the value is mapped
 * changes.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import optionize from '../../../phet-core/js/optionize.js';
import brightMarimba_mp3 from '../../sounds/brightMarimba_mp3.js';
import tambo from '../tambo.js';
import SoundClip, { SoundClipOptions } from './SoundClip.js';
import WrappedAudioBuffer from '../WrappedAudioBuffer.js';
import BinMapper from '../BinMapper.js';

type SelfOptions = {

  // the sound that will be played at the discrete values
  sound?: WrappedAudioBuffer;

  // number of discrete bins, crossing between them will produce a sound
  numBins?: 7;

  // the range over which the playback rate is varied, 1 is normal speed, 2 is double speed, et cetera
  playbackRateRange?: Range;

  // when true will cause sound to be played on any change of the value property
  alwaysPlayOnChangesProperty?: null | BooleanProperty;

  // If true, the sound will be played when the value reaches the min.
  playSoundAtMin?: boolean;

  // If true, the sound will be played when the value reaches the max.
  playSoundAtMax?: boolean;

  // a flag that indicates whether out of range values should be ignored
  outOfRangeValuesOK?: boolean;
};
export type DiscreteSoundGeneratorOptions = SelfOptions & SoundClipOptions;

class DiscreteSoundGenerator extends SoundClip {
  private readonly disposeDiscreteSoundGenerator: () => void;

  /**
   * @param valueProperty - the value that is monitored to trigger sounds
   * @param valueRange - the range of values expected and over which sounds will be played
   * @param [providedOptions] - options for this sound generation and its parent class
   */
  public constructor( valueProperty: NumberProperty, valueRange: Range, providedOptions?: DiscreteSoundGeneratorOptions ) {

    const options = optionize<DiscreteSoundGeneratorOptions, SelfOptions, SoundClipOptions>()( {
      sound: brightMarimba_mp3,
      initialOutputLevel: 1,
      numBins: 7,
      playbackRateRange: new Range( 1, 1 ), // default is no change to the sound
      alwaysPlayOnChangesProperty: null,
      playSoundAtMin: true,
      playSoundAtMax: true,
      outOfRangeValuesOK: false
    }, providedOptions );

    // invoke superconstructor
    super( options.sound, options );

    // create the object that will place the continuous values into bins
    const binMapper = new BinMapper( valueRange, options.numBins, {
      tolerateOutOfRangeValues: options.outOfRangeValuesOK
    } );

    // function for playing sound when the appropriate conditions are met
    const playSoundOnChanges = ( newValue: number, oldValue: number ) => {

      const newBin = binMapper.mapToBin( newValue );
      const oldBin = binMapper.mapToBin( oldValue );

      if ( options.alwaysPlayOnChangesProperty && options.alwaysPlayOnChangesProperty.value ||
           ( newValue === valueRange.min && options.playSoundAtMin ) ||
           ( newValue === valueRange.max && options.playSoundAtMax ) ||
           newBin !== oldBin ) {

        const normalizedValue = ( newValue - valueRange.min ) / valueRange.getLength();
        const playbackRate = normalizedValue * ( options.playbackRateRange.max - options.playbackRateRange.min ) +
                             options.playbackRateRange.min;
        this.setPlaybackRate( playbackRate );
        this.play();
      }
    };

    // monitor the value, playing sounds when appropriate
    valueProperty.lazyLink( playSoundOnChanges );

    // dispose function
    this.disposeDiscreteSoundGenerator = () => { valueProperty.unlink( playSoundOnChanges ); };
  }

  /**
   */
  public override dispose(): void {
    this.disposeDiscreteSoundGenerator();
    super.dispose();
  }

}

tambo.register( 'DiscreteSoundGenerator', DiscreteSoundGenerator );

export default DiscreteSoundGenerator;