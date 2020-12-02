// Copyright 2018-2020, University of Colorado Boulder

/**
 * A sound generator that plays pre-recorded sounds, either as a one-shot or as a loop.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import merge from '../../../phet-core/js/merge.js';
import audioContextStateChangeMonitor from '../audioContextStateChangeMonitor.js';
import soundConstants from '../soundConstants.js';
import SoundUtils from '../SoundUtils.js';
import tambo from '../tambo.js';
import SoundGenerator from './SoundGenerator.js';

// constants
const MAX_PLAY_DEFER_TIME = 0.2; // seconds, max time to defer a play request while waiting for audio context state change
const DEFAULT_TC = soundConstants.DEFAULT_PARAM_CHANGE_TIME_CONSTANT;
const DEFAULT_STOP_DELAY = 0.1;

class SoundClip extends SoundGenerator {

  /**
   * @param {WrappedAudioBuffer} wrappedAudioBuffer
   * @param {Object} [options]
   * @constructor
   */
  constructor( wrappedAudioBuffer, options ) {

    options = merge( {

      // {boolean} - controls whether this sound will wrap around and start over when done or just be played once
      loop: false,

      // {boolean} - controls whether the silence at the beginning and (in the case of loops) the end is omitted
      trimSilence: true,

      // {boolean} - Playback rate for this clip, can be changed after construction via API.  This value is a
      // multiplier, so 1 is the nominal playback rate, 0.5 is half speed (or an octave lower in musical terms) and a
      // value of 2 is twice normal speed (or an octave higher in musical terms).
      initialPlaybackRate: 1,

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

    super( options );

    // @private {WrappedAudioBuffer} - an object containing the audio buffer and flag that indicates readiness
    this.wrappedAudioBuffer = wrappedAudioBuffer;

    // @private {boolean} - flag that controls whether this is a one-shot or loop sound
    this.loop = options.loop;

    // @private {boolean} - flag that controls whether changes to the playback rate affects in-progress sounds
    this.rateChangesAffectPlayingSounds = options.rateChangesAffectPlayingSounds;

    // @public {boolean} - see description in options above
    this.initiateWhenDisabled = options.initiateWhenDisabled;

    // @private {number} - start and end points for playback of the sound data
    this.soundStart = 0;
    this.soundEnd = null;
    if ( options.trimSilence ) {

      // For sounds that are created statically during the module load phase this listener will interpret the audio
      // data once the load of that data has completed.  For all sounds constructed after the module load phase has
      // completed, this will process right away.
      const setStartAndEndPoints = audioBuffer => {
        if ( audioBuffer ) {
          const loopBoundsInfo = SoundUtils.detectSoundBounds( audioBuffer );
          this.soundStart = loopBoundsInfo.soundStart;
          this.soundEnd = loopBoundsInfo.soundEnd;
          this.wrappedAudioBuffer.audioBufferProperty.unlink( setStartAndEndPoints );
        }
      };
      this.wrappedAudioBuffer.audioBufferProperty.link( setStartAndEndPoints );
    }

    // @private {AudioBufferSourceNode[]} - a list of active source buffer nodes, used so that this clip can be played
    // multiple times without each initiation interfering with the other
    this.activeBufferSources = [];

    // @private {GainNode} - a gain node that is used to prevent clicks when stopping the sound
    this.localGainNode = this.audioContext.createGain();
    this.localGainNode.connect( this.soundSourceDestination );

    // @private {number} - rate at which clip is being played back, 1 is normal, above 1 is faster, below 1 is slower,
    // see online docs for AudioBufferSourceNode.playbackRate for more information
    this.playbackRate = options.initialPlaybackRate;

    // @public (read-only) - BooleanProperty that indicates whether the sound is being played
    this.isPlayingProperty = new BooleanProperty( false );

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
          this.play( 0.1 );
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

  /**
   * start playing the sound
   * @param {number} [delay] - optional delay parameter, in seconds
   * @public
   */
  play( delay ) {

    if ( this.audioContext.state === 'running' && this.wrappedAudioBuffer.audioBufferProperty.value ) {

      const now = this.audioContext.currentTime;

      // default delay is zero
      delay = typeof delay === 'undefined' ? 0 : delay;

      if ( ( this.loop && !this.isPlayingProperty.get() ) ||
           ( !this.loop && ( this.fullyEnabled || this.initiateWhenDisabled ) ) ) {

        // create an audio buffer source node that uses the previously decoded audio data
        const bufferSource = this.audioContext.createBufferSource();
        bufferSource.buffer = this.wrappedAudioBuffer.audioBufferProperty.value;
        bufferSource.loop = this.loop;
        bufferSource.loopStart = this.soundStart;
        if ( this.soundEnd ) {
          bufferSource.loopEnd = this.soundEnd;
        }

        // make sure the local gain is set to unity value
        this.localGainNode.gain.cancelScheduledValues( now );
        this.localGainNode.gain.setValueAtTime( 1, now );

        bufferSource.connect( this.soundSourceDestination );

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
            this.isPlayingProperty.value = this.activeBufferSources.length > 0;
          };
        }

        // set the playback rate and start playback
        bufferSource.playbackRate.setValueAtTime( this.playbackRate, now );
        bufferSource.start( now + delay, this.soundStart );
        this.isPlayingProperty.value = true;
      }
    }
    else if ( this.audioContext.state === 'suspended' ) {

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
  }

  /**
   * stop playing the sound
   *
   * Note: Doing rapid stops and starts of a loop using this method can cause sound glitches.  If you have a need to
   * do that, use volume fades combined with zero delay stops.
   *
   * {number} delay - The amount of time to wait before stopping, generally used to prevent sudden stops, which can
   * cause audible clicks.  If greater than zero (which it is by default), this method will try to fade out the sound
   * fully prior to stopping the audio playback.
   * @public
   */
  stop( delay ) {

    delay = delay === undefined ? DEFAULT_STOP_DELAY : delay;

    // Calculate a time constant to fade output level by 99% by the stop time, see Web Audio time constant
    // information to understand this calculation.
    const fadeTimeConstant = delay > 0 ? delay / 4.61 : soundConstants.DEFAULT_PARAM_CHANGE_TIME_CONSTANT;

    // Simply calling stop() on the buffer source frequently causes an audible click, so we use a gain node and turn
    // down the gain, effectively doing a fade out, and then stopping playback.
    const now = this.audioContext.currentTime;
    const stopTime = now + delay;
    this.localGainNode.gain.cancelScheduledValues( now );
    this.localGainNode.gain.setTargetAtTime( 0, now, fadeTimeConstant );
    this.activeBufferSources.forEach( source => { source.stop( stopTime ); } );

    // The WebAudio spec is a bit unclear about whether stopping a sound will trigger an onended event.  In testing
    // on Chrome in September 2018, I (jbphet) found that onended was NOT being fired when stop() was called, so the
    // code below is needed to clear the array of all active buffer sources.
    this.activeBufferSources.length = 0;

    // clear the flag
    this.isPlayingProperty.value = false;

    if ( audioContextStateChangeMonitor.hasListener( this.audioContext, this.audioContextStateChangeListener ) ) {

      // remove the state change listener that was going to do a deferred play, since the sound has now been stopped
      audioContextStateChangeMonitor.removeStateChangeListener(
        this.audioContext,
        this.audioContextStateChangeListener
      );
    }
  }

  /**
   * play sound and change the speed as playback occurs
   * @param {number} playbackRate - desired playback speed, 1 = normal speed
   * @param {number} [timeConstant] -  time-constant in seconds for the first-order filter (exponential) approach to
   * the target value. The larger this value is, the slower the transition will be.
   * @public
   */
  setPlaybackRate( playbackRate, timeConstant ) {
    timeConstant = typeof timeConstant === 'undefined' ? DEFAULT_TC : timeConstant;
    if ( this.rateChangesAffectPlayingSounds ) {
      this.activeBufferSources.forEach( bufferSource => {
        bufferSource.playbackRate.setTargetAtTime( playbackRate, this.audioContext.currentTime, timeConstant );
      } );
    }
    this.playbackRate = playbackRate;
  }

  /**
   * indicates whether sound is currently being played
   * @returns {boolean}
   * @public
   */
  get isPlaying() {
    return this.isPlayingProperty.value;
  }
}

tambo.register( 'SoundClip', SoundClip );

export default SoundClip;