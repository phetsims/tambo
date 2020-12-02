// Copyright 2018-2020, University of Colorado Boulder

/**
 * abstract base class for Web Audio based sound producing element that work in conjunction with the soundManager
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../axon/js/createObservableArray.js';
import merge from '../../../phet-core/js/merge.js';
import phetAudioContext from '../phetAudioContext.js';
import soundConstants from '../soundConstants.js';
import tambo from '../tambo.js';

// constants
const DEFAULT_TIME_CONSTANT = soundConstants.DEFAULT_PARAM_CHANGE_TIME_CONSTANT;

class SoundGenerator {

  /**
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  constructor( options ) {

    options = merge( {

      // {number} Initial value for the output level.  Generally, this should always be between 0 and 1, but values
      // greater than 1 may be needed in some rare cases in order to create enough output to be audible
      initialOutputLevel: 1,

      // {AudioContext} By default, the shared audio context is used so that this sound can be registered with the
      // sonification manager, but this can be overridden if desired.  In general, overriding will only be done for
      // testing.
      audioContext: phetAudioContext,

      // This flag controls whether the output of this sound generator is immediately connected to the audio context
      // destination.  This is useful for testing, but should not be set to true if this sound generator is being used
      // in conjunction with the sound manager.
      connectImmediately: false,

      // {BooleanProperty[]} - An initial set of Properties that will be hooked to this sound generator's enabled state,
      // all of which must be true for sound to be produced.  More of these properties can be added after construction
      // via methods if needed.
      enableControlProperties: [],

      // {AudioNode[]} Audio nodes that will be connected in the specified order between the bufferSource and
      // localGainNode, used to insert things like filters, compressors, etc.
      additionalAudioNodes: []

    }, options );

    options.enableControlProperties.forEach( enableControlProperty => {
      assert && assert(
        typeof enableControlProperty.value === 'boolean',
        'incorrect type for enable control property'
      );
    } );

    // @protected {AudioContext}
    this.audioContext = options.audioContext;

    // @private {number}
    this._outputLevel = options.initialOutputLevel;

    // @private {AudioParam[]} - a list of all audio nodes to which this sound generator is connected
    this.connectionList = [];

    // @private {ObservableArrayDef.<BooleanProperty>} - A set of boolean Properties that collectively control whether the
    // sound generator is enabled.  All of these must be true in order for the sound generator to be "fully
    // enabled", meaning that it will produce sound.
    this.enableControlProperties = createObservableArray();

    // @public (read-only) {BooleanProperty} - A Property that tracks whether this sound generator is fully enabled,
    // meaning that all the enable control Properties are in a state indicating that sound can be produced.  This
    // should only be updated in the listener function defined below, no where else.
    this.fullyEnabledProperty = new BooleanProperty( true );

    // listener that updates the state of fullyEnabledProperty
    const updateFullyEnabledState = () => {
      this.fullyEnabledProperty.value = _.every(
        this.enableControlProperties,
        enableControlProperty => enableControlProperty.value
      );
    };

    // listen for new enable control Properties and hook them up as they arrive
    this.enableControlProperties.addItemAddedListener( addedItem => {
      addedItem.link( updateFullyEnabledState );
      const checkAndRemove = removedItem => {
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

    // @public (read-only) {BooleanProperty} - A Property that tracks whether this sound generator is "locally enabled",
    // which means that it is internally set to produce sound.  Setting this to true does not guarantee that sound will
    // be produced, since other Properties can all affect this, see fullyEnabledProperty.
    this.locallyEnabledProperty = new BooleanProperty( true );

    // add the local Property to the list of enable controls
    this.addEnableControlProperty( this.locallyEnabledProperty );

    // @protected {GainNode) - master gain control that will be used to control the volume of the sound
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

    // @protected {AudioNode} - The audio node to which the sound sources will connect, analogous to
    // AudioContext.destination.  If no additional audio nodes were provided upon construction, this will be the
    // master gain node.
    this.soundSourceDestination = this.masterGainNode;

    // Insert any additional audio nodes into the signal chain by iterating backwards through the provided list.
    for ( let i = options.additionalAudioNodes.length - 1; i >= 0; i-- ) {
      const audioNode = options.additionalAudioNodes[ i ];
      audioNode.connect( this.soundSourceDestination );
      this.soundSourceDestination = audioNode;
    }

    // @private {function} - internally used disposal function
    this.disposeSoundGenerator = () => {

      // clearing this observable array should cause the Properties within it to be unlinked
      this.enableControlProperties.clear();
    };
  }

  /**
   * connect the sound generator to an audio parameter
   * @param {AudioParam} audioParam
   * @public
   */
  connect( audioParam ) {
    this.masterGainNode.connect( audioParam );

    // Track this sound generator's connections.  This is necessary because Web Audio doesn't support checking which
    // nodes are connected to which, and we need this information when disconnecting.
    this.connectionList.push( audioParam );
  }

  /**
   * disconnect the sound generator from an audio parameter
   * @param {AudioParam} audioParam
   * @public
   */
  disconnect( audioParam ) {
    this.masterGainNode.disconnect( audioParam );
    this.connectionList = _.without( this.connectionList, audioParam );
  }

  /**
   * test if this sound generator is connected to the provided audio param
   * @param {AudioParam} audioParam
   * @returns {boolean}
   * @public
   */
  isConnectedTo( audioParam ) {
    return this.connectionList.indexOf( audioParam ) >= 0;
  }

  /**
   * set output level of the sound generator
   * @param {number} outputLevel - generally between 0 and 1, but can be larger than 1 if necessary to amplify a small
   * signal, and can be negative to invert the phase
   * @param {number} [timeConstant] - time constant for change, longer values mean slower transitions, in seconds
   * @public
   */
  setOutputLevel( outputLevel, timeConstant ) {
    timeConstant = ( timeConstant === undefined ) ? DEFAULT_TIME_CONSTANT : timeConstant;
    this._outputLevel = outputLevel;
    const now = this.audioContext.currentTime;
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

  set outputLevel( outputLevel ) {
    this.setOutputLevel( outputLevel );
  }

  /**
   * Get the current output level setting.  Note that if the sound generator is disabled, this could return a non-zero
   * value but the sound generator won't produce audible sound.
   * @returns {number}
   * @public
   */
  getOutputLevel() {
    return this._outputLevel;
  }

  get outputLevel() {
    return this.getOutputLevel();
  }

  /**
   * add a Property to the list of those used to control the enabled state of this sound generator
   * @param {BooleanProperty} enableControlProperty
   * @public
   */
  addEnableControlProperty( enableControlProperty ) {
    this.enableControlProperties.push( enableControlProperty );
  }

  /**
   * remove a Property from the list of those used to control the enabled state of this sound generator
   * @param {BooleanProperty} enableControlProperty
   * @public
   */
  removeEnableControlProperty( enableControlProperty ) {
    this.enableControlProperties.remove( enableControlProperty );
  }

  /**
   * @public
   */
  get locallyEnabled() {
    return this.locallyEnabledProperty.value;
  }

  set locallyEnabled( locallyEnabled ) {
    this.locallyEnabledProperty.value = locallyEnabled;
  }

  /**
   * public
   * @returns {boolean}
   */
  get fullyEnabled() {
    return this.fullyEnabledProperty.value;
  }

  /**
   * @public
   */
  dispose() {
    this.disposeSoundGenerator();
  }

}

tambo.register( 'SoundGenerator', SoundGenerator );

export default SoundGenerator;