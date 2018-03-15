// Copyright 2018, University of Colorado Boulder

/**
 * sound generator that plays pre-recorded sound clips
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var tambo = require( 'TAMBO/tambo' );

  // constants
  var DEFAULT_TC = 0.015;

  /**
   * @param {String} soundUrl - URL of the sound file (mp3, wev, etc.) to be played
   * @param {Object} options
   * @constructor
   */
  function SoundClip( soundUrl, options ) {

    options = _.extend( {

      // the audio context can be supplied if desired, which is useful since there is a per-tab limit on these
      audioContext: null,

      initialOutputLevel: 1,
      loop: false,
      connectImmediately: false
    }, options );
    this.options = options;

    // if the client didn't specify an audio context, create one
    this.audioContext = options.audioContext || new ( window.AudioContext || window.webkitAudioContext )();

    // @private - keep track of listeners to be played when a sound is finished playing
    this.soundEndedListeners = [];

    // @private {number}
    this.playbackRate = 1;

    // set up needed variables
    var self = this;
    this.soundBuffer = null;
    this.activeSources = [];

    // load the sound
    this.request = new XMLHttpRequest();
    this.request.open( 'GET', soundUrl, true );
    this.request.responseType = 'arraybuffer';

    function onError( err ) {

      // TODO: The throwing of the error is commented out, since this was having issues in built version, which perhaps
      // isn't surprising since it's loading base64 in that case.
      // throw new Error( 'error loading sound ' + soundUrl + ', url: ' + ', err: ' + err );
      console.log( 'error loading sound ' + soundUrl + ', url: ' + ', err: ' + err );
    }

    // @private {function} - function to be invoked when sound buffer finishes loading
    this.loadCompleteAction = null;

    // decode the sound asynchronously
    this.request.onload = function() {
      self.audioContext.decodeAudioData(
        self.request.response,
        function( buffer ) {
          self.soundBuffer = buffer;
          self.loadCompleteAction && self.loadCompleteAction();
          self.loadCompleteAction = null;
        },
        onError
      );
    };
    this.request.send();

    // define a master gain control that can be used to control the playback volume of the sound
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.gain.setTargetAtTime(
      options.initialOutputLevel,
      this.audioContext.currentTime,
      DEFAULT_TC
    );
    if ( options.connectImmediately ) {
      this.masterGainNode.connect( this.audioContext.destination );
    }

    // @private {boolean}
    this.enabled = true;

    // @private {number}
    this.outputLevel = options.initialOutputLevel;
  }

  tambo.register( 'SoundClip', SoundClip );

  return inherit( Object, SoundClip, {

    /**
     * @param {AudioParam} audioParam
     * @public
     */
    connect: function( audioParam ) {
      this.masterGainNode.connect( audioParam );
    },

    /**
     * function to start playing of the sound
     * @param {number} delay - number of seconds before the sound should be played
     * TODO: Consider removing the delay attribute.  I (jbphet) think it was added to support BAA, but I don't think we want it in general
     */
    play: function( delay ) {

      if ( !this.enabled && !this.options.loop ) {

        // ignore the play request
        return;
      }

      var self = this;

      // delay is set to zero if not provided
      if ( typeof( delay ) === 'undefined' ) {
        delay = 0;
      }

      if ( this.soundBuffer ) {

        // TODO: Do we really need to do all of this every time to play the sound, or can some of it be set up in constructor?
        var source = this.audioContext.createBufferSource();
        source.buffer = this.soundBuffer;
        source.connect( this.masterGainNode );
        this.activeSources.push( source );
        source.onended = function() {

          // remove the source from the list of active sources
          var indexOfSource = self.activeSources.indexOf( source );
          if ( indexOfSource > -1 ) {
            self.activeSources.splice( indexOfSource );
          }

          if ( self.soundEndedListeners.length > 0 ) {
            for ( var i = 0; i < self.soundEndedListeners.length; i++ ) {
              self.soundEndedListeners[ i ]();
            }
          }
        };
        source.loop = this.options.loop;
        var now = this.audioContext.currentTime;
        source.playbackRate.setValueAtTime( this.playbackRate, now );
        source.start( now + delay );
        this.source = source; // @private - make this available to other methods
      }
      else {

        // the play method was called before the sound buffer finished loading, create an action that play the sound
        // once the loading has completed
        this.loadCompleteAction = function(){ self.play( delay ); };
      }
    },

    /**
     * function to stop playing of the sound
     */
    stop: function() {
      if ( this.soundBuffer ) {
        this.activeSources.forEach( function( source ) {
          source.stop();
        } );
        this.activeSources = [];
      }
      else {

        // this was called before the sound finished loading, cancel any previously created actions
        this.loadCompleteAction = null;
      }
    },

    /**
     * function that returns true if the clip is playing, false if not
     * @returns {boolean}
     */
    isPlaying: function() {
      return this.activeSources.length > 0;
    },

    /**
     * play sound and change the speed as playback occurs
     * @param {number} finalSpeed - final playback speed, 1 = normal speed
     * @param {number} preChangeDelay - amount of time for change to occur in seconds
     * @param {number} [timeConstant] -  time-constant value of first-order filter (exponential) approach to the target
     * value. The larger this value is, the slower the transition will be.
     * TODO: This method should probably be removed when this is ported to main PhET code base.
     */
    playWithSpeedChange: function( finalSpeed, preChangeDelay, timeConstant ) {
      timeConstant = timeConstant || DEFAULT_TC;
      this.play( 0 );
      var now = this.audioContext.currentTime;
      this.source.playbackRate.setTargetAtTime( finalSpeed, now + preChangeDelay, timeConstant );
    },

    /**
     * play sound and change the speed as playback occurs
     * @param {number} playbackSpeed - desired playback speed, 1 = normal speed
     * @param {number} [timeConstant] -  time-constant value of first-order filter (exponential) approach to the target
     * value. The larger this value is, the slower the transition will be.
     */
    setPlaybackSpeed: function( playbackSpeed, timeConstant ) {
      timeConstant = timeConstant || DEFAULT_TC;
      if ( this.source ) {
        this.source.playbackRate.setTargetAtTime( playbackSpeed, this.audioContext.currentTime, timeConstant );
      }
      this.playbackRate = playbackSpeed;
    },

    /**
     * set outputLevel of the playing sound
     * @param {number} outputLevel - between 0 and 1.
     * @param {number} [timeConstant] - time constant for outputLevel change, see AudioParam.setTargetAtTime
     */
    setOutputLevel: function( outputLevel, timeConstant ) {
      outputLevel = Math.max( 0, outputLevel );
      outputLevel = Math.min( 1, outputLevel );
      this.outputLevel = outputLevel;
      if ( this.enabled ) {
        this.masterGainNode.gain.setTargetAtTime(
          outputLevel,
          this.audioContext.currentTime,
          timeConstant || DEFAULT_TC
        );
      }
    },

    /**
     * @return {number}
     */
    getOutputLevel: function() {
      return this.outputLevel;
    },

    /**
     * Set this sound clip to be enabled or disabled.  This uses the master gain node so that if the sound is looping
     * it can be easily re-enabled without having to restart the sound.
     * @param {boolean} enabled
     * @public
     */
    setEnabled: function( enabled ) {
      if ( this.enabled !== enabled ) {
        var now = this.audioContext.currentTime;
        if ( this.options.loop ) {

          // if this sound clip is a loop, just manipulate the output level so that it doesn't have to restart
          if ( enabled ) {
            this.masterGainNode.gain.setTargetAtTime( this.outputLevel, now, DEFAULT_TC );
          }
          else {
            this.masterGainNode.gain.setTargetAtTime( 0, now, DEFAULT_TC );
          }
        }
        else {
          this.stop();
        }
        this.enabled = enabled;
      }
    }

  } );

} );