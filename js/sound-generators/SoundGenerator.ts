// Copyright 2018-2025, University of Colorado Boulder

/**
 * SoundGenerator is an abstract base class for Web-Audio-based sound-producing elements that work in conjunction with
 * the soundManager to produces sounds.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import EnabledComponent, { EnabledComponentOptions } from '../../../axon/js/EnabledComponent.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import isResettingAllProperty from '../../../scenery-phet/js/isResettingAllProperty.js';
import Node from '../../../scenery/js/nodes/Node.js';
import DisplayedProperty from '../../../scenery/js/util/DisplayedProperty.js';
import isSettingPhetioStateProperty from '../../../tandem/js/isSettingPhetioStateProperty.js';
import phetAudioContext from '../phetAudioContext.js';
import soundConstants from '../soundConstants.js';
import SoundLevelEnum from '../SoundLevelEnum.js';
import soundManager from '../soundManager.js';
import tambo from '../tambo.js';

// constants
const DEFAULT_TIME_CONSTANT = soundConstants.DEFAULT_PARAM_CHANGE_TIME_CONSTANT;

type SelfOptions = {

  // Initial value for the output level.  Generally, this should always be between 0 and 1, but values greater than 1
  // may be needed in some rare cases in order to create enough output to be audible.
  initialOutputLevel?: number;

  // By default, the shared audio context is used so that this sound can be registered with the sonification manager,
  // but this can be overridden if desired.  In general, overriding will only be done for testing.
  audioContext?: AudioContext;

  // This flag controls whether the output of this sound generator is immediately connected to the audio context
  // destination.  This is useful for testing, but should not be set to true if this sound generator is being used
  // in conjunction with the sound manager.
  connectImmediately?: boolean;

  // Audio nodes that will be connected in the specified order between the bufferSource and localGainNode, used to
  // insert things like filters, compressors, etc.
  additionalAudioNodes?: AudioNode[];

  // The "level" for which this sound should be played, either BASIC or EXTRA.
  sonificationLevel?: SoundLevelEnum;

  // The associated view node is a Scenery node that, if provided, must be visible in the display for the sound
  // generator to be enabled.  This is generally used only for sounds that can play for long durations, such as a
  // looping sound clip, that should be stopped when the associated visual representation is hidden.
  associatedViewNode?: Node | null;

  // Controls whether sound should be generated during a reset.  Generally the default value should be used, which is
  // `false`, meaning that sound is not produced during a reset.  There are some cases where this is turned on, such as
  // for the sound produced by the Reset All button.
  enabledDuringReset?: boolean;

  // Controls whether sounds should be generated when phet-io state is being set.  In almost all cases, this should not
  // be overridden and the default behavior should be used, which is to prevent all sound production during the setting
  // of phet-io state.
  enabledDuringPhetioStateSetting?: boolean;
};
export type SoundGeneratorOptions = SelfOptions & EnabledComponentOptions;

abstract class SoundGenerator extends EnabledComponent {

  protected audioContext: AudioContext;
  private _outputLevel: number;

  // a list of all audio nodes to which this sound generator is connected
  private connectionList: ( AudioParam | AudioNode )[];

  // A Property that tracks whether this sound generator is fully enabled, meaning that all the enable control
  // Properties are in a state indicating that sound can be produced.  This should only be updated in the listener
  // function defined below, nowhere else.
  public readonly fullyEnabledProperty: TReadOnlyProperty<boolean>;

  // main gain control that will be used to control the volume of the sound
  protected mainGainNode: GainNode;

  // The audio node to which the sound sources will connect, analogous to AudioContext.destination.  If no additional
  // audio nodes were provided upon construction, this will be the main gain node.
  protected soundSourceDestination: AudioNode;

  protected constructor( providedOptions?: SoundGeneratorOptions ) {

    const options = optionize<SoundGeneratorOptions, SelfOptions, EnabledComponentOptions>()( {
      initialOutputLevel: 1,
      audioContext: phetAudioContext,
      connectImmediately: false,
      sonificationLevel: SoundLevelEnum.BASIC,
      additionalAudioNodes: [],
      associatedViewNode: null,
      enabledDuringReset: false,
      enabledDuringPhetioStateSetting: false
    }, providedOptions );

    super( options );

    this.audioContext = options.audioContext;
    this._outputLevel = options.initialOutputLevel;
    this.connectionList = [];
    this.mainGainNode = this.audioContext.createGain();
    this.mainGainNode.gain.setValueAtTime(
      this._outputLevel,
      this.audioContext.currentTime
    );

    // If an associated view node was specified, create a boolean Property that is true only when the node is displayed.
    const viewNodeDisplayedProperty = options.associatedViewNode ?
                                      new DisplayedProperty( options.associatedViewNode ) :
                                      new BooleanProperty( true );

    // Define the property that will determine whether this sound generator should produce sound at all.
    this.fullyEnabledProperty = new DerivedProperty(
      [
        soundManager.enabledProperty,
        this.enabledProperty,
        isResettingAllProperty,
        viewNodeDisplayedProperty,
        soundManager.extraSoundEnabledProperty,
        isSettingPhetioStateProperty
      ],
      ( soundEnabled, enabled, isResettingAll, viewNodeDisplayed, extraSoundEnabled, isSettingPhetioState ) =>
        soundEnabled && enabled && viewNodeDisplayed &&
        ( options.sonificationLevel === SoundLevelEnum.BASIC || extraSoundEnabled ) &&
        ( !isResettingAll || options.enabledDuringReset ) &&
        ( !isSettingPhetioState || options.enabledDuringPhetioStateSetting )
    );

    // If the option specifies immediate connection, connect the main gain node to the audio context destination.
    if ( options.connectImmediately ) {
      this.mainGainNode.connect( this.audioContext.destination );
    }

    // Turn down the gain to zero when not fully enabled and up to the current output level when becoming fully enabled.
    this.fullyEnabledProperty.link( fullyEnabled => {

      const previousGainSetting = fullyEnabled ? 0 : this._outputLevel;
      const newGainSetting = fullyEnabled ? this._outputLevel : 0;
      const now = this.audioContext.currentTime;

      // For the linear ramp to work consistently on all browsers, the gain must be explicitly set to what it is
      // supposed to be before making any changes.  Otherwise, it may extrapolate from the most recent previous event.
      this.mainGainNode.gain.setValueAtTime( previousGainSetting, now );

      // Ramp the gain to the new level.
      this.mainGainNode.gain.linearRampToValueAtTime(
        newGainSetting,
        this.audioContext.currentTime + soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME
      );
    } );

    this.soundSourceDestination = this.mainGainNode;

    // Insert any additional audio nodes into the signal chain by iterating backwards through the provided list.
    for ( let i = options.additionalAudioNodes.length - 1; i >= 0; i-- ) {
      const audioNode = options.additionalAudioNodes[ i ];
      audioNode.connect( this.soundSourceDestination );
      this.soundSourceDestination = audioNode;
    }

    // Clean up memory references when this object is disposed.
    this.disposeEmitter.addListener( () => {
      this.fullyEnabledProperty.dispose();
    } );
  }

  /**
   * Connect the sound generator to an audio parameter.
   */
  public connect( audioParam: AudioParam | AudioNode ): void {
    this.mainGainNode.connect( audioParam as AudioParam );

    // Track this sound generator's connections.  This is necessary because Web Audio doesn't support checking which
    // nodes are connected to which, and we need this information when disconnecting.
    this.connectionList.push( audioParam as AudioParam );
  }

  /**
   * Disconnect the sound generator from an audio parameter.
   */
  public disconnect( audioParam: AudioParam | AudioNode ): void {
    this.mainGainNode.disconnect( audioParam as AudioNode );
    this.connectionList = _.without( this.connectionList, audioParam );
  }

  /**
   * Test if this sound generator is connected to the provided audio param.
   */
  public isConnectedTo( audioParam: AudioParam | AudioNode ): boolean {
    return this.connectionList.includes( audioParam );
  }

  /**
   * Sets the output level of the sound generator.
   *
   * @param outputLevel - generally between 0 and 1, but can be larger than 1 if necessary to amplify a small signal,
   *   and can be negative to invert the phase.
   * @param [timeConstant] - time constant for output level change, longer values mean slower transitions, in seconds.
   *   Note that timeConstant is NOT a fade time. It's an exponential approach to the target output level, and the argument to
   *   setTargetAtTime, documented at https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime#timeconstant
   *   The document has this suggestion for choosing the value for timeConstant: "Depending on your use case, getting
   *   95% toward the target value may already be enough; in that case, you could set timeConstant to one third of the
   *   desired duration."
   */
  public setOutputLevel( outputLevel: number, timeConstant: number = DEFAULT_TIME_CONSTANT ): void {

    // Ignore attempts to set the output level to the same value.
    if ( outputLevel !== this._outputLevel ) {
      const now = this.audioContext.currentTime;

      // The output level should take effect immediately if this sound generator is fully enabled.  Otherwise, the value
      // is saved and restored the next time the sound generator transitions to fully enabled.
      if ( this.fullyEnabledProperty.value ) {

        // Cancel any gain transitions that are currently in progress.
        this.mainGainNode.gain.cancelScheduledValues( now );

        // Set the output level on the gain node.  A different method is used for instant changes.
        if ( timeConstant === 0 ) {
          this.mainGainNode.gain.setValueAtTime( outputLevel, now );
        }
        else {

          // The setTargetAtTime method doesn't seem to work if the audio context isn't running, and the event doesn't
          // seem to be scheduled - it's just ignored.  So, if the audio context isn't running, use an alternative
          // approach.  See https://github.com/phetsims/tambo/issues/74.
          if ( this.audioContext.state === 'running' ) {
            this.mainGainNode.gain.setTargetAtTime( outputLevel, now, timeConstant );
          }
          else {
            this.mainGainNode.gain.linearRampToValueAtTime(
              outputLevel,
              now + soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME
            );
          }
        }
      }

      // Set local copy of output level.
      this._outputLevel = outputLevel;
    }
  }

  public set outputLevel( outputLevel: number ) {
    this.setOutputLevel( outputLevel );
  }

  public get outputLevel(): number {
    return this.getOutputLevel();
  }

  /**
   * Get the current output level setting.  Note that if the sound generator is disabled, this could return a non-zero
   * value but the sound generator won't produce audible sound.
   */
  public getOutputLevel(): number {
    return this._outputLevel;
  }

  public get fullyEnabled(): boolean {
    return this.fullyEnabledProperty.value;
  }
}

tambo.register( 'SoundGenerator', SoundGenerator );

export default SoundGenerator;