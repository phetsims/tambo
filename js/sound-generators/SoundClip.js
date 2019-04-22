// Copyright 2018-2019, University of Colorado Boulder

/**
 * A sound generator that plays pre-recorded sounds, either as a one-shot or as a loop.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const audioContextStateChangeMonitor = require( 'TAMBO/audioContextStateChangeMonitor' );
  const inherit = require( 'PHET_CORE/inherit' );
  const soundConstants = require( 'TAMBO/soundConstants' );
  const SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  const soundInfoDecoder = require( 'TAMBO/soundInfoDecoder' );
  const SoundUtil = require( 'TAMBO/SoundUtil' );
  const tambo = require( 'TAMBO/tambo' );

  // constants
  const MAX_PLAY_DEFER_TIME = 0.2; // seconds, max time to defer a play request while waiting for audio context state change
  const DEFAULT_TC = soundConstants.DEFAULT_PARAM_CHANGE_TIME_CONSTANT;

  /**
   * @param {Object} soundInfo - An object that includes *either* a "url" key with a value that points to the sound to
   * be played *or* a "base64" key with a value that represents a base64-encoded version of the sound data.  The former
   * is generally used when a sim is running in RequireJS mode, the latter is used in built versions.
   * @param {Object} [options]
   * @constructor
   */
  function SoundClip( soundInfo, options ) {

    options = _.extend( {

      // {boolean} - controls whether this sound will wrap around and start over when done or just be played once
      loop: false,

      // {boolean} - controls whether the silence at the beginning and (in the case of loops) the end is removed
      trimSilence: true,

      // {boolean} - controls whether sound generation can be initiated when this sound generator is disabled.  This is
      // useful for a one-shot sound that is long, so if the user does something that generally would cause a sound, but
      // sound is disabled, but they immediately re-enable it, the "tail" of this sound would be heard.  This option is
      // ignored for loops, since loops always allow initiation when disabled.
      initiateWhenDisabled: false,

      // {boolean} - controls whether changes to the playback rate via the API causes changes to the sounds that are
      // already in the process of playing or only those that are played in the future.  This is relevant for both loops
      // and one-shot sounds, since a one-shot sound (especially one that is fairly long) could be in the process of
      // playing when a playback rate change occurs.
      rateChangesAffectPlayingSounds: true
    }, options );

    SoundGenerator.call( this, options );

    // @private {boolean} - flag that controls whether this is a one-shot or loop sound
    this.loop = options.loop;

    // @private {boolean} - flag that controls whether changes to the playback rate affects in-progress sounds
    this.rateChangesAffectPlayingSounds = options.rateChangesAffectPlayingSounds;

    // @public {boolean} - see description in options above
    this.initiateWhenDisabled = options.initiateWhenDisabled;

    // @private {AudioBuffer} - decoded audio data in a form that is ready to play with Web Audio
    this.audioBuffer = null;

    // @private {function} - function to be invoked when sound buffer finishes loading
    this.loadCompleteAction = null;

    // @private {number} - start and end points for the loop if this clip is used for looping
    this.soundStart = 0;
    this.soundEnd = null;

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
      decodedAudioData => {

        this.audioBuffer = decodedAudioData;

        if ( options.trimSilence ) {
          const loopBoundsInfo = SoundUtil.detectSoundBounds( decodedAudioData );
          this.soundStart = loopBoundsInfo.soundStart;
          this.soundEnd = loopBoundsInfo.soundEnd;
        }

        // perform the "load complete" actions, if any
        this.loadCompleteAction && this.loadCompleteAction();
        this.loadCompleteAction = null;
      },
      () => {

        // This is the error case for audio decode.  We have not seen this happen, but presumably a corrupted audio file
        // could cause it.  There is handling for both the RequireJS and build cases.
        assert && assert( false, 'audio decode failed' );
        console.error( 'unable to decode audio data, please check all encoded audio' );
      }
    );

    // @private {number} - rate at which clip is being played back, 1 is normal, above 1 is faster, below 1 is slower,
    // see online docs for AudioBufferSourceNode.playbackRate for more information
    this.playbackRate = 1;

    // @private {boolean} - flag that tracks whether the sound is being played
    this._isPlaying = false;

    // @private {number} - time at which a deferred play request occurred, in milliseconds since epoch
    this.timeOfDeferredPlayRequest = Number.NEGATIVE_INFINITY;

    // @private {function} - callback for when audio context isn't in 'running' state, see usage
    this.audioContextStateChangeListener = state => {

      if ( state === 'running' ) {

        // initiate deferred play if this is a loop or if it hasn't been too long since the request was made
        if ( this.loop || ( Date.now() - this.timeOfDeferredPlayRequest ) / 1000 < MAX_PLAY_DEFER_TIME ) {

          // Play the sound, but with a little bit of delay.  The delay was found to be needed because otherwise on
          // some browsers the sound would be somewhat muted, probably due to some sort of fade in of the audio levels
          // that the browser does automatically to avoid having the web page's sound start too abruptly.  The amount of
          // delay was empirically determined by testing on multiple browsers.
          this.play( 0.05 );
        }

        // automatically remove after firing
        audioContextStateChangeMonitor.removeStateChangeListener(
          this.audioContext,
          this.audioContextStateChangeListener
        );
      }
    };

    // listen to the Property that indicates whether we are fully enabled and stop one-shot sounds when it goes false
    this.fullyEnabledProperty.lazyLink( fullyEnabled => {
      if ( !this.loop && !fullyEnabled ) {
        this.stop();
      }
    } );
  }

  tambo.register( 'SoundClip', SoundClip );

  return inherit( SoundGenerator, SoundClip, {

    /**
     * start playing the sound
     * @param {number} [delay] - optional delay parameter, in seconds
     * @public
     */
    play: function( delay ) {

      if ( this.audioContext.state === 'running' ) {

        const now = this.audioContext.currentTime;

        // default delay is zero
        delay = typeof delay === 'undefined' ? 0 : delay;

        if ( ( this.loop && this.fullyEnabled && !this._isPlaying ) ||
             ( !this.loop && ( this.fullyEnabled || this.initiateWhenDisabled ) ) ) {

          // make sure the decoding of the audio data is complete before trying to play the sound
          if ( this.audioBuffer ) {

            // make sure the local gain is set to unity value
            this.localGainNode.gain.cancelScheduledValues( now );
            this.localGainNode.gain.setValueAtTime( 1, now );

            // create an audio buffer source node and connect it to the previously decoded audio data
            const bufferSource = this.audioContext.createBufferSource();
            bufferSource.buffer = this.audioBuffer;
            bufferSource.loop = this.loop;
            bufferSource.loopStart = this.soundStart;
            if ( this.soundEnd ) {
              bufferSource.loopEnd = this.soundEnd;
            }

            // connect this source node to the output
            bufferSource.connect( this.localGainNode );

            // add this to the list of active sources so that it can be stopped if necessary
            this.activeBufferSources.push( bufferSource );

            if ( !this.loop ) {

              // add a handler for when the sound finishes playing
              bufferSource.onended = () => {

                // remove the source from the list of active sources
                const indexOfSource = this.activeBufferSources.indexOf( bufferSource );
                if ( indexOfSource > -1 ) {
                  this.activeBufferSources.splice( indexOfSource, 1 );
                }
                this._isPlaying = this.activeBufferSources.length > 0;
              };
            }

            // set the playback rate and start playback
            bufferSource.playbackRate.setValueAtTime( this.playbackRate, now );
            bufferSource.start( now + delay, this.soundStart );
            this._isPlaying = true;
          }
          else {

            // the play method was called before the sound buffer finished loading, create an action that play the sound
            // once the loading has completed
            this.loadCompleteAction = () => { this.play(); };
          }
        }
      }
      else {

        // The play method was called when the audio context was not yet running, so add a listener to play if and when
        // the audio context state changes.  This will start any loops, and will also play a one-shot sound if the time
        // between the request and the state change isn't too great.  Note that this does NOT queue up more than one
        // individual sound to be played.
        this.timeOfDeferredPlayRequest = Date.now();
        if ( !audioContextStateChangeMonitor.hasListener( this.audioContext, this.audioContextStateChangeListener ) ) {
          audioContextStateChangeMonitor.addStateChangeListener(
            this.audioContext,
            this.audioContextStateChangeListener
          );
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
        const now = this.audioContext.currentTime;
        const stopTime = soundConstants.LINEAR_GAIN_CHANGE_TIME; // in seconds
        this.localGainNode.gain.linearRampToValueAtTime( 0, now + stopTime );
        this.activeBufferSources.forEach( source => { source.stop( now + stopTime ); } );

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

      if ( audioContextStateChangeMonitor.hasListener( this.audioContext, this.audioContextStateChangeListener ) ) {

        // remove the state change listener that was going to do a deferred play, since the sound has now been stopped
        audioContextStateChangeMonitor.removeStateChangeListener(
          this.audioContext,
          this.audioContextStateChangeListener
        );
      }
    },

    /**
     * play sound and change the speed as playback occurs
     * @param {number} playbackRate - desired playback speed, 1 = normal speed
     * @param {number} [timeConstant] -  time-constant in seconds for the first-order filter (exponential) approach to
     * the target value. The larger this value is, the slower the transition will be.
     */
    setPlaybackRate: function( playbackRate, timeConstant ) {
      timeConstant = typeof timeConstant === 'undefined' ? DEFAULT_TC : timeConstant;
      if ( this.rateChangesAffectPlayingSounds ) {
        this.activeBufferSources.forEach( bufferSource => {
          bufferSource.playbackRate.setTargetAtTime( playbackRate, this.audioContext.currentTime, timeConstant );
        } );
      }
      this.playbackRate = playbackRate;
    },

    /**
     * indicates whether sound is currently being played
     * @returns {boolean}
     */
    get isPlaying() {
      return this._isPlaying;
    }

  } );
} );