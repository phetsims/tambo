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

import soundInfoDecoder from '../soundInfoDecoder.js';
import tambo from '../tambo.js';
import SoundGenerator from './SoundGenerator.js';

// constants
const STOP_DELAY_TIME = 0.1; // empirically determined to avoid clicks when stopping sounds

class MultiClip extends SoundGenerator {

  /**
   * @param {Map<*,SoundInfo>} valueToSoundInfoMap - a map of values to SoundInfo objects (i.e. the type that is
   * returned by the PhET "sound" RequireJS plugin) that is used to associate a set of values with a set of sounds.
   * The method defined below can than be used to play the sounds by specifying a value.
   * @param {Object} [options]
   */
  constructor( valueToSoundInfoMap, options ) {

    super( options );

    // @private {AudioBufferSource[]} - buffer sources that are currently playing, used if they need to be stopped early
    this.activeBufferSources = [];

    // @private
    this.valueToAudioBufferMap = new Map();

    // decode the sound info objects and associate each with a value
    valueToSoundInfoMap.forEach( ( soundInfo, value ) => {

      soundInfoDecoder.decode(
        soundInfo,
        this.audioContext,
        decodedAudioData => {
          this.valueToAudioBufferMap.set( value, decodedAudioData );
        },
        () => {

          // This is the error case for audio decode.  Generally this only occurs if the audio file was incorrectly
          // specified.  There is handling for both the RequireJS and build cases.
          assert && assert( false, 'audio decode failed, is file spec correct?' );
          console.error( 'unable to decode audio data, please check all encoded audio' );
        }
      );
    } );

    // @private {GainNode} - a gain node that is used to prevent clicks when stopping the sounds
    this.localGainNode = this.audioContext.createGain();
    this.localGainNode.connect( this.masterGainNode );

    // listen to the Property that indicates whether we are fully enabled and stop sounds if and when it goes false
    this.fullyEnabledProperty.lazyLink( fullyEnabled => {
      if ( !fullyEnabled ) {
        this.stopAll();
      }
    } );
  }

  /**
   * play the sound associated with the provided value
   * @param {*} value
   */
  playAssociatedSound( value ) {

    // get the audio buffer for this value
    const audioBuffer = this.valueToAudioBufferMap.get( value );

    // verify that we have a sound for the provided value
    assert && assert( audioBuffer !== undefined, 'no sound found for provided value' );

    // play the sound (if enabled)
    if ( this.fullyEnabled ) {

      const now = this.audioContext.currentTime;

      // make sure the decoding of the audio data is complete before trying to play the sound
      if ( audioBuffer ) {

        // make sure the local gain is set to unity value
        this.localGainNode.gain.cancelScheduledValues( now );
        this.localGainNode.gain.setValueAtTime( 1, now );

        // create an audio buffer source node and connect it to the previously data in the audio buffer
        const bufferSource = this.audioContext.createBufferSource();
        bufferSource.buffer = audioBuffer;

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
      else {

        // note: if this happens and is a problem, support should be added for post-decode playing, like in SoundClip
        console.warn( 'attempted to play audio buffer before decoding completed' );
      }
    }
  }

  /**
   * stop playing any sounds that are currently in progress
   */
  stopAll() {

    // make sure the decoding of the audio data has completed before stopping anything
    if ( this.audioBuffer ) {

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
}

tambo.register( 'MultiClip', MultiClip );
export default MultiClip;