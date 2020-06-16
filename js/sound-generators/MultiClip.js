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

import soundConstants from '../soundConstants.js';
import tambo from '../tambo.js';
import SoundGenerator from './SoundGenerator.js';

// constants
const STOP_DELAY_TIME = 0.1; // empirically determined to avoid clicks when stopping sounds
const DEFAULT_TC = soundConstants.DEFAULT_PARAM_CHANGE_TIME_CONSTANT;

class MultiClip extends SoundGenerator {

  /**
   * @param {Map<*,WrappedAudioBuffer>} valueToWrappedAudioBufferMap - a map of values to Web Audio AudioBuffer objects
   * that is used to associate each item in a set of values with a sound. The object defines a method that can then be
   * used to play the sound associated with the value.
   * @param {Object} [options]
   */
  constructor( valueToWrappedAudioBufferMap, options ) {

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
    this.playbackRate = DEFAULT_TC;
  }

  /**
   * play the sound associated with the provided value
   * @param {*} value
   * @public
   */
  playAssociatedSound( value ) {

    // get the audio buffer for this value
    const wrappedAudioBuffer = this.valueToWrappedAudioBufferMap.get( value );

    // verify that we have a sound for the provided value
    assert && assert( wrappedAudioBuffer !== undefined, 'no sound found for provided value' );

    // play the sound (if enabled and fully decoded)
    if ( this.fullyEnabled && wrappedAudioBuffer.audioBufferProperty.value ) {

      const now = this.audioContext.currentTime;

      // make sure the local gain is set to unity value
      this.localGainNode.gain.cancelScheduledValues( now );
      this.localGainNode.gain.setValueAtTime( 1, now );

      // create an audio buffer source node and connect it to the previously data in the audio buffer
      const bufferSource = this.audioContext.createBufferSource();
      bufferSource.buffer = wrappedAudioBuffer.audioBufferProperty.value;
      bufferSource.playbackRate.setTargetAtTime( this.playbackRate, this.audioContext.currentTime, DEFAULT_TC );

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
      bufferSource.start( now );
    }
  }

  /**
   * play sound and change the speed as playback occurs
   * @param {number} playbackRate - desired playback speed, 1 = normal speed
   * @param {number} [timeConstant] -  time-constant in seconds for the first-order filter (exponential) approach to
   * the target value. The larger this value is, the slower the transition will be.
   * TODO: duplicated from SoundClip.js
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