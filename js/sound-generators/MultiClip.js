// Copyright 2019, University of Colorado Boulder

/**
 * A sound generator that plays one-shot sounds from a set of pre-recorded files that are provided upon construction.
 * This is often used as a base class for a sound generator when a finite set of sounds clips need to be played in
 * response to different values of a model parameter.
 *
 * Individual gain controls are not provided for the different sound clips in this class, there is just a single gain
 * node for the sound generator as a whole.  If such control is needed, a similar type could be created using multiple
 * instances of the SoundClip class.
 *
 * This class only supports clips that are played as one shots, i.e. it does not include support for looping.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const audioContextStateChangeMonitor = require( 'TAMBO/audioContextStateChangeMonitor' );
  const SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  const soundInfoDecoder = require( 'TAMBO/soundInfoDecoder' );
  const tambo = require( 'TAMBO/tambo' );

  // constants
  const STOP_DELAY_TIME = 0.1; // empirically determined to avoid clicks when stopping sounds

  class MultiClip extends SoundGenerator {

    /**
     * @param {Object[]} soundInfoList - A list of objects that includes *either* a "url" key with a value that points to
     * the sound to be played *or* a "base64" key with a value that represents a base64-encoded version of the sound data.
     * The former is generally used when a sim is running in RequireJS mode, the latter is used in built versions.
     */
    constructor( soundInfoList ) {

      super();

      // @private {number}
      this.numberOfClips = soundInfoList.length;

      // @private {AudioBuffer[]} - decoded audio data in a form that is ready to play with Web Audio
      this.audioBuffers = [];

      // @private {function} - function to be invoked when sound buffer finishes loading
      this.loadCompleteAction = null;

      // @private {AudioBufferSourceNode[]} - a list of active source buffer nodes, used so that this play can be re-
      // initiated again before previous play finishes
      this.activeBufferSources = [];

      // @private {GainNode} - a gain node that is used to prevent clicks when stopping the sounds
      this.localGainNode = this.audioContext.createGain();
      this.localGainNode.connect( this.masterGainNode );

      // decode the audio data and place it in a sound buffer so it can be easily played
      soundInfoList.forEach( ( soundInfo, index ) => {
        soundInfoDecoder.decode(
          soundInfo,
          this.audioContext,
          decodedAudioData => {

            this.audioBuffers[ index ] = decodedAudioData;

            // perform the "load complete" actions, if any
            this.loadCompleteAction && this.loadCompleteAction();
            this.loadCompleteAction = null;
          },
          () => {

            // This is the error case for audio decode.  We have not seen this happen, but presumably a corrupted audio
            // file could cause it.  There is handling for both the RequireJS and build cases.
            assert && assert( false, 'audio decode failed' );
            console.error( 'unable to decode audio data, please check all encoded audio' );
          }
        );
      } );

      // listen to the Property that indicates whether we are fully enabled and stop sounds when it goes false
      this.fullyEnabledProperty.lazyLink( fullyEnabled => {
        if ( !this.loop && !fullyEnabled ) {
          this.stopAll();
        }
      } );
    }

    /**
     * play the specified clip
     * @param {number} index - index of the sound clip to be played
     * @param {number} [delay] - optional delay value for how long to wait before initiating play, in seconds
     * @public
     */
    play( index, delay ) {

      // parameter checking
      assert && assert( index < this.numberOfClips, 'clip index out of range' );

      const now = this.audioContext.currentTime;

      // default delay is zero
      delay = typeof delay === 'undefined' ? 0 : delay;

      if ( this.fullyEnabled ) {

        // make sure the decoding of the audio data is complete before trying to play the sound
        if ( this.audioBuffers[ index ] ) {

          // make sure the local gain is set to unity value
          this.localGainNode.gain.cancelScheduledValues( now );
          this.localGainNode.gain.setValueAtTime( 1, now );

          // create an audio buffer source node and connect it to the previously decoded audio data
          const bufferSource = this.audioContext.createBufferSource();
          bufferSource.buffer = this.audioBuffers[ index ];

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
          bufferSource.start( now + delay, this.soundStart );
        }
        else {

          // the play method was called before the sound buffer finished loading, create an action that play the sound
          // once the loading has completed
          this.loadCompleteAction = () => { this.play( index, delay ); };
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
        // down the gain, effectively doing a fade out, and then stopping playback.
        const stopTime = this.audioContext.currentTime + STOP_DELAY_TIME;
        this.localGainNode.gain.linearRampToValueAtTime( 0, stopTime );
        this.activeBufferSources.forEach( source => { source.stop( stopTime ); } );

        // The WebAudio spec is a bit unclear about whether stopping a sound will trigger an onended event.  In testing
        // on Chrome in September 2018, I (jbphet) found that onended was NOT being fired when stop() was called, so the
        // code below is needed to clear the array of all active buffer sources.
        this.activeBufferSources.length = 0;
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
    }
  }

  return tambo.register( 'MultiClip', MultiClip );
} );