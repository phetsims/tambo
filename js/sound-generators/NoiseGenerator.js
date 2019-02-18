// Copyright 2018-2019, University of Colorado Boulder

/**
 * white noise generator with optional low- and high-pass filters
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  const audioContextStateChangeMonitor = require( 'TAMBO/audioContextStateChangeMonitor' );
  const inherit = require( 'PHET_CORE/inherit' );
  const soundConstants = require( 'TAMBO/soundConstants' );
  const SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  const tambo = require( 'TAMBO/tambo' );

  // constants
  const NOISE_BUFFER_SECONDS = 2;
  const PARAMETER_CHANGE_TIME_CONSTANT = soundConstants.DEFAULT_PARAM_CHANGE_TIME_CONSTANT;
  const LFO_DEPTH_CHANGE_TIME_CONSTANT = 0.05;

  /**
   * @constructor
   */
  function NoiseGenerator( options ) {

    // set up options using default values, see base class for additional options
    options = _.extend( {
      noiseType: 'pink', // valid values are 'white', 'pink', and 'brown'

      // {number} - low pass value in Hz, null (or any falsey value including zero) means no low pass filter is added
      lowPassCutoffFrequency: null,

      // {number} - high pass value in Hz, null (or any falsey value including zero) means no high pass filter is added
      highPassCutoffFrequency: null,

      // {number} - center frequency for band pass filter value in Hz, null (or any falsey value including zero) means
      // no band pass filter is added
      centerFrequency: null,

      // {number} - Q factor, aka quality factor, for bandpass filter if present, see Web Audio BiquadFilterNode for
      // more information
      qFactor: 1,

      // parameters that control the behavior of the low frequency oscillator (LFO), which does amplitude modulation on
      // the noise
      lfoInitiallyEnabled: false,
      lfoInitialFrequency: 2, // Hz
      lfoInitialDepth: 1, // valid values are from 0 to 1
      lfoType: 'sine' // oscillator type, possible values are the same as a Web Audio OscillatorNode

    }, options );

    assert && assert(
      [ 'white', 'pink', 'brown' ].indexOf( options.noiseType ) !== -1,
      'invalid noise type: ' + options.noiseType
    );

    assert && assert(
    options.lfoInitialDepth >= 0 && options.lfoInitialDepth <= 1,
      'invalid value for lfoInitialDepth: ' + options.lfoInitialDepth
    );

    SoundGenerator.call( this, options );

    const now = this.audioContext.currentTime;

    // if specified, create the low-pass filter
    let lowPassFilter;
    if ( options.lowPassCutoffFrequency ) {
      lowPassFilter = this.audioContext.createBiquadFilter();
      lowPassFilter.type = 'lowpass';
      lowPassFilter.frequency.setValueAtTime( options.lowPassCutoffFrequency, now );
    }

    // if specified, create the high-pass filter
    let highPassFilter;
    if ( options.highPassCutoffFrequency ) {
      highPassFilter = this.audioContext.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.setValueAtTime( options.highPassCutoffFrequency, now );
    }

    // if specified, create the band-pass filter
    if ( options.qFactor && options.centerFrequency ) {
      this.bandPassFilter = this.audioContext.createBiquadFilter();
      this.bandPassFilter.type = 'bandpass';
      this.bandPassFilter.frequency.setValueAtTime( options.centerFrequency, now );
      this.bandPassFilter.Q.setValueAtTime( options.qFactor, now );
    }

    // define the noise data
    const noiseBufferSize = NOISE_BUFFER_SECONDS * this.audioContext.sampleRate;
    this.noiseBuffer = this.audioContext.createBuffer( 1, noiseBufferSize, this.audioContext.sampleRate ); // @private
    const data = this.noiseBuffer.getChannelData( 0 );

    // fill in the sample buffer based on the noise type
    if ( options.noiseType === 'white' ) {
      for ( let i = 0; i < noiseBufferSize; i++ ) {
        data[ i ] = phet.joist.random.nextDouble() * 2 - 1;
      }
    }
    else if ( options.noiseType === 'pink' ) {
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      let b3 = 0;
      let b4 = 0;
      let b5 = 0;
      let b6 = 0;
      for ( let i = 0; i < noiseBufferSize; i++ ) {
        var white = phet.joist.random.nextDouble() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[ i ] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[ i ] *= 0.11; // adjust to 0dB, empirically determined, will be approximate due to randomness of data
        b6 = white * 0.115926;
      }
    }
    else if ( options.noiseType === 'brown' ) {
      var lastOut = 0;
      for ( let i = 0; i < noiseBufferSize; i++ ) {
        white = phet.joist.random.nextDouble() * 2 - 1;
        data[ i ] = ( lastOut + ( 0.02 * white ) ) / 1.02;
        lastOut = data[ i ];
        data[ i ] *= 3.5; // adjust to 0dB, empirically determined, will be approximate due to randomness of data
      }
    }
    else {
      throw new Error( 'unexpected value for noiseType: ' + options.noiseType );
    }

    // @private {AudioBufferSourceNode|null} - the source node from which the noise is played, set when play is called
    this.noiseSource = null;

    // @private {OscillatorNode} - a low frequency oscillator (LFO) for amplitude modulation
    this.lfo = this.audioContext.createOscillator();
    this.lfo.type = options.lfoType;

    // initialize LFO frequency, updated through methods defined below
    this.lfo.frequency.setValueAtTime( options.lfoInitialFrequency, now );
    this.lfo.start();

    // @private {GainNode} - a gain stage to attenuate the LFO output so that it will range from -0.5 to +0.5
    this.lfoAttenuatorGainNode = this.audioContext.createGain();
    this.lfoAttenuatorGainNode.gain.value = options.lfoInitialDepth / 2;
    this.lfo.connect( this.lfoAttenuatorGainNode );

    // @private {GainNode} - a gain stage for the LFO - the main sound path will run through here
    this.lfoControlledGainNode = this.audioContext.createGain();
    this.lfoControlledGainNode.gain.value = 0.5; // this value is added to the attenuated LFO output value

    // set the initial enabled state of the LFO
    if ( options.lfoInitiallyEnabled ) {
      this.lfoAttenuatorGainNode.gain.setTargetAtTime( 0.5, this.audioContext.currentTime, PARAMETER_CHANGE_TIME_CONSTANT );
      this.lfoAttenuatorGainNode.connect( this.lfoControlledGainNode.gain );
    }
    else {
      this.lfoAttenuatorGainNode.gain.setTargetAtTime( 1, this.audioContext.currentTime, PARAMETER_CHANGE_TIME_CONSTANT );
    }

    // wire up the audio path, working our way from the output back to the sound source(s)
    this.lfoControlledGainNode.connect( this.masterGainNode );
    let nextOutputToConnect = this.lfoControlledGainNode;
    if ( highPassFilter ) {
      highPassFilter.connect( nextOutputToConnect );
      nextOutputToConnect = highPassFilter;
    }
    if ( lowPassFilter ) {
      lowPassFilter.connect( nextOutputToConnect );
      nextOutputToConnect = lowPassFilter;
    }
    if ( this.bandPassFilter ) {
      this.bandPassFilter.connect( nextOutputToConnect );
      nextOutputToConnect = this.bandPassFilter;
    }

    // @private {AudioParam} - point where the noise source connects
    this.noiseSourceConnectionPoint = nextOutputToConnect;

    // @public (read-only) {boolean}
    this.isPlaying = false;

    // @private {number} - time at which a deferred play request occurred.
    this.timeOfDeferredStartRequest = Number.NEGATIVE_INFINITY;

    // @private {function} - callback for when audio context isn't in 'running' state, see usage
    this.audioContextStateChangeListener = state => {

      if ( state === 'running' && this.isPlaying ) {

        this.start();

        // automatically remove after firing
        audioContextStateChangeMonitor.removeStateChangeListener(
          this.audioContext,
          this.audioContextStateChangeListener
        );
      }
    };
  }

  tambo.register( 'NoiseGenerator', NoiseGenerator );

  inherit( SoundGenerator, NoiseGenerator, {

    /**
     * start the noise source
     * @param {number} [delay] - optional delay for when to start the noise source, in seconds
     */
    start: function( delay ) {

      if ( this.audioContext.state === 'running' ) {

        delay = ( delay === undefined ) ? 0 : delay;
        const now = this.audioContext.currentTime;

        // only do something if not already playing, otherwise ignore this request
        if ( !this.isPlaying ) {
          this.noiseSource = this.audioContext.createBufferSource();
          this.noiseSource.buffer = this.noiseBuffer;
          this.noiseSource.loop = true;
          this.noiseSource.connect( this.noiseSourceConnectionPoint );
          this.noiseSource.start( now + delay );
        }
      }
      else {

        // This method was called when the audio context was not yet running, so add a listener to start if and when the
        // audio context state changes.
        this.timeOfDeferredStartRequest = Date.now();
        if ( !audioContextStateChangeMonitor.hasListener( this.audioContext, this.audioContextStateChangeListener ) ) {
          audioContextStateChangeMonitor.addStateChangeListener(
            this.audioContext,
            this.audioContextStateChangeListener
          );
        }
      }

      // set the flag even if the start is deferred, since it is used to decide whether to do a deferred start
      this.isPlaying = true;
    },

    /**
     * stop the noise source
     * @param {number} [time] - optional audio context time at which this should be stopped
     */
    stop: function( time ) {

      time = time === undefined ? this.audioContext.currentTime : time;

      // only stop if playing, otherwise ignore
      if ( this.isPlaying && this.noiseSource ) {
        this.noiseSource.stop( time );
        this.noiseSource = null;
      }
      this.isPlaying = false;
    },

    /**
     * set the frequency of the low frequency amplitude modulator (LFO)
     * @public
     */
    setLfoFrequency: function( frequency ) {
      this.lfo.frequency.setTargetAtTime( frequency, this.audioContext.currentTime, PARAMETER_CHANGE_TIME_CONSTANT );
    },

    /**
     * @param {number} depth - depth value from 0 (no modulation) to 1 (max modulcaiton)
     * @public
     */
    setLfoDepth: function( depth ) {
      this.lfoAttenuatorGainNode.gain.setTargetAtTime( depth / 2, this.audioContext.currentTime, LFO_DEPTH_CHANGE_TIME_CONSTANT );
    },

    /**
     * turn the low frequency amplitude modulation on/off
     * @param {boolean} enabled
     */
    setLfoEnabled: function( enabled ) {
      if ( enabled ) {
        this.lfoAttenuatorGainNode.gain.setTargetAtTime( 0.5, this.audioContext.currentTime, PARAMETER_CHANGE_TIME_CONSTANT );
        this.lfoAttenuatorGainNode.connect( this.lfoControlledGainNode.gain );
      }
      else {
        this.lfoAttenuatorGainNode.disconnect( this.lfoControlledGainNode.gain );
        this.lfoAttenuatorGainNode.gain.setTargetAtTime( 1, this.audioContext.currentTime, PARAMETER_CHANGE_TIME_CONSTANT );
      }
    },

    /**
     * set the Q value for the band pass filter, assumes that noise generator was created with this filter enabled
     * @param frequency
     * @param timeConstant
     */
    setBandpassFilterCenterFrequency: function( frequency, timeConstant ) {
      timeConstant = timeConstant || PARAMETER_CHANGE_TIME_CONSTANT;
      this.bandPassFilter.frequency.setTargetAtTime( frequency, this.audioContext.currentTime, timeConstant );
    }
  } );

  return NoiseGenerator;
} );
