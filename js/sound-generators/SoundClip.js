// Copyright 2018, University of Colorado Boulder

/**
 * A sound generator that plays pre-recorded sounds, either as a one-shot or as a loop.
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
  // it may work perfectly forever (one can only hope).  See https://github.com/phetsims/tambo/issues/35.
  var AUDIO_DATA_THRESHOLD = 0.05;

  /**
   * @param {Object} soundInfo - An object that includes *either* a url that points to the sound to be played *or* a
   * base64-encoded version of the sound data.  The former is generally used when a sim is running in RequireJS mode,
   * the latter is used in built versions.
   * @param {Object} [options]
   * @constructor
   */
  function SoundClip( soundInfo, options ) {

    var self = this;

    options = _.extend( {

      // Should this sound be played repetitively, or just once (i.e. a one-shot sound)?
      loop: false,

      // Should silence at the beginning and, in the case of loops, the end be removed?
      trimSilence: true,

      // This option controls whether sound generation can be initiated when this sound generator is disabled.  This
      // is useful for a one-shot sound that is long, so if the user does something that generally would cause a sound,
      // but sound is disabled, but they immediately re-enable it, the "tail" of this sound would be heard.  This option
      // should never be set for false for loops, since loops always allow initiation when disabled.
      initiateWhenDisabled: true

    }, options );
    SoundGenerator.call( this, options );

    // options checking
    assert && assert( !options.loop || options.initiateWhenDisabled, 'initiateWhenDisabled must be true for loops' );

    // @private {boolean} - flag that controls whether this is a one-shot or loop sound
    this.loop = options.loop;

    // @public {boolean} - see description in options above
    this.initiateWhenDisabled = options.initiateWhenDisabled;

    // @private {AudioBuffer} - decoded audio data in a form that is ready to play with Web Audio
    this.audioBuffer = null;

    // @private {function} - function to be invoked when sound buffer finishes loading
    this.loadCompleteAction = null;

    // @private {number} - start and end points for the loop if this clip is used for looping
    this.loopStart = 0;
    this.loopEnd = null;

    // @private {AudioBufferSourceNode[]} - a list of active source buffer nodes, used so that this clip can be played
    // again before previous play finishes
    this.activeBufferSources = [];

    // @private {GainNode} - a gain node that is used to prevent clicks when stopping the sound
    this.localGainNode = this.audioContext.createGain();
    this.localGainNode.connect( this.masterGainNode );

    // decode the audio data and place it in a sound buffer so it can be easily played
    soundInfoDecoder.decode(
      soundInfo,
      this.audioContext,
      function( decodedAudioData ) {

        self.audioBuffer = decodedAudioData;

        if ( options.trimSilence ) {
          var loopBoundsInfo = detectLoopBounds( decodedAudioData );
          self.loopStart = loopBoundsInfo.loopStart;
          self.loopEnd = loopBoundsInfo.loopEnd;
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

    // @private {number} - rate at which clip is being played back
    this.playbackRate = 1;

    // @private {boolean} - flag that tracks whether the sound is being played
    this._isPlaying = false;

    // listen to the property that indicates whether we are fully enabled and stop one-shot sounds when it goes false
    this.fullyEnabledProperty.lazyLink( function( fullyEnabled ) {
      if ( !self.loop && !fullyEnabled ) {
        self.stop();
      }
    } );
  }

  /**
   * helper function to find the point at which a sound starts given a threshold and a buffer of sound data
   */
  function findSoundStartIndex( soundData, length, threshold ) {

    // find the first occurrence of the threshold that is trending in the up direction
    var startThresholdIndex = 0;
    var dataIndex;
    var found = false;
    for ( dataIndex = 0; dataIndex < length - 1 && !found; dataIndex++ ) {
      if ( soundData[ dataIndex ] > threshold && soundData[ dataIndex + 1 ] > soundData[ dataIndex ] ) {
        startThresholdIndex = dataIndex;
        found = true;
      }
    }
    logLoopAnalysisInfo( 'startThresholdIndex = ' + startThresholdIndex );

    // work backwards from the first threshold found to find the first zero or zero crossing
    var soundStartIndex = 0;
    found = false;
    for ( dataIndex = startThresholdIndex; dataIndex > 0 && !found; dataIndex-- ) {
      var value = soundData[ dataIndex ];
      if ( value <= 0 ) {
        soundStartIndex = value === 0 ? dataIndex : dataIndex + 1;
        found = true;
      }
    }
    logLoopAnalysisInfo( 'soundStartIndex = ' + soundStartIndex );

    // detect and log the peaks in the pre-start data, useful for determining what the threshold value should be
    var maxPreStartPeak = 0;
    var minPreStartPeak = 0;
    for ( dataIndex = 0; dataIndex < soundStartIndex; dataIndex++ ) {
      maxPreStartPeak = Math.max( maxPreStartPeak, soundData[ dataIndex ] );
      minPreStartPeak = Math.min( minPreStartPeak, soundData[ dataIndex ] );
    }
    logLoopAnalysisInfo( 'maxPreStartPeak = ' + maxPreStartPeak );
    logLoopAnalysisInfo( 'minPreStartPeak = ' + minPreStartPeak );

    return soundStartIndex;
  }

  /**
   * helper function to find the point at which a sound ends given a threshold and a buffer of sound data
   */
  function findSoundEndIndex( soundData, length, threshold ) {

    // work backwards from the end of the data to find the first negative occurance of the threshold
    var endThresholdIndex = length - 1;
    var found = false;
    var dataIndex;
    for ( dataIndex = length - 1; dataIndex > 0 && !found; dataIndex-- ) {
      if ( soundData[ dataIndex ] <= -threshold && soundData[ dataIndex - 1 ] < soundData[ dataIndex ] ) {
        endThresholdIndex = dataIndex;
        found = true;
      }
    }

    logLoopAnalysisInfo( 'endThresholdIndex = ' + endThresholdIndex );

    // work forward from the end threshold to find a zero or zero crossing that can work as the end of the loop
    var soundEndIndex = endThresholdIndex;
    found = false;
    for ( dataIndex = endThresholdIndex; dataIndex < length - 1 && !found; dataIndex++ ) {
      if ( soundData[ dataIndex + 1 ] >= 0 ) {
        soundEndIndex = dataIndex;
        found = true;
      }
    }
    logLoopAnalysisInfo( 'soundEndIndex = ' + soundEndIndex );

    // detect and log the peaks in the post-end data, useful for determining what the threshold value should be
    var maxPostEndPeak = 0;
    var minPostEndPeak = 0;
    for ( dataIndex = soundEndIndex; dataIndex < length; dataIndex++ ) {
      maxPostEndPeak = Math.max( maxPostEndPeak, soundData[ dataIndex ] );
      minPostEndPeak = Math.min( minPostEndPeak, soundData[ dataIndex ] );
    }
    logLoopAnalysisInfo( 'maxPostEndPeak = ' + maxPostEndPeak );
    logLoopAnalysisInfo( 'minPostEndPeak = ' + minPostEndPeak );

    return soundEndIndex;
  }

  /**
   * helper function that sets the start and end points for looping based on where the sound data starts and ends
   * {AudioBuffer} soundClip
   * @returns {Object} - an object with values for loopStart and loopEnd
   */
  function detectLoopBounds( audioBuffer ) {
    logLoopAnalysisInfo( '------------- entered detectLoopBounds --------------------' );

    var soundDataLength = audioBuffer.length;
    var loopStartIndexes = [];
    var loopEndIndexes = [];

    // TODO: Need to do for all channels
    for ( var channelNumber = 0; channelNumber < audioBuffer.numberOfChannels; channelNumber++ ) {

      // initialize some variables that will be used to analyze the data
      var soundData = audioBuffer.getChannelData( channelNumber );

      // find a good point for the loop to start
      loopStartIndexes[ channelNumber ] = findSoundStartIndex( soundData, soundDataLength, AUDIO_DATA_THRESHOLD );

      // find a good point for the loop to end
      loopEndIndexes[ channelNumber ] = findSoundEndIndex( soundData, soundDataLength, AUDIO_DATA_THRESHOLD );
    }

    // return an object with values for where the loop should start and end
    var sampleRate = audioBuffer.sampleRate;
    return {
      loopStart: _.min( loopStartIndexes ) / sampleRate,
      loopEnd: _.max( loopEndIndexes ) / sampleRate
    };
  }

  /**
   * helper function for logging sound analysis information if said logging is enabled, useful for debugging
   * @param string
   */
  function logLoopAnalysisInfo( string ) {
    if ( TamboQueryParameters.logLoopAnalysisInfo ) {
      console.log( string );
    }
  }

  tambo.register( 'SoundClip', SoundClip );

  return inherit( SoundGenerator, SoundClip, {

    /**
     * function to start playing the sound
     * @param {number} [delay] - optional delay parameter
     * @public
     */
    play: function( delay ) {

      var now = this.audioContext.currentTime;

      // default delay is zero
      delay = typeof delay === 'undefined' ? 0 : delay;

      var self = this;
      if ( this.initiateWhenDisabled || this.fullyEnabled ) {

        // make sure the decoding of the audio data is complete before trying to play the sound
        if ( this.audioBuffer ) {

          // make sure the local gain is set to unity value
          this.localGainNode.gain.setValueAtTime( 1, now );

          // create an audio buffer source node and connect it to the previously decoded audio data
          var bufferSource = this.audioContext.createBufferSource();
          bufferSource.buffer = this.audioBuffer;
          bufferSource.loop = this.loop;
          bufferSource.loopStart = this.loopStart;
          if ( this.loopEnd ) {
            bufferSource.loopEnd = this.loopEnd;
          }

          // connect this source node to the output
          bufferSource.connect( this.localGainNode );

          // add this to the list of active sources so that it can be stopped if necessary
          this.activeBufferSources.push( bufferSource );

          if ( !this.loop ) {

            // add a handler for when the sound finishes playing
            bufferSource.onended = function() {

              // remove the source from the list of active sources
              var indexOfSource = self.activeBufferSources.indexOf( bufferSource );
              if ( indexOfSource > -1 ) {
                self.activeBufferSources.splice( indexOfSource );
              }
              self._isPlaying = self.activeBufferSources.length > 0;
            };
          }

          // set the playback rate and start playback
          bufferSource.playbackRate.setValueAtTime( this.playbackRate, now );
          bufferSource.start( now + delay );
          this._isPlaying = true;
        }
        else {

          // the play method was called before the sound buffer finished loading, create an action that play the sound
          // once the loading has completed
          this.loadCompleteAction = function() { self.play(); };
        }
      }
    },

    /**
     * stop playing the sound
     */
    stop: function() {

      // make sure the decoding of the audio data has completed before stopping anything
      if ( this.audioBuffer ) {

        // Simply calling stop() on the buffer source frequently causes an audible click, so we use a gain node and turn
        // down the gain quickly, effectively doing a very fast fade out, and then stop playback. The values for the
        // time constant and stop time were empirically determined.
        var now = this.audioContext.currentTime;
        this.localGainNode.gain.setTargetAtTime( 0, now, 0.01 );
        this.activeBufferSources.forEach( function( source ) {
          source.stop( now + 0.1 );
        } );

        // The WebAudio spec is a bit unclear about whether stopping a sound will trigger an onended event.  In testing
        // on Chrome in September 2018, I (jbphet) found that onended was NOT being fired when stop() was called, so the
        // code below is needed to clear the array of all active buffer sources.
        this.activeBufferSources.length = 0;

        // clear the flag
        this._isPlaying = false;
      }
      else {

        // this was called before the sound finished loading, cancel any previously created actions
        this.loadCompleteAction = null;
      }
    },

    /**
     * play sound and change the speed as playback occurs
     * @param {number} playbackRate - desired playback speed, 1 = normal speed
     * @param {number} [timeConstant] -  time-constant value of first-order filter (exponential) approach to the target
     * value. The larger this value is, the slower the transition will be.
     */
    setPlaybackRate: function( playbackRate, timeConstant ) {
      var self = this;
      timeConstant = timeConstant || SoundGenerator.DEFAULT_TIME_CONSTANT;
      this.activeBufferSources.forEach( function( bufferSource ) {
        bufferSource.playbackRate.setTargetAtTime( playbackRate, self.audioContext.currentTime, timeConstant );
      } );
      this.playbackRate = playbackRate;
    },

    /**
     * indicates whether sound is currently being played
     * @return {boolean}
     */
    get isPlaying() {
      return this._isPlaying;
    }

  } );
} );