// Copyright 2018-2020, University of Colorado Boulder

/**
 * sound generator that produces a popping sound with controllable pitch
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import merge from '../../../phet-core/js/merge.js';
import tambo from '../tambo.js';
import SoundGenerator from './SoundGenerator.js';

// constants
const DEFAULT_NUM_POP_GENERATORS = 8;
const ENVELOPE_TIME_CONSTANT = 0.005; // in seconds
const DEFAULT_POP_DURATION = 0.02; // in seconds

class PitchedPopGenerator extends SoundGenerator {

  /**
   * @constructor
   * {Object} options
   */
  constructor( options ) {

    options = merge( {

      // the range of pitches that this pop generator will produce, in Hz
      pitchRange: new Range( 220, 660 ),

      // the number of pop generators to create and pool, use more if generating lots of pops close together, less if not
      numPopGenerators: DEFAULT_NUM_POP_GENERATORS
    }, options );

    super( options );

    // @private {Range} - range of pitches to be produced
    this.pitchRange = options.pitchRange;

    // {DynamicsCompressorNode} - a dynamics compressor node used to limit max output amplitude, otherwise distortion
    // tends to occur when lots of pops are played at once
    const dynamicsCompressorNode = this.audioContext.createDynamicsCompressor();

    // the following values were empirically determined throgh informed experimentation
    const now = this.audioContext.currentTime;
    dynamicsCompressorNode.threshold.setValueAtTime( -3, now );
    dynamicsCompressorNode.knee.setValueAtTime( 0, now ); // hard knee
    dynamicsCompressorNode.ratio.setValueAtTime( 12, now );
    dynamicsCompressorNode.attack.setValueAtTime( 0, now );
    dynamicsCompressorNode.release.setValueAtTime( 0.25, now );
    dynamicsCompressorNode.connect( this.soundSourceDestination );

    // create the sources - several are created so that pops can be played in rapid succession if desired
    // @private {{oscillator:OscillatorNode, gainNode:GainNode}[]} - an array of sound source, several are created so
    // that pops can be played in rapid succession without interfering with one another
    this.soundSources = [];
    _.times( options.numPopGenerators, () => {

      // {OscillatorNode}
      const oscillator = this.audioContext.createOscillator();
      const now = this.audioContext.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime( options.pitchRange.min, now );
      oscillator.start( 0 );

      // {GainNode}
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime( 0, now );
      oscillator.connect( gainNode );
      gainNode.connect( dynamicsCompressorNode );

      this.soundSources.push( {
        oscillator: oscillator,
        gainNode: gainNode
      } );
    } );

    // @private
    this.nextSoundSourceIndex = 0;
  }

  /**
   * play the pop sound
   * {number} relativePitch - a value from 0 to 1 indicating the frequency to play within the pitch range
   * {number} [duration] - the duration of the sound, in seconds
   * @public
   */
  playPop( relativePitch, duration ) {

    assert && assert( relativePitch >= 0 && relativePitch <= 1, 'relative pitch value out of range' );

    if ( !this.fullyEnabled ) {

      // ignore the request
      return;
    }

    // use either the specified or default duration
    duration = duration || DEFAULT_POP_DURATION;

    // determine the frequency value of the pop
    const minFrequency = this.pitchRange.min;
    const maxFrequency = this.pitchRange.max;
    const frequency = minFrequency + relativePitch * ( maxFrequency - minFrequency );

    // get a sound source from the pool, then index to the next one (see above for type info on sound sources)
    const soundSource = this.soundSources[ this.nextSoundSourceIndex ];
    this.nextSoundSourceIndex = ( this.nextSoundSourceIndex + 1 ) % this.soundSources.length;

    // play the pop sound
    const now = this.audioContext.currentTime;
    soundSource.gainNode.gain.cancelScheduledValues( now );
    soundSource.oscillator.frequency.setValueAtTime( frequency / 2, now );
    soundSource.gainNode.gain.setValueAtTime( 0, now );
    soundSource.oscillator.frequency.linearRampToValueAtTime( frequency * 2, now + duration );
    soundSource.gainNode.gain.setTargetAtTime( 1, now, ENVELOPE_TIME_CONSTANT );
    soundSource.gainNode.gain.setTargetAtTime( 0, now + duration, ENVELOPE_TIME_CONSTANT );
  }

}

tambo.register( 'PitchedPopGenerator', PitchedPopGenerator );

export default PitchedPopGenerator;