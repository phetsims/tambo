// Copyright 2018, University of Colorado Boulder

/**
 * abstract base type for a sound generator that uses recorded sounds
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  var soundInfoDecoder = require( 'TAMBO/soundInfoDecoder' );
  var tambo = require( 'TAMBO/tambo' );
  var TamboQueryParameters = require( 'TAMBO/TamboQueryParameters' );

  // constants

  // This threshold is used for analyzing the decoded sound data for where a loop that is intended to continuously
  // generate sound should start and end.  Its value was determined through experimentation on a single loop
  // (charges-in-body) at a number of different encodings.  It may need to be refined over time as we add new loops.  Or
  // it may work great forever (one can only hope).  See https://github.com/phetsims/tambo/issues/35.
  var AUDIO_DATA_THRESHOLD = 0.01;

  /**
   * @param {Object} soundInfo - An object that includes *either* a url that points to the sound to be played *or* a
   * base64-encoded version of the sound data.  The former is generally used when a sim is running in RequireJS mode,
   * the latter is used in built versions.
   * @param {Object} [options]
   * @constructor
   */
  function SoundClip( soundInfo, options ) {

    var self = this;

    _.extend( {
      autoDetectLoopBounds: false
    }, options );
    SoundGenerator.call( this, options );

    // @protected {AudioBuffer} - sound data in a form that is ready to play with Web Audio
    this.soundBuffer = null;

    // @protected {function} - function to be invoked when sound buffer finishes loading
    this.loadCompleteAction = null;

    // @protected {number} - start and end points for the loop if this clip is used for looping
    this.loopStart = 0;
    this.loopEnd = null;

    // decode the audio data and place it in a sound buffer so it can be easily played
    soundInfoDecoder.decode(
      soundInfo,
      this.audioContext,
      function( decodedAudioData ) {

        self.soundBuffer = decodedAudioData;

        if ( options.autoDetectLoopBounds ) {
          autoSetLoopPoints( self );
        }

        // perform the "load complete" actions, if any
        self.loadCompleteAction && self.loadCompleteAction();
        self.loadCompleteAction = null;
      },
      function() {

        // we haven't seen this happen, so for now a message is logged to the console and that's it
        console.log( 'Error: Unable to decode audio data.' );
      }
    );

    // @protected {number} - rate at which clip is being played back
    this.playbackRate = 1;
  }

  /**
   * helper function that sets the start and end points for looping based on where the sound data starts and ends
   * {SoundClip} soundClip
   */
  function autoSetLoopPoints( soundClip ) {
    logLoopAnalysisInfo( '------------- analyzing buffer data --------------------' );

    // TODO: Need to do for all channels
    // initialize some variable that will be used to analyze the data
    var dataLength = soundClip.soundBuffer.length;
    var data = soundClip.soundBuffer.getChannelData( 0 );
    var dataIndex;

    // find the first occurrence of the threshold that is trending in the up direction
    var startThresholdIndex = 0;
    var found = false;
    for ( dataIndex = 0; dataIndex < dataLength - 1 && !found; dataIndex++ ) {
      if ( data[ dataIndex ] > AUDIO_DATA_THRESHOLD && data[ dataIndex + 1 ] > data[ dataIndex ] ) {
        startThresholdIndex = dataIndex;
        found = true;
      }
    }
    logLoopAnalysisInfo( 'startThresholdIndex = ' + startThresholdIndex );

    // work backwards from the first threshold found to find the first zero or zero crossing
    var loopStartIndex = 0;
    found = false;
    for ( dataIndex = startThresholdIndex; dataIndex > 0 && !found; dataIndex-- ) {
      if ( data[ dataIndex ] <= 0 ) {
        loopStartIndex = dataIndex;
        found = true;
      }
    }
    logLoopAnalysisInfo( 'loopStartIndex = ' + loopStartIndex );

    // detect and log the peaks in the pre-start data, useful for determining what the threshold value should be
    var maxPreStartPeak = 0;
    var minPreStartPeak = 0;
    for ( dataIndex = 0; dataIndex < loopStartIndex; dataIndex++ ) {
      maxPreStartPeak = Math.max( maxPreStartPeak, data[ dataIndex ] );
      minPreStartPeak = Math.min( minPreStartPeak, data[ dataIndex ] );
    }
    logLoopAnalysisInfo( 'maxPreStartPeak = ' + maxPreStartPeak );
    logLoopAnalysisInfo( 'minPreStartPeak = ' + minPreStartPeak );

    // work backwards from the end of the data to find the first negative occurance of the threshold
    var endThresholdIndex = dataLength - 1;
    found = false;
    for ( dataIndex = dataLength - 1; dataIndex > 0 && !found; dataIndex-- ) {
      if ( data[ dataIndex ] <= -AUDIO_DATA_THRESHOLD && data[ dataIndex - 1 ] < data[ dataIndex ] ) {
        endThresholdIndex = dataIndex;
        found = true;
      }
    }

    logLoopAnalysisInfo( 'endThresholdIndex = ' + endThresholdIndex );

    // work forward from the end threshold to find a zero or zero crossing that can work as the end of the loop
    var loopEndIndex = endThresholdIndex;
    found = false;
    for ( dataIndex = endThresholdIndex; dataIndex < dataLength - 1 && !found; dataIndex++ ) {
      if ( data[ dataIndex + 1 ] >= 0 ) {
        loopEndIndex = dataIndex;
        found = true;
      }
    }
    logLoopAnalysisInfo( 'loopEndIndex = ' + loopEndIndex );

    // detect and log the peaks in the post-end data, useful for determining what the threshold value should be
    var maxPostEndPeak = 0;
    var minPostEndPeak = 0;
    for ( dataIndex = loopEndIndex; dataIndex < dataLength; dataIndex++ ) {
      maxPostEndPeak = Math.max( maxPostEndPeak, data[ dataIndex ] );
      minPostEndPeak = Math.min( minPostEndPeak, data[ dataIndex ] );
    }
    logLoopAnalysisInfo( 'maxPostEndPeak = ' + maxPostEndPeak );
    logLoopAnalysisInfo( 'minPostEndPeak = ' + minPostEndPeak );

    // set the loop start and end points based on what was detected
    var sampleRate = soundClip.soundBuffer.sampleRate;
    soundClip.loopStart = loopStartIndex / sampleRate;
    soundClip.loopEnd = loopEndIndex / sampleRate;
  }

  // function that only logs if the appropriate query param is enabled
  function logLoopAnalysisInfo( string ) {
    if ( TamboQueryParameters.logLoopAnalysisInfo ) {
      console.log( string );
    }
  }

  tambo.register( 'SoundClip', SoundClip );

  inherit( SoundGenerator, SoundClip, {

    /**
     * play sound and change the speed as playback occurs
     * @param {number} playbackRate - desired playback speed, 1 = normal speed
     * @param {number} [timeConstant] -  time-constant value of first-order filter (exponential) approach to the target
     * value. The larger this value is, the slower the transition will be.
     */
    setPlaybackRate: function( playbackRate, timeConstant ) {
      timeConstant = timeConstant || SoundGenerator.DEFAULT_TIME_CONSTANT;
      if ( this.source ) {
        this.source.playbackRate.setTargetAtTime( playbackRate, this.audioContext.currentTime, timeConstant );
      }
      this.playbackRate = playbackRate;
    }
  } );

  return SoundClip;
} );