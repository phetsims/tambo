// Copyright 2018, University of Colorado Boulder

/**
 * sound generator that produces a popping sound with controllable pitch
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Range = require( 'DOT/Range' );
  const SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  const tambo = require( 'TAMBO/tambo' );

  // constants
  const DEFAULT_NUM_POP_GENERATORS = 8;
  const ENVELOPE_TIME_CONSTANT = 0.005; // in seconds
  const DEFAULT_POP_DURATION = 0.02; // in seconds

  /**
   * @constructor
   * {Object} options
   */
  function PitchedPopGenerator( options ) {

    options = _.extend( {

      // the range of pitches that this pop generator will produce, in Hz
      pitchRange: new Range( 220, 660 ),

      // the number of pop generators to create and pool, use more if generating lots of pops close together, less if not
      numPopGenerators: DEFAULT_NUM_POP_GENERATORS
    }, options );

    const self = this;
    SoundGenerator.call( this, options );

    // @private {Range} - range of pitches to be produced
    this.pitchRange = options.pitchRange;

    // {DynamicsCompressorNode} - a dynamics compressor node used to limit max output amplitude, otherwise distortion
    // tends to occur when lots of pops are played at once
    const dynamicsCompressorNode = this.audioContext.createDynamicsCompressor();

    // the following values were empirically determined throgh informed experimentation
    var now = this.audioContext.currentTime;
    dynamicsCompressorNode.threshold.setValueAtTime( -3, now );
    dynamicsCompressorNode.knee.setValueAtTime( 0, now ); // hard knee
    dynamicsCompressorNode.ratio.setValueAtTime( 12, now );
    dynamicsCompressorNode.attack.setValueAtTime( 0, now );
    dynamicsCompressorNode.release.setValueAtTime( 0.25, now );
    dynamicsCompressorNode.connect( this.masterGainNode );

    // create the sources - several are created so that pops can be played in rapid succession if desired
    // @private {{oscillator:OscillatorNode, gainNode:GainNode}[]} - an array of sound source, several are created so
    // that pops can be played in rapid succession without interfering with one another
    this.soundSources = [];
    _.times( options.numPopGenerators, function() {

      // {OscillatorNode}
      const oscillator = self.audioContext.createOscillator();
      const now = self.audioContext.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime( options.pitchRange.min, now );
      oscillator.start( 0 );

      // {GainNode}
      const gainNode = self.audioContext.createGain();
      gainNode.gain.setValueAtTime( 0, now );
      oscillator.connect( gainNode );
      gainNode.connect( dynamicsCompressorNode );

      self.soundSources.push( {
        oscillator: oscillator,
        gainNode: gainNode
      } );
    } );

    // @private
    this.nextSoundSourceIndex = 0;
  }

  tambo.register( 'PitchedPopGenerator', PitchedPopGenerator );

  inherit( SoundGenerator, PitchedPopGenerator, {

    /**
     * play the pop sound
     * {number} relativePitch - a value from 0 to 1 indicating the frequency to play within the pitch range
     * {number} [duration] - the duration of the sound, in seconds
     * @public
     */
    playPop: function( relativePitch, duration ) {

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
  } );

  return PitchedPopGenerator;
} );