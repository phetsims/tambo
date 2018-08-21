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

      // In seconds.  This option can be used to trim the beginning, or 'leader' portion, of a sound file.  This is
      // mostly useful for loops, since many MP3 encoders insert silence at the front of an encoded file, which leads to
      // an audible gap when the loop starts over (see https://github.com/phetsims/tambo/issues/30).  The value should
      // be determined by examining the encoded sound file in an audio editor and determine how much of the leader
      // consists of silence.  For files encoded using Audacity and the LAME encoder, a value around 0.47 (seconds) has
      // generally worked well.
      leaderTrimAmount: 0
    }, options );
    SoundGenerator.call( this, options );

    // @protected {AudioBufferSourceNode} - sound data in a form that is ready to play with Web Audio
    this.soundBuffer = null;

    // @protected {function} - function to be invoked when sound buffer finishes loading
    this.loadCompleteAction = null;

    // decode the audio data and place it in a sound buffer so it can be easily played
    soundInfoDecoder.decode(
      soundInfo,
      this.audioContext,
      function( decodedAudioData ) {

        // If specified, trim the beginning of the decoded audio data.  This is generally done to remove silence, see
        // the option description above for more information.
        if ( options.leaderTrimAmount > 0 ) {

          var channelData = decodedAudioData.getChannelData( 0 );
          var startIndex = Math.round( options.leaderTrimAmount * decodedAudioData.sampleRate );

          // create a new audio buffer where the trimmed data will go
          var trimmedAudioBuffer = self.audioContext.createBuffer(
            decodedAudioData.numberOfChannels,
            decodedAudioData.length - startIndex,
            decodedAudioData.sampleRate
          );

          // copy the data from the originally decoding into the trimmed buffer
          for ( var channel = 0; channel < trimmedAudioBuffer.numberOfChannels; channel++ ) {
            var soundDataBuffer = trimmedAudioBuffer.getChannelData( channel );
            for ( var i = 0; i < trimmedAudioBuffer.length; i++ ) {
              soundDataBuffer[ i ] = channelData[ i + startIndex ];
            }
          }
          self.soundBuffer = trimmedAudioBuffer;
        }
        else {
          self.soundBuffer = decodedAudioData;
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