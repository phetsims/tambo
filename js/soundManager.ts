// Copyright 2018-2023, University of Colorado Boulder

/**
 * A singleton object that registers sound generators, connects them to the audio output, and provides a number of
 * related services, such as:
 *  - master enable/disable
 *  - master gain control
 *  - enable/disable of sounds based on visibility of an associated Scenery node
 *  - enable/disable of sounds based on their assigned sonification level (e.g. "basic" or "extra")
 *  - gain control for sounds based on their assigned category, e.g. UI versus sim-specific sounds
 *  - a shared reverb unit to add some spatialization and make all sounds seem to originate with the same space
 *
 *  The singleton object must be initialized before sound generators can be added.
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import Utils from '../../dot/js/Utils.js';
import { Display, DisplayedProperty, Node } from '../../scenery/js/imports.js';
import PhetioObject from '../../tandem/js/PhetioObject.js';
import Tandem from '../../tandem/js/Tandem.js';
import emptyApartmentBedroom06Resampled_mp3 from '../sounds/emptyApartmentBedroom06Resampled_mp3.js';
import audioContextStateChangeMonitor from './audioContextStateChangeMonitor.js';
import phetAudioContext from './phetAudioContext.js';
import soundConstants from './soundConstants.js';
import SoundLevelEnum from './SoundLevelEnum.js';
import tambo from './tambo.js';
import SoundGenerator from './sound-generators/SoundGenerator.js';
import optionize from '../../phet-core/js/optionize.js';
import TReadOnlyProperty, { PropertyLinkListener } from '../../axon/js/TReadOnlyProperty.js';
import Multilink from '../../axon/js/Multilink.js';
import arrayRemove from '../../phet-core/js/arrayRemove.js';
import createObservableArray, { ObservableArray } from '../../axon/js/createObservableArray.js';

// constants
const AUDIO_DUCKING_LEVEL = 0.15; // gain value to use for the ducking gain node when ducking is active

// options that can be used when adding a sound generator that can control some aspects of its behavior
export type SoundGeneratorAddOptions = {

  // The 'sonification level' is used to determine whether a given sound should be enabled given the setting of the
  // sonification level parameter for the sim.
  sonificationLevel?: SoundLevelEnum;

  // The associated view node is a Scenery node that, if provided, must be visible in the display for the sound
  // generator to be enabled.  This is generally used only for sounds that can play for long durations, such as a
  // looping sound clip, that should be stopped when the associated visual representation is hidden.
  associatedViewNode?: Node | null;

  // category name for this sound
  categoryName?: string | null;
};

// sound generators that are queued up and waiting to be added when initialization is complete
type SoundGeneratorAwaitingAdd = {
  soundGenerator: SoundGenerator;
  soundGeneratorAddOptions: SoundGeneratorAddOptions;
};

// sound generator with its sonification level
type SoundGeneratorInfo = {
  soundGenerator: SoundGenerator;
  sonificationLevel: SoundLevelEnum;
};

type SoundGeneratorInitializationOptions = {

  // This option can be used to define a set of categories that can be used to group sound generators together and
  // then control their volume collectively.  The names should be unique.  See the default initialization values for an
  // example list.
  categories?: string[];
};

// constants
const DEFAULT_REVERB_LEVEL = 0.02;
const LINEAR_GAIN_CHANGE_TIME = soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME; // in seconds
const GAIN_LOGGING_ENABLED = false;

class SoundManager extends PhetioObject {

  // global enabled state for sound generation
  public readonly enabledProperty: BooleanProperty;

  // enabled state for extra sounds
  public readonly extraSoundEnabledProperty: BooleanProperty;

  // an array where the sound generators are stored along with information about how to manage them
  private readonly soundGeneratorInfoArray: SoundGeneratorInfo[];

  // output level for the master gain node when sonification is enabled
  private _masterOutputLevel: number;

  // reverb level, needed because some browsers don't support reading of gain values, see methods for more info
  private _reverbLevel: number;

  // A map of category names to GainNode instances that control gains for that category name.  This filled in during
  // initialization, see the usage of options.categories in the initialize function for more information.
  private readonly gainNodesForCategories: Map<string, GainNode>;

  // an array of properties where, if any of these are true, overall output level is "ducked" (i.e. reduced)
  private readonly duckingProperties: ObservableArray<TReadOnlyProperty<boolean>>;

  // flag that tracks whether the sonification manager has been initialized, should never be set outside this file
  public initialized: boolean;

  // sound generators that are queued up if attempts are made to add them before initialization has occurred
  private readonly soundGeneratorsAwaitingAdd: SoundGeneratorAwaitingAdd[];

  // audio nodes that are used in the signal chain between sound generators and the audio context destination
  private masterGainNode: GainNode | null;
  private convolver: ConvolverNode | null;
  private reverbGainNode: GainNode | null;
  private dryGainNode: GainNode | null;
  private duckingGainNode: GainNode | null;

  private readonly displayedPropertyMap = new Map<SoundGenerator, DisplayedProperty>();

  public constructor( tandem: Tandem = Tandem.OPTIONAL ) {

    super( {
      tandem: tandem,
      phetioState: false,
      phetioDocumentation: 'Controls the simulation\'s sound. For sims that do not support sound, this element and ' +
                           'its children can be ignored.'
    } );

    this.enabledProperty = new BooleanProperty( phet.chipper.queryParameters.supportsSound, {
      tandem: tandem.createTandem( 'enabledProperty' ),
      phetioState: false, // This is a preference, global sound control is handled by the audioManager
      phetioDocumentation: 'Determines whether sound is enabled. Supported only if this sim supportsSound=true.'
    } );

    this.extraSoundEnabledProperty = new BooleanProperty( phet.chipper.queryParameters.extraSoundInitiallyEnabled, {
      tandem: tandem.createTandem( 'extraSoundEnabledProperty' ),
      phetioState: false, // This is a preference, global sound control is handled by the audioManager
      phetioDocumentation: 'Determines whether extra sound is enabled. Extra sound is additional sounds that ' +
                           'can serve to improve the learning experience for individuals with visual disabilities. ' +
                           'Note that not all simulations that support sound also support extra sound. Also note ' +
                           'that the value is irrelevant when enabledProperty is false.'
    } );

    this.soundGeneratorInfoArray = [];
    this._masterOutputLevel = 1;
    this._reverbLevel = DEFAULT_REVERB_LEVEL;
    this.gainNodesForCategories = new Map<string, GainNode>();
    this.duckingProperties = createObservableArray();
    this.initialized = false;
    this.soundGeneratorsAwaitingAdd = [];
    this.masterGainNode = null;
    this.duckingGainNode = null;
    this.convolver = null;
    this.reverbGainNode = null;
    this.dryGainNode = null;
  }

  /**
   * Initialize the sonification manager. This function must be invoked before any sound generators can be added.
   */
  public initialize( simConstructionCompleteProperty: TReadOnlyProperty<boolean>,
                     audioEnabledProperty: TReadOnlyProperty<boolean>,
                     simVisibleProperty: TReadOnlyProperty<boolean>,
                     simActiveProperty: TReadOnlyProperty<boolean>,
                     simSettingPhetioStateProperty: TReadOnlyProperty<boolean>,
                     providedOptions?: SoundGeneratorInitializationOptions ): void {

    assert && assert( !this.initialized, 'can\'t initialize the sound manager more than once' );

    const options = optionize<SoundGeneratorInitializationOptions, SoundGeneratorInitializationOptions>()( {
      categories: [ 'sim-specific', 'user-interface' ]
    }, providedOptions );

    // options validation
    assert && assert(
      options.categories.length === _.uniq( options.categories ).length,
      'categories must be unique'
    );

    const now = phetAudioContext.currentTime;

    // The final stage is a dynamics compressor that is used essentially as a limiter to prevent clipping.
    const dynamicsCompressor = phetAudioContext.createDynamicsCompressor();
    dynamicsCompressor.threshold.setValueAtTime( -6, now );
    dynamicsCompressor.knee.setValueAtTime( 5, now );
    dynamicsCompressor.ratio.setValueAtTime( 12, now );
    dynamicsCompressor.attack.setValueAtTime( 0, now );
    dynamicsCompressor.release.setValueAtTime( 0.25, now );
    dynamicsCompressor.connect( phetAudioContext.destination );

    // Create the ducking gain node, which is used to reduce the overall sound output level temporarily in certain
    // situations, such as when the voicing feature is actively producing speech.
    this.duckingGainNode = phetAudioContext.createGain();
    this.duckingGainNode.connect( dynamicsCompressor );

    // Create the master gain node for all sounds managed by this sonification manager.
    this.masterGainNode = phetAudioContext.createGain();
    this.masterGainNode.connect( this.duckingGainNode );

    // Set up a convolver node, which will be used to create the reverb effect.
    this.convolver = phetAudioContext.createConvolver();
    const setConvolverBuffer: PropertyLinkListener<AudioBuffer | null> = audioBuffer => {
      if ( audioBuffer ) {
        this.convolver!.buffer = audioBuffer;
        emptyApartmentBedroom06Resampled_mp3.audioBufferProperty.unlink( setConvolverBuffer );
      }
    };
    emptyApartmentBedroom06Resampled_mp3.audioBufferProperty.link( setConvolverBuffer );

    // gain node that will control the reverb level
    this.reverbGainNode = phetAudioContext.createGain();
    this.reverbGainNode.connect( this.masterGainNode );
    this.reverbGainNode.gain.setValueAtTime( this._reverbLevel, phetAudioContext.currentTime );
    this.convolver.connect( this.reverbGainNode );

    // dry (non-reverbed) portion of the output
    this.dryGainNode = phetAudioContext.createGain();
    this.dryGainNode.gain.setValueAtTime( 1 - this._reverbLevel, phetAudioContext.currentTime );
    this.dryGainNode.gain.linearRampToValueAtTime(
      1 - this._reverbLevel,
      phetAudioContext.currentTime + LINEAR_GAIN_CHANGE_TIME
    );
    this.dryGainNode.connect( this.masterGainNode );

    // Create and hook up gain nodes for each of the defined categories.
    assert && assert( this.convolver !== null && this.dryGainNode !== null, 'some audio nodes have not been initialized' );
    options.categories.forEach( categoryName => {
      const gainNode = phetAudioContext.createGain();
      gainNode.connect( this.convolver! );
      gainNode.connect( this.dryGainNode! );
      this.gainNodesForCategories.set( categoryName, gainNode );
    } );

    // Hook up a listener that turns down the master gain if sonification is disabled or if the sim isn't visible or
    // isn't active.
    Multilink.multilink(
      [
        this.enabledProperty,
        audioEnabledProperty,
        simConstructionCompleteProperty,
        simVisibleProperty,
        simActiveProperty,
        simSettingPhetioStateProperty
      ],
      ( enabled, audioEnabled, simInitComplete, simVisible, simActive, simSettingPhetioState ) => {

        const fullyEnabled = enabled && audioEnabled && simInitComplete && simVisible && simActive && !simSettingPhetioState;
        const gain = fullyEnabled ? this._masterOutputLevel : 0;

        // Set the gain, but somewhat gradually in order to avoid rapid transients, which can sound like clicks.
        this.masterGainNode!.gain.linearRampToValueAtTime(
          gain,
          phetAudioContext.currentTime + LINEAR_GAIN_CHANGE_TIME
        );
      }
    );

    const duckMainOutputLevelProperty = new BooleanProperty( false );

    // Define a listener that will update the state of the collective ducking Property that indicates whether ducking
    // (overall volume reduction to prevent overlap with other sounds) should be active or inactive.
    const updateDuckingState = () => {

      // Reduce the array of individual ducking Properties array to a single boolean value.
      duckMainOutputLevelProperty.value = this.duckingProperties.reduce(
        ( valueSoFar, currentProperty ) => valueSoFar || currentProperty.value,
        false
      );
    };

    // Implement ducking of the main output.
    duckMainOutputLevelProperty.lazyLink( duckOutput => {

      // State checking - make sure the ducking gain node exists.
      assert && assert( this.duckingGainNode, 'ducking listener fired, but no ducking gain node exists' );

      // Use time constant values that will turn down the output level faster than it will turn it up.  This sounds
      // better, since it prevents overlap with the voice.
      const timeConstant = duckOutput ? 0.05 : 0.5;

      // Duck or don't.
      const now = phetAudioContext.currentTime;
      this.duckingGainNode?.gain.cancelScheduledValues( now );
      this.duckingGainNode?.gain.setTargetAtTime( duckOutput ? AUDIO_DUCKING_LEVEL : 1, now, timeConstant );
    } );

    // Handle the adding and removal of individual ducking Properties.
    this.duckingProperties.addItemAddedListener( addedDuckingProperty => {
      addedDuckingProperty.link( updateDuckingState );
      const checkAndRemove = ( removedDuckingProperty: TReadOnlyProperty<boolean> ) => {
        if ( removedDuckingProperty === addedDuckingProperty ) {
          removedDuckingProperty.unlink( updateDuckingState );
          this.duckingProperties.removeItemRemovedListener( checkAndRemove );
        }
      };
      this.duckingProperties.addItemRemovedListener( checkAndRemove );
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Handle the audio context state, both when changes occur and when it is initially muted due to the autoplay
    // policy.  As of this writing (Feb 2019), there are some differences in how the audio context state behaves on
    // different platforms, so the code monitors different events and states to keep the audio context running.  As the
    // behavior of the audio context becomes more consistent across browsers, it may be possible to simplify this.
    //------------------------------------------------------------------------------------------------------------------

    // function to remove the user interaction listeners, used to avoid code duplication
    const removeUserInteractionListeners = () => {
      window.removeEventListener( 'touchstart', resumeAudioContext, false );
      if ( Display.userGestureEmitter.hasListener( resumeAudioContext ) ) {
        Display.userGestureEmitter.removeListener( resumeAudioContext );
      }
    };

    // listener that resumes the audio context
    const resumeAudioContext = () => {

      if ( phetAudioContext.state !== 'running' ) {

        phet.log && phet.log( `audio context not running, attempting to resume, state = ${phetAudioContext.state}` );

        // tell the audio context to resume
        phetAudioContext.resume()
          .then( () => {
            phet.log && phet.log( `resume appears to have succeeded, phetAudioContext.state = ${phetAudioContext.state}` );
            removeUserInteractionListeners();
          } )
          .catch( err => {
            const errorMessage = `error when trying to resume audio context, err = ${err}`;
            console.error( errorMessage );
            assert && alert( errorMessage );
          } );
      }
      else {

        // audio context is already running, no need to listen anymore
        removeUserInteractionListeners();
      }
    };

    // listen for a touchstart - this only works to resume the audio context on iOS devices (as of this writing)
    window.addEventListener( 'touchstart', resumeAudioContext, false );

    // listen for other user gesture events
    Display.userGestureEmitter.addListener( resumeAudioContext );

    // During testing, several use cases were found where the audio context state changes to something other than the
    // "running" state while the sim is in use (generally either "suspended" or "interrupted", depending on the
    // browser).  The following code is intended to handle this situation by trying to resume it right away.  GitHub
    // issues with details about why this is necessary are:
    // - https://github.com/phetsims/tambo/issues/58
    // - https://github.com/phetsims/tambo/issues/59
    // - https://github.com/phetsims/fractions-common/issues/82
    // - https://github.com/phetsims/friction/issues/173
    // - https://github.com/phetsims/resistance-in-a-wire/issues/190
    // - https://github.com/phetsims/tambo/issues/90
    let previousAudioContextState: AudioContextState = phetAudioContext.state;
    audioContextStateChangeMonitor.addStateChangeListener( phetAudioContext, ( state: AudioContextState ) => {

      phet.log && phet.log(
        `audio context state changed, old state = ${
          previousAudioContextState
        }, new state = ${
          state
        }, audio context time = ${
          phetAudioContext.currentTime}`
      );

      if ( state !== 'running' ) {

        // Add a listener that will resume the audio context on the next touchstart.
        window.addEventListener( 'touchstart', resumeAudioContext, false );

        // Listen also for other user gesture events that can be used to resume the audio context.
        if ( !Display.userGestureEmitter.hasListener( resumeAudioContext ) ) {
          Display.userGestureEmitter.addListener( resumeAudioContext );
        }
      }
      else {
        console.log( 'AudioContext is now running.' );
      }

      previousAudioContextState = state;
    } );

    this.initialized = true;

    // Add any sound generators that were waiting for initialization to complete (must be done after init complete).
    this.soundGeneratorsAwaitingAdd.forEach( soundGeneratorAwaitingAdd => {
      this.addSoundGenerator(
        soundGeneratorAwaitingAdd.soundGenerator,
        soundGeneratorAwaitingAdd.soundGeneratorAddOptions
      );
    } );
    this.soundGeneratorsAwaitingAdd.length = 0;
  }

  /**
   * Returns true if the specified soundGenerator has been previously added to the soundManager.
   */
  public hasSoundGenerator( soundGenerator: SoundGenerator ): boolean {
    return _.some(
      this.soundGeneratorInfoArray,
      soundGeneratorInfo => soundGeneratorInfo.soundGenerator === soundGenerator
    );
  }

  /**
   * Add a sound generator.  This connects the sound generator to the audio path, puts it on the list of sound
   * generators, and creates and returns a unique ID.
   */
  public addSoundGenerator( soundGenerator: SoundGenerator, providedOptions?: SoundGeneratorAddOptions ): void {

    // We'll need an empty object of no options were provided.
    if ( providedOptions === undefined ) {
      providedOptions = {};
    }

    // Check if initialization has been done and, if not, queue the sound generator and its options for addition
    // once initialization is complete.  Note that when sound is not supported, initialization will never occur.
    if ( !this.initialized ) {
      this.soundGeneratorsAwaitingAdd.push( {
        soundGenerator: soundGenerator,
        soundGeneratorAddOptions: providedOptions
      } );
      return;
    }

    // state checking - make sure the needed nodes have been created
    assert && assert( this.convolver !== null && this.dryGainNode !== null, 'some audio nodes have not been initialized' );

    // Verify that this is not a duplicate addition.
    const hasSoundGenerator = this.hasSoundGenerator( soundGenerator );
    assert && assert( !hasSoundGenerator, 'can\'t add the same sound generator twice' );

    // default options
    const options = optionize<SoundGeneratorAddOptions, SoundGeneratorAddOptions>()( {
      sonificationLevel: SoundLevelEnum.BASIC,
      associatedViewNode: null,
      categoryName: null
    }, providedOptions );

    // option validation
    assert && assert(
      _.includes( _.values( SoundLevelEnum ), options.sonificationLevel ),
      `invalid value for sonification level: ${options.sonificationLevel}`
    );

    // Connect the sound generator to an output path.
    if ( options.categoryName === null ) {
      soundGenerator.connect( this.convolver! );
      soundGenerator.connect( this.dryGainNode! );
    }
    else {
      assert && assert(
        this.gainNodesForCategories.has( options.categoryName ),
        `category does not exist : ${options.categoryName}`
      );
      soundGenerator.connect( this.gainNodesForCategories.get( options.categoryName )! );
    }

    // Keep a record of the sound generator along with additional information about it.
    const soundGeneratorInfo = {
      soundGenerator: soundGenerator,
      sonificationLevel: options.sonificationLevel
    };
    this.soundGeneratorInfoArray.push( soundGeneratorInfo );

    // Add the global enable Property to the list of Properties that enable this sound generator.
    soundGenerator.addEnableControlProperty( this.enabledProperty );

    // If this sound generator is only enabled in extra mode, add the extra mode Property as an enable-control.
    if ( options.sonificationLevel === SoundLevelEnum.EXTRA ) {
      soundGenerator.addEnableControlProperty( this.extraSoundEnabledProperty );
    }

    // If a view node was specified, create and pass in a boolean Property that is true only when the node is displayed.
    if ( options.associatedViewNode ) {
      const displayedProperty = new DisplayedProperty( options.associatedViewNode );
      soundGenerator.addEnableControlProperty( displayedProperty );

      this.displayedPropertyMap.set( soundGenerator, displayedProperty );
    }
  }

  /**
   * Remove the specified sound generator.
   */
  public removeSoundGenerator( soundGenerator: SoundGenerator ): void {

    // Check if the sound manager is initialized and, if not, issue a warning and ignore the request.  This is not an
    // assertion because the sound manager may not be initialized in cases where the sound is not enabled for the
    // simulation, but this method can still end up being invoked.
    if ( !this.initialized ) {

      const toRemove = this.soundGeneratorsAwaitingAdd.filter( s => s.soundGenerator === soundGenerator );
      assert && assert( toRemove.length > 0, 'unable to remove sound generator - not found' );
      while ( toRemove.length > 0 ) {
        arrayRemove( this.soundGeneratorsAwaitingAdd, toRemove[ 0 ] );
        toRemove.shift();
      }

      return;
    }

    // find the info object for this sound generator
    let soundGeneratorInfo = null;
    for ( let i = 0; i < this.soundGeneratorInfoArray.length; i++ ) {
      if ( this.soundGeneratorInfoArray[ i ].soundGenerator === soundGenerator ) {

        // found it
        soundGeneratorInfo = this.soundGeneratorInfoArray[ i ];
        break;
      }
    }

    // make sure it is actually present on the list
    assert && assert( soundGeneratorInfo, 'unable to remove sound generator - not found' );

    // disconnect the sound generator from any audio nodes to which it may be connected
    if ( soundGenerator.isConnectedTo( this.convolver! ) ) {
      soundGenerator.disconnect( this.convolver! );
    }
    if ( soundGenerator.isConnectedTo( this.dryGainNode! ) ) {
      soundGenerator.disconnect( this.dryGainNode! );
    }
    this.gainNodesForCategories.forEach( gainNode => {
      if ( soundGenerator.isConnectedTo( gainNode ) ) {
        soundGenerator.disconnect( gainNode );
      }
    } );

    // Remove the sound generator from the list.
    if ( soundGeneratorInfo ) {
      this.soundGeneratorInfoArray.splice( this.soundGeneratorInfoArray.indexOf( soundGeneratorInfo ), 1 );
    }

    // Clean up created DisplayedProperties that were created for the associated soundGenerator
    if ( this.displayedPropertyMap.has( soundGenerator ) ) {
      this.displayedPropertyMap.get( soundGenerator )!.dispose();
      this.displayedPropertyMap.delete( soundGenerator );
    }
  }

  /**
   * Set the master output level for sounds.
   * @param level - valid values from 0 (min) through 1 (max)
   */
  public setMasterOutputLevel( level: number ): void {

    // Check if initialization has been done.  This is not an assertion because the sound manager may not be
    // initialized if sound is not enabled for the sim.
    if ( !this.initialized ) {
      console.warn( 'an attempt was made to set the master output level on an uninitialized sound manager, ignoring' );
      return;
    }

    // range check
    assert && assert( level >= 0 && level <= 1, `output level value out of range: ${level}` );

    this._masterOutputLevel = level;
    if ( this.enabledProperty.value ) {
      this.masterGainNode!.gain.linearRampToValueAtTime(
        level,
        phetAudioContext.currentTime + LINEAR_GAIN_CHANGE_TIME
      );
    }
  }

  public set masterOutputLevel( outputLevel ) {
    this.setMasterOutputLevel( outputLevel );
  }

  public get masterOutputLevel() {
    return this.getMasterOutputLevel();
  }

  /**
   * Get the current output level setting.
   */
  public getMasterOutputLevel(): number {
    return this._masterOutputLevel;
  }


  /**
   * Set the output level for the specified category of sound generator.
   * @param categoryName - name of category to which this invocation applies
   * @param outputLevel - valid values from 0 through 1
   */
  public setOutputLevelForCategory( categoryName: string, outputLevel: number ): void {

    // Check if initialization has been done.  This is not an assertion because the sound manager may not be
    // initialized if sound is not enabled for the sim.
    if ( !this.initialized ) {
      console.warn( 'an attempt was made to set the output level for a sound category on an uninitialized sound manager, ignoring' );
      return;
    }

    assert && assert( this.initialized, 'output levels for categories cannot be added until initialization has been done' );

    // range check
    assert && assert( outputLevel >= 0 && outputLevel <= 1, `output level value out of range: ${outputLevel}` );

    // verify that the specified category exists
    assert && assert( this.gainNodesForCategories.get( categoryName ), `no category with name = ${categoryName}` );

    // Set the gain value on the appropriate gain node.
    const gainNode = this.gainNodesForCategories.get( categoryName );
    if ( gainNode ) {
      gainNode.gain.setValueAtTime( outputLevel, phetAudioContext.currentTime );
    }
  }

  /**
   * Add a ducking Property.  When any of the ducking Properties are true, the output level will be "ducked", meaning
   * that it will be reduced.
   */
  public addDuckingProperty( duckingProperty: TReadOnlyProperty<boolean> ): void {
    this.duckingProperties.add( duckingProperty );
  }


  /**
   * Remove a ducking Property that had been previously added.
   */
  public removeDuckingProperty( duckingProperty: TReadOnlyProperty<boolean> ): void {
    assert && assert( this.duckingProperties.includes( duckingProperty ), 'ducking Property not present' );
    this.duckingProperties.remove( duckingProperty );
  }

  /**
   * Get the output level for the specified sound generator category.
   * @param categoryName - name of category to which this invocation applies
   */
  public getOutputLevelForCategory( categoryName: string ): number {

    // Check if initialization has been done.  This is not an assertion because the sound manager may not be
    // initialized if sound is not enabled for the sim.
    if ( !this.initialized ) {
      console.warn( 'an attempt was made to get the output level for a sound category on an uninitialized sound manager, returning 0' );
      return 0;
    }

    // Get the GainNode for the specified category.
    const gainNode = this.gainNodesForCategories.get( categoryName );
    assert && assert( gainNode, `no category with name = ${categoryName}` );

    return gainNode!.gain.value;
  }

  /**
   * Set the amount of reverb.
   * @param newReverbLevel - value from 0 to 1, 0 = totally dry, 1 = wet
   */
  public setReverbLevel( newReverbLevel: number ): void {

    // Check if initialization has been done.  This is not an assertion because the sound manager may not be
    // initialized if sound is not enabled for the sim.
    if ( !this.initialized ) {
      console.warn( 'an attempt was made to set the reverb level on an uninitialized sound manager, ignoring' );
      return;
    }

    if ( newReverbLevel !== this._reverbLevel ) {
      assert && assert( newReverbLevel >= 0 && newReverbLevel <= 1, `reverb value out of range: ${newReverbLevel}` );
      const now = phetAudioContext.currentTime;
      this.reverbGainNode!.gain.linearRampToValueAtTime( newReverbLevel, now + LINEAR_GAIN_CHANGE_TIME );
      this.dryGainNode!.gain.linearRampToValueAtTime( 1 - newReverbLevel, now + LINEAR_GAIN_CHANGE_TIME );
      this._reverbLevel = newReverbLevel;
    }
  }

  public set reverbLevel( reverbLevel ) {
    this.setReverbLevel( reverbLevel );
  }

  public get reverbLevel(): number {
    return this.getReverbLevel();
  }

  public getReverbLevel(): number {
    return this._reverbLevel;
  }

  public set enabled( enabled: boolean ) {
    this.enabledProperty.value = enabled;
  }

  public get enabled(): boolean {
    return this.enabledProperty.value;
  }

  public set sonificationLevel( sonificationLevel: SoundLevelEnum ) {
    this.extraSoundEnabledProperty.value = sonificationLevel === SoundLevelEnum.EXTRA;
  }

  /**
   * ES5 getter for sonification level
   */
  public get sonificationLevel(): SoundLevelEnum {
    return this.extraSoundEnabledProperty.value ? SoundLevelEnum.EXTRA : SoundLevelEnum.BASIC;
  }

  /**
   * Log the value of the gain parameter at every animation frame for the specified duration.  This is useful for
   * debugging, because these parameters change over time when set using methods like "setTargetAtTime", and the
   * details of how they change seems to be different on the different browsers.
   *
   * It may be possible to remove this method someday once the behavior is more consistent across browsers.  See
   * https://github.com/phetsims/resistance-in-a-wire/issues/205 for some history on this.
   *
   * @param gainNode
   * @param duration - duration for logging, in seconds
   */
  public logGain( gainNode: GainNode, duration: number ): void {

    duration = duration || 1;
    const startTime = Date.now();

    // closure that will be invoked multiple times to log the changing values
    function logGain(): void {
      const now = Date.now();
      const timeInMilliseconds = now - startTime;
      console.log( `Time (ms): ${Utils.toFixed( timeInMilliseconds, 2 )}, Gain Value: ${gainNode.gain.value}` );
      if ( now - startTime < ( duration * 1000 ) ) {
        window.requestAnimationFrame( logGain );
      }
    }

    if ( GAIN_LOGGING_ENABLED ) {

      // kick off the logging
      console.log( '------- start of gain logging -----' );
      logGain();
    }
  }

  /**
   * Log the value of the master gain as it changes, used primarily for debug.
   * @param duration - in seconds
   */
  public logMasterGain( duration: number ): void {
    if ( this.masterGainNode ) {
      this.logGain( this.masterGainNode, duration );
    }
  }

  /**
   * Log the value of the reverb gain as it changes, used primarily for debug.
   * @param duration - duration for logging, in seconds
   */
  public logReverbGain( duration: number ): void {
    if ( this.reverbGainNode ) {
      this.logGain( this.reverbGainNode, duration );
    }
  }
}

const soundManager = new SoundManager();
tambo.register( 'soundManager', soundManager );
export default soundManager;