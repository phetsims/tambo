// Copyright 2018-2022, University of Colorado Boulder

/**
 * A sound generator that plays pre-recorded sounds, either as a one-shot or as a loop.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import audioContextStateChangeMonitor from '../audioContextStateChangeMonitor.js';
import soundConstants from '../soundConstants.js';
import SoundUtils from '../SoundUtils.js';
import tambo from '../tambo.js';
import SoundGenerator, { SoundGeneratorOptions } from './SoundGenerator.js';
import WrappedAudioBuffer from '../WrappedAudioBuffer.js';
import optionize from '../../../phet-core/js/optionize.js';
import Property from '../../../axon/js/Property.js';

type SelfOptions = {

  // controls whether this sound will wrap around and start over when done or just be played once
  loop?: boolean;

  // controls whether the silence at the beginning and (in the case of loops) the end is omitted when sound is played
  trimSilence?: boolean;

  // Initial playback rate for this clip.  This value is a multiplier, so 1 is the nominal playback rate, 0.5 is half
  // speed (or an octave lower in musical terms) and a value of 2 is twice normal speed (or an octave higher in musical
  // terms).  The playback rate can be changed after construction via the API.
  initialPlaybackRate?: number;

  // Controls whether sound generation can be initiated when this sound generator is disabled.  This is useful for a
  // one-shot sound that is long, so if the user does something that generally would cause a sound, but sound is
  // disabled, but then they immediately re-enable sound, the "tail" of this sound would be heard.  This option is
  // ignored for loops, since loops always allow initiation when disabled.
  initiateWhenDisabled?: boolean;

  // Controls whether changes to the playback rate via the API causes changes to the sounds that are already being
  // played as opposed to only sounds that are started after the playback rate is changed.  This is relevant for both
  // loops and one-shot sounds, since a one-shot sound (especially one that is fairly long) could be in the process of
  // playing when a playback rate change occurs.
  rateChangesAffectPlayingSounds?: boolean;
};
export type SoundClipOptions = SelfOptions & SoundGeneratorOptions;

// constants
const MAX_PLAY_DEFER_TIME = 0.2; // seconds, max time to defer a play request while waiting for audio context state change
const DEFAULT_TC = soundConstants.DEFAULT_PARAM_CHANGE_TIME_CONSTANT;
const DEFAULT_STOP_DELAY = 0.1;

class SoundClip extends SoundGenerator {

  // an object containing the audio buffer and flag that indicates readiness, i.e. whether it is fully loaded
  private readonly wrappedAudioBuffer: WrappedAudioBuffer;

  // flag that controls whether this is a one-shot or loop sound
  public readonly loop: boolean;

  // flag that controls whether changes to the playback rate affects in-progress sounds
  private readonly rateChangesAffectPlayingSounds: boolean;

  // Controls whether this clip can be initiated when it is disabled, see description in options type definition above.
  // This is part of the API and can be changed if needed, though such a need is generally quite rare.
  public initiateWhenDisabled: boolean;

  // start point for playback of the sound data
  private soundStart: number;

  // stop or wrap around point for playback of the sound data
  private soundEnd: number | null;

  // A list of active source buffer nodes, used so that this clip can be played multiple times without each initiation
  // interfering with the other.
  private readonly activeBufferSources: AudioBufferSourceNode[];

  // a gain node that is used to prevent clicks when stopping the sound
  private readonly localGainNode: GainNode;

  // The rate at which clip is being played back, 1 is normal, above 1 is faster, below 1 is slower.  See online docs
  // for AudioBufferSourceNode.playbackRate for more information.
  private _playbackRate: number;

  // indicates whether the sound is being played
  public readonly isPlayingProperty: Property<boolean>;

  // time at which a deferred play request occurred, in milliseconds since epoch
  private timeOfDeferredPlayRequest: number;

  // callback for when audio context isn't in 'running' state, see usage
  private readonly audioContextStateChangeListener: ( state: string ) => void;

  public constructor( wrappedAudioBuffer: WrappedAudioBuffer, providedOptions?: SoundClipOptions ) {

    const options = optionize<SoundClipOptions, SelfOptions, SoundGeneratorOptions>()( {
      loop: false,
      trimSilence: true,
      initialPlaybackRate: 1,
      initiateWhenDisabled: false,
      rateChangesAffectPlayingSounds: true
    }, providedOptions );

    super( options );

    // initialize local state
    this.wrappedAudioBuffer = wrappedAudioBuffer;
    this.loop = options.loop;
    this.rateChangesAffectPlayingSounds = options.rateChangesAffectPlayingSounds;
    this.initiateWhenDisabled = options.initiateWhenDisabled;
    this.soundStart = 0;
    this.soundEnd = null;
    if ( options.trimSilence ) {

      // For sounds that are created statically during the module load phase, this listener will interpret the audio
      // data once the load of that data has completed.  For all sounds constructed after the module load phase has
      // completed, this will process right away.
      const setStartAndEndPoints = ( audioBuffer: AudioBuffer | null ) => {
        if ( audioBuffer ) {
          const loopBoundsInfo = SoundUtils.detectSoundBounds( audioBuffer );
          this.soundStart = loopBoundsInfo.soundStart;
          this.soundEnd = loopBoundsInfo.soundEnd;
          this.wrappedAudioBuffer.audioBufferProperty.unlink( setStartAndEndPoints );
        }
      };
      this.wrappedAudioBuffer.audioBufferProperty.link( setStartAndEndPoints );
    }
    this.activeBufferSources = [];
    this.localGainNode = this.audioContext.createGain();
    this.localGainNode.connect( this.soundSourceDestination );
    this._playbackRate = options.initialPlaybackRate;
    this.isPlayingProperty = new BooleanProperty( false );
    this.timeOfDeferredPlayRequest = Number.NEGATIVE_INFINITY;

    // callback for when audio context isn't in 'running' state, see usage
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
   * Start playing the sound.
   */
  public play( delay = 0 ): void {

    if ( this.audioContext.state === 'running' && this.wrappedAudioBuffer.audioBufferProperty.value ) {

      const now = this.audioContext.currentTime;

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
        bufferSource.playbackRate.setValueAtTime( this._playbackRate, now );
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
   * Stop playing the sound.
   *
   * Note: Doing rapid stops and starts of a loop using this method can cause sound glitches.  If you have a need to
   * do that, use volume fades combined with zero delay stops.
   *
   * @param [delay] - The amount of time to wait before stopping, generally used to prevent sudden stops, which can
   * cause audible clicks.  If greater than zero, which it is by default, this method will try to fade out the sound
   * fully prior to stopping the audio playback.
   */
  public stop( delay: number = DEFAULT_STOP_DELAY ): void {

    // Calculate a time constant to fade output level by 99% by the stop time, see Web Audio time constant information
    // to understand this calculation.
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
   * Set the playback rate.  Based on the way this SoundClip was created, this may or may not affect in-progress sounds.
   */
  public setPlaybackRate( playbackRate: number, timeConstant: number = DEFAULT_TC ): void {
    assert && assert( playbackRate > 0 );
    if ( this.rateChangesAffectPlayingSounds ) {
      const now = this.audioContext.currentTime;
      this.activeBufferSources.forEach( bufferSource => {
        bufferSource.playbackRate.cancelScheduledValues( now );
        bufferSource.playbackRate.setTargetAtTime( playbackRate, now, timeConstant );
      } );
    }
    this._playbackRate = playbackRate;
  }

  /**
   * Get the current playback rate.  Note that it is possible that there are audio buffers that are playing that are not
   * playing at the returned rate if the rate was recently changed.
   */
  public getPlaybackRate(): number {
    return this._playbackRate;
  }

  /**
   * ES5 getter for playback rate
   */
  public get playbackRate(): number {
    return this.getPlaybackRate();
  }

  /**
   * Get a value that indicates whether sound is currently being played.
   */
  public get isPlaying(): boolean {
    return this.isPlayingProperty.value;
  }

  /**
   * Get the number of instances of the audio buffer that are currently playing.  This can be greater than one because
   * SoundClip supports multiple buffers playing at the same time.  This method is generally used to limit the number
   * of instances that are playing at the same time.
   */
  public getNumberOfPlayingInstances(): number {
    return this.activeBufferSources.length;
  }
}

tambo.register( 'SoundClip', SoundClip );

export default SoundClip;