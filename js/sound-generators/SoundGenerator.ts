// Copyright 2018-2022, University of Colorado Boulder

/**
 * abstract base class for Web Audio based sound producing element that work in conjunction with the soundManager
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import createObservableArray, { ObservableArray } from '../../../axon/js/createObservableArray.js';
import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import phetAudioContext from '../phetAudioContext.js';
import soundConstants from '../soundConstants.js';
import tambo from '../tambo.js';
import Property from '../../../axon/js/Property.js';
import IProperty from '../../../axon/js/IProperty.js';

// constants
const DEFAULT_TIME_CONSTANT = soundConstants.DEFAULT_PARAM_CHANGE_TIME_CONSTANT;

let notSettingPhetioStateProperty: Property<boolean>;

export type SoundGeneratorOptions = {

  // Initial value for the output level.  Generally, this should always be between 0 and 1, but values
  // greater than 1 may be needed in some rare cases in order to create enough output to be audible
  initialOutputLevel?: number;

  // By default, the shared audio context is used so that this sound can be registered with the
  // sonification manager, but this can be overridden if desired.  In general, overriding will only be done for
  // testing.
  audioContext?: AudioContext;

  // This flag controls whether the output of this sound generator is immediately connected to the audio context
  // destination.  This is useful for testing, but should not be set to true if this sound generator is being used
  // in conjunction with the sound manager.
  connectImmediately?: boolean;

  // An initial set of Properties that will be hooked to this sound generator's enabled state,
  // all of which must be true for sound to be produced.  More of these properties can be added after construction
  // via methods if needed.
  enableControlProperties?: IProperty<boolean>[];

  // Audio nodes that will be connected in the specified order between the bufferSource and
  // localGainNode, used to insert things like filters, compressors, etc.
  additionalAudioNodes?: AudioNode[];

  // When false, an enable-control Property will be added that mutes the sound when setting PhET-iO state.
  // Almost all sounds want this muting to occur, please test thoroughly before turning this option on.
  enabledDuringPhetioStateSetting?: boolean;
};

abstract class SoundGenerator {

  protected audioContext: AudioContext;
  private _outputLevel: number;

  // a list of all audio nodes to which this sound generator is connected
  private connectionList: AudioParam[];

  // A set of boolean Properties that collectively control whether the sound generator is enabled.  All of these must be
  // true in order for the sound generator to be "fully enabled", meaning that it will produce sound.
  protected enableControlProperties: ObservableArray<IProperty<boolean>>;

  // A Property that tracks whether this sound generator is fully enabled, meaning that all the enable control
  // Properties are in a state indicating that sound can be produced.  This should only be updated in the listener
  // function defined below, no where else.
  readonly fullyEnabledProperty: Property<boolean>;

  // A Property that tracks whether this sound generator is "locally enabled",
  // which means that it is internally set to produce sound.  Setting this to true does not guarantee that sound will
  // be produced, since other Properties can all affect this, see fullyEnabledProperty.
  locallyEnabledProperty: Property<boolean>;

  // master gain control that will be used to control the volume of the sound
  protected masterGainNode: GainNode;

  // The audio node to which the sound sources will connect, analogous to AudioContext.destination.  If no additional
  // audio nodes were provided upon construction, this will be the master gain node.
  protected soundSourceDestination: AudioNode;

  // internally used disposal function
  private disposeSoundGenerator: () => void;

  protected constructor( providedOptions?: SoundGeneratorOptions ) {

    const options = optionize<SoundGeneratorOptions, SoundGeneratorOptions>( {
      initialOutputLevel: 1,
      audioContext: phetAudioContext,
      connectImmediately: false,
      enableControlProperties: [],
      additionalAudioNodes: [],
      enabledDuringPhetioStateSetting: false
    }, providedOptions );

    options.enableControlProperties.forEach( enableControlProperty => {
      assert && assert(
        typeof enableControlProperty.value === 'boolean',
        'incorrect type for enable control property'
      );
    } );

    this.audioContext = options.audioContext;
    this._outputLevel = options.initialOutputLevel;
    this.connectionList = [];
    this.enableControlProperties = createObservableArray();
    this.fullyEnabledProperty = new BooleanProperty( true );

    // listener that updates the state of fullyEnabledProperty
    const updateFullyEnabledState = () => {
      this.fullyEnabledProperty.value = _.every(
        this.enableControlProperties,
        ( enableControlProperty: IProperty<boolean> ) => enableControlProperty.value
      );
    };

    // listen for new enable control Properties and hook them up as they arrive
    this.enableControlProperties.addItemAddedListener( addedItem => {
      addedItem.link( updateFullyEnabledState );
      const checkAndRemove = ( removedItem: IProperty<boolean> ) => {
        if ( removedItem === addedItem ) {
          removedItem.unlink( updateFullyEnabledState );
          this.enableControlProperties.removeItemRemovedListener( checkAndRemove );
        }
      };
      this.enableControlProperties.addItemRemovedListener( checkAndRemove );
    } );

    // add any enable control Properties that were provided in the options object
    options.enableControlProperties.forEach( enableControlProperty => {
      this.addEnableControlProperty( enableControlProperty );
    } );

    this.locallyEnabledProperty = new BooleanProperty( true );

    // add the local Property to the list of enable controls
    this.addEnableControlProperty( this.locallyEnabledProperty );

    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.gain.setValueAtTime(
      this._outputLevel,
      this.audioContext.currentTime
    );

    // if the option specifies immediate connection, connect the master gain node to the audio context destination
    if ( options.connectImmediately ) {
      this.masterGainNode.connect( this.audioContext.destination );
    }

    // turn down the gain to zero when not fully enabled, or up to the current output level when becoming fully enabled
    this.fullyEnabledProperty.link( fullyEnabled => {

      const previousGainSetting = fullyEnabled ? 0 : this._outputLevel;
      const newGainSetting = fullyEnabled ? this._outputLevel : 0;
      const now = this.audioContext.currentTime;

      // For the linear ramp to work consistently on all browsers, the gain must be explicitly set to what it is
      // supposed to be before making any changes.  Otherwise, it may extrapolate from the most recent previous event.
      this.masterGainNode.gain.setValueAtTime( previousGainSetting, now );

      // ramp the gain to the new level
      this.masterGainNode.gain.linearRampToValueAtTime(
        newGainSetting,
        this.audioContext.currentTime + soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME
      );
    } );

    this.soundSourceDestination = this.masterGainNode;

    // Insert any additional audio nodes into the signal chain by iterating backwards through the provided list.
    for ( let i = options.additionalAudioNodes.length - 1; i >= 0; i-- ) {
      const audioNode = options.additionalAudioNodes[ i ];
      audioNode.connect( this.soundSourceDestination );
      this.soundSourceDestination = audioNode;
    }

    if ( Tandem.PHET_IO_ENABLED && !options.enabledDuringPhetioStateSetting ) {
      if ( Tandem.launched ) {
        assert && assert( notSettingPhetioStateProperty, 'Should exist after launch' );

        // If this SoundGenerator is being constructed after PhET-iO has been started, add an enable-control Property to
        // prevent sound during the setting of PhET-iO state.
        this.addEnableControlProperty( notSettingPhetioStateProperty );
      }
      else {

        // If this SoundGenerator is being constructed before PhET-iO is fully set up, add a listener, called once
        // PhET-iO is ready, to then add an enable-control Property that will prevent sound during the setting of
        // PhET-iO state.
        Tandem.addLaunchListener( () => {
          if ( !notSettingPhetioStateProperty ) {

            // Store this for later instantiations of SoundGenerator
            notSettingPhetioStateProperty = DerivedProperty.not( phet.phetio.phetioEngine.phetioStateEngine.isSettingStateProperty );
          }
          this.addEnableControlProperty( notSettingPhetioStateProperty );
        } );
      }
    }

    this.disposeSoundGenerator = () => {

      // Clearing this observable array should cause the Properties within it to be unlinked.
      this.enableControlProperties.clear();
    };
  }

  /**
   * connect the sound generator to an audio parameter
   */
  connect( audioParam: AudioParam ) {
    this.masterGainNode.connect( audioParam );

    // Track this sound generator's connections.  This is necessary because Web Audio doesn't support checking which
    // nodes are connected to which, and we need this information when disconnecting.
    this.connectionList.push( audioParam );
  }

  /**
   * disconnect the sound generator from an audio parameter
   */
  disconnect( audioParam: AudioParam ) {
    this.masterGainNode.disconnect( audioParam );
    this.connectionList = _.without( this.connectionList, audioParam );
  }

  /**
   * test if this sound generator is connected to the provided audio param
   */
  isConnectedTo( audioParam: AudioParam ): boolean {
    return this.connectionList.indexOf( audioParam ) >= 0;
  }

  /**
   * Set the output level of the sound generator.
   * @param outputLevel - generally between 0 and 1, but can be larger than 1 if necessary to amplify a small
   *                      signal, and can be negative to invert the phase
   * @param [timeConstant] - time constant for change, longer values mean slower transitions, in seconds
   */
  setOutputLevel( outputLevel: number, timeConstant: number = DEFAULT_TIME_CONSTANT ) {

    const now = this.audioContext.currentTime;

    // If this is indeed a change, cancel any scheduled changes from previous actions that might still be in progress.
    if ( outputLevel !== this._outputLevel ) {
      this.masterGainNode.gain.cancelScheduledValues( now );
    }

    // Set local copy of output level.
    this._outputLevel = outputLevel;

    // Set the output level on the gain node.  A different method is used for instant changes.
    if ( timeConstant === 0 ) {
      if ( outputLevel === 0 || this.fullyEnabledProperty.value ) {
        this.masterGainNode.gain.cancelScheduledValues( now );
        this.masterGainNode.gain.setValueAtTime( outputLevel, now );
      }
    }
    else if ( this.fullyEnabledProperty.value ) {

      // The setTargetAtTime method doesn't seem to work if the audio context isn't running, and the event doesn't seem
      // to be scheduled - it's just ignored.  So, if the audio context isn't running, use an alternative approach.  See
      // https://github.com/phetsims/tambo/issues/74.
      if ( this.audioContext.state === 'running' ) {
        this.masterGainNode.gain.setTargetAtTime( outputLevel, now, timeConstant );
      }
      else {
        this.masterGainNode.gain.linearRampToValueAtTime(
          outputLevel,
          now + soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME
        );
      }
    }
  }

  set outputLevel( outputLevel: number ) {
    this.setOutputLevel( outputLevel );
  }

  /**
   * Get the current output level setting.  Note that if the sound generator is disabled, this could return a non-zero
   * value but the sound generator won't produce audible sound.
   */
  getOutputLevel(): number {
    return this._outputLevel;
  }

  get outputLevel(): number {
    return this.getOutputLevel();
  }

  /**
   * add a Property to the list of those used to control the enabled state of this sound generator
   */
  addEnableControlProperty( enableControlProperty: IProperty<boolean> ) {
    this.enableControlProperties.push( enableControlProperty );
  }

  /**
   * remove a Property from the list of those used to control the enabled state of this sound generator
   */
  removeEnableControlProperty( enableControlProperty: IProperty<boolean> ) {
    this.enableControlProperties.remove( enableControlProperty );
  }

  get locallyEnabled(): boolean {
    return this.locallyEnabledProperty.value;
  }

  set locallyEnabled( locallyEnabled: boolean ) {
    this.locallyEnabledProperty.value = locallyEnabled;
  }

  get fullyEnabled(): boolean {
    return this.fullyEnabledProperty.value;
  }

  dispose() {
    this.disposeSoundGenerator();
  }

}

tambo.register( 'SoundGenerator', SoundGenerator );

export default SoundGenerator;