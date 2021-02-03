// Copyright 2019-2020, University of Colorado Boulder

/**
 * MultiClip is a sound generator that plays one-shot sounds from a set of pre-recorded files that are provided upon
 * construction. This is often used as a base class for a sound generator when a finite set of sounds clips need to be
 * played in response to different values of a model parameter.
 *
 * Individual gain controls are not provided for the different sound clips in this class, there is just a single gain
 * node for the sound generator as a whole.  The intent here is that this saves resources by not creating unneeded gain
 * nodes.  If such fine-grained control is needed, a similar type could be created using multiple instances of the
 * SoundClip class.
 *
 * This class only supports clips that are played as one shots, i.e. it does not include support for looping.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import audioContextStateChangeMonitor from '../audioContextStateChangeMonitor.js';
import tambo from '../tambo.js';
import SoundGenerator from './SoundGenerator.js';

// constants
const STOP_DELAY_TIME = 0.1; // empirically determined to avoid clicks when stopping sounds
const MAX_PLAY_DEFER_TIME = 0.2; // seconds, max time to defer a play request while waiting for audio context state change

class MultiClip extends SoundGenerator {

  /**
   * @param {Map.<*,WrappedAudioBuffer>} valueToWrappedAudioBufferMap - a map of values to Web Audio AudioBuffer objects
   * that is used to associate each item in a set of values with a sound. The object defines a method that can then be
   * used to play the sound associated with the value.
   * @param {Object} [options]
   */
  constructor( valueToWrappedAudioBufferMap, options ) {

    options = merge( {

      // {boolean} - Playback rate for this clip, can be changed after construction via API.  This value is a
      // multiplier, so 1 is the nominal playback rate, 0.5 is half speed (or an octave lower in musical terms) and a
      // value of 2 is twice normal speed (or an octave higher in musical terms).
      initialPlaybackRate: 1
    }, options );

    super( options );

    // @private {AudioBufferSource[]} - buffer sources that are currently playing, used if they need to be stopped early
    this.activeBufferSources = [];

    // @private {Map.<*,AudioBuffer>}
    this.valueToWrappedAudioBufferMap = valueToWrappedAudioBufferMap;

    // @private {GainNode} - a gain node that is used to prevent clicks when stopping the sounds
    this.localGainNode = this.audioContext.createGain();
    this.localGainNode.connect( this.soundSourceDestination );

    // listen to the Property that indicates whether we are fully enabled and stop sounds if and when it goes false
    this.fullyEnabledProperty.lazyLink( fullyEnabled => {
      if ( !fullyEnabled ) {
        this.stopAll();
      }
    } );

    // @private
    this.playbackRate = options.initialPlaybackRate;

    // @private {function|null} - a listener for implementing deferred play requests, see usage for details
    this.audioContextStateChangeListener = null;

    // @private {number} - time at which a deferred play request occurred, in milliseconds since epoch
    this.timeOfDeferredPlayRequest = Number.NEGATIVE_INFINITY;
  }

  /**
   * play the sound associated with the provided value
   * @param {*} value
   * @param {number} delay
   * @public
   */
  playAssociatedSound( value, delay = 0 ) {

    // get the audio buffer for this value
    const wrappedAudioBuffer = this.valueToWrappedAudioBufferMap.get( value );

    // verify that we have a sound for the provided value
    assert && assert( wrappedAudioBuffer !== undefined, 'no sound found for provided value' );

    if ( this.audioContext.state === 'running' ) {

      // play the sound (if enabled and fully decoded)
      if ( this.fullyEnabled && wrappedAudioBuffer.audioBufferProperty.value ) {

        const now = this.audioContext.currentTime;

        // make sure the local gain is set to unity value
        this.localGainNode.gain.cancelScheduledValues( now );
        this.localGainNode.gain.setValueAtTime( 1, now );

        // create an audio buffer source node and connect it to the previously data in the audio buffer
        const bufferSource = this.audioContext.createBufferSource();
        bufferSource.buffer = wrappedAudioBuffer.audioBufferProperty.value;
        bufferSource.playbackRate.setValueAtTime( this.playbackRate, this.audioContext.currentTime );

        // connect this source node to the output
        bufferSource.connect( this.localGainNode );

        // add this to the list of active sources so that it can be stopped if necessary
        this.activeBufferSources.push( bufferSource );

        // add a handler for when the sound finishes playing
        bufferSource.onended = () => {

          // remove the source from the list of active sources
          const indexOfSource = this.activeBufferSources.indexOf( bufferSource );
          if ( indexOfSource > -1 ) {
            this.activeBufferSources.splice( indexOfSource, 1 );
          }
        };

        // start the playback of the sound
        bufferSource.start( now + delay );
      }
    }
    else {

      // This method was called while the sound context was not yet running.  This can happen if the method is called
      // due to the first interaction from the user, and also during fuzz testing.

      // Remove previous listener if present.
      if ( this.audioContextStateChangeListener ) {
        audioContextStateChangeMonitor.removeStateChangeListener( this.audioContext, this.audioContextStateChangeListener );
      }

      // Create and add a listener to play the specified sound when the audio context changes to the 'running' state.
      this.timeOfDeferredPlayRequest = Date.now();
      this.audioContextStateChangeListener = () => {

        // Only play the sound if it hasn't been too long, otherwise it may be irrelevant.
        if ( ( Date.now() - this.timeOfDeferredPlayRequest ) / 1000 < MAX_PLAY_DEFER_TIME ) {

          // Play the sound, but delayed a little bit so that the gain nodes can be fully turned up in time.
          this.playAssociatedSound( value, 0.1 );
        }
        audioContextStateChangeMonitor.removeStateChangeListener( this.audioContext, this.audioContextStateChangeListener );
        this.audioContextStateChangeListener = null;
      };
      audioContextStateChangeMonitor.addStateChangeListener(
        this.audioContext,
        this.audioContextStateChangeListener
      );
    }
  }

  /**
   * Change the speed that the sound playback occurs. Note, this does not affect playing sounds, but will only affect
   * newly subsequent plays of sounds.
   * @param {number} playbackRate - desired playback speed, 1 = normal speed
   * @public
   */
  setPlaybackRate( playbackRate ) {
    this.playbackRate = playbackRate;
  }

  /**
   * stop playing any sounds that are currently in progress
   * @public
   */
  stopAll() {

    // Simply calling stop() on the buffer source frequently causes an audible click, so we use a gain node and turn
    // down the gain, effectively doing a fade out, before stopping playback.
    const stopTime = this.audioContext.currentTime + STOP_DELAY_TIME;
    this.localGainNode.gain.linearRampToValueAtTime( 0, stopTime );
    this.activeBufferSources.forEach( source => { source.stop( stopTime ); } );

    // The WebAudio spec is a bit unclear about whether stopping a sound will trigger an onended event.  In testing
    // on Chrome in September 2018, I (jbphet) found that onended was NOT being fired when stop() was called, so the
    // code below is needed to clear the array of all active buffer sources.
    this.activeBufferSources.length = 0;
  }
}

tambo.register( 'MultiClip', MultiClip );
export default MultiClip;