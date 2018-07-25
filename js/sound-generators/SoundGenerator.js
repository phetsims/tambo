// Copyright 2018, University of Colorado Boulder

/**
 * abstract base class for sound generators that work in conjunction with the sonification manager
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var phetAudioContext = require( 'TAMBO/phetAudioContext' );
  var tambo = require( 'TAMBO/tambo' );

  // constants
  var DEFAULT_TIME_CONSTANT = 0.015; // empirically determined to be fast but not cause clicks when applied to gain

  /**
   * @param {Object} options
   * @constructor
   */
  function SoundGenerator( options ) {

    var self = this;

    options = _.extend( {

      initialOutputLevel: 1,

      // By default, the shared audio context is used so that this sound can be registered with the sonification
      // manager, but this can be overridden if desired.  In general, overriding will only be done for testing.
      audioContext: phetAudioContext,

      // This flag controls whether the output of this sound generator is immediately connected to the audio context
      // destination.  This is useful for testing, but should not be set to true if this sound generator is being used
      // in conjunction with the sonification manager.
      connectImmediately: false
    }, options );

    // @protected {AudioContext}
    this.audioContext = options.audioContext;

    // @private {number}
    this._outputLevel = options.initialOutputLevel;

    // @private AudioParam[] - a list of all audio nodes to which this sound generator is connected
    this.connectionList = [];

    // @private {ObservableArray.<BooleanProperty>} - A set of boolean properties that collectively control whether the
    // sound generator is enabled.  All of these must be true in order for the sound generator to be able "fully
    // enabled", meaning that it will produce sound.
    this.enableControlProperties = new ObservableArray();

    // @public (read-only) {BooleanProperty} - A property that tracks whether this sound generator is fully enabled,
    // meaning that all the enable control properties are in a state indicating that sound can be produced.  This
    // should only be updated in the listener function defined below, no where else.
    this.fullyEnabledProperty = new BooleanProperty( true );

    // listener that updates the state of fullyEnabledProperty
    function updateFullyEnabledState() {
      self.fullyEnabledProperty.set( _.every(
        self.enableControlProperties.getArray(),
        function( enableControlProperty ) { return enableControlProperty.value; }
      ) );
    }

    // listen for new enable control properties and hook them up as they arrive
    this.enableControlProperties.addItemAddedListener( function( addedItem ) {
      addedItem.link( updateFullyEnabledState );
      self.enableControlProperties.addItemRemovedListener( function checkAndRemove( removedItem ) {
        if ( removedItem === addedItem ) {
          removedItem.unlink( updateFullyEnabledState );
          self.enableControlProperties.removeItemRemovedListener( checkAndRemove );
        }
      } );
    } );

    // @public (read-only) {BooleanProperty} - A property that tracks whether this sound generator is "locally enabled",
    // which means that it is internally set to produce sound.  Setting this to true does not guarantee that sound will
    // be produced, since other properties can all affect this, see fullyEnabledProperty.
    this.locallyEnabledProperty = new BooleanProperty( true );

    // add the local property to the list of enable controls
    this.addEnableControlProperty( this.locallyEnabledProperty );

    // @protected {GainNode) - master gain control that will be used to control the volume of the sound
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.gain.setTargetAtTime(
      this._outputLevel,
      this.audioContext.currentTime,
      DEFAULT_TIME_CONSTANT
    );

    // if the option specifies immediate connection, connect the master gain node to the audio context destination
    if ( options.connectImmediately ) {
      this.masterGainNode.connect( this.audioContext.destination );
    }

    // turn down the gain to zero when not fully enabled
    this.fullyEnabledProperty.link( function( fullyEnabled ) {
      var now = self.audioContext.currentTime;
      if ( fullyEnabled ) {
        self.masterGainNode.gain.setTargetAtTime( self._outputLevel, now, DEFAULT_TIME_CONSTANT );
      }
      else {
        self.masterGainNode.gain.setTargetAtTime( 0, now, DEFAULT_TIME_CONSTANT );
      }
    } );

    // @private {function} - internally used disposal function
    this.disposeSoundGenerator = function() {

      // clearing this observable array should cause the properties within it to be unlinked
      self.enableControlProperties.clear();
    };
  }

  tambo.register( 'SoundGenerator', SoundGenerator );

  return inherit( Object, SoundGenerator, {

    /**
     * connect the sound generator to an audio parameter
     * @param {AudioParam} audioParam
     * @public
     */
    connect: function( audioParam ) {
      this.masterGainNode.connect( audioParam );

      // Track this sound generator's connections.  This is necessary because Web Audio doesn't support checking which
      // nodes are connected to which, and we need this information when disconnecting.
      this.connectionList.push( audioParam );
    },

    /**
     * disconnect the sound generator from an audio parameter
     * @param {AudioParam} audioParam
     * @public
     */
    disconnect: function( audioParam ) {
      this.masterGainNode.disconnect( audioParam );
      this.connectionList = _.without( this.connectionList, audioParam );
    },

    /**
     * test if this sound generator is connected to the provided audio param
     * @param {AudioParam} audioParam
     * @returns {boolean}
     * @public
     */
    isConnectedTo: function( audioParam ) {
      return this.connectionList.indexOf( audioParam ) >= 0;
    },

    /**
     * set output level of the sound generator
     * @param {number} outputLevel - generally between 0 and 1, but doesn't have to be
     * @param {number} [timeConstant] - time constant for outputLevel change, see AudioParam.setTargetAtTime
     */
    setOutputLevel: function( outputLevel, timeConstant ) {
      this._outputLevel = outputLevel;
      if ( this._enabled ) {
        this.masterGainNode.gain.setTargetAtTime(
          outputLevel,
          this.audioContext.currentTime,
          timeConstant || DEFAULT_TIME_CONSTANT
        );
      }
    },

    /**
     * add a property to the list of those used to control the enabled state of this sound generator
     * @param {BooleanProperty} enableControlProperty
     */
    addEnableControlProperty: function( enableControlProperty ) {
      this.enableControlProperties.push( enableControlProperty );
    },

    /**
     * remove the provided enable control property from the list of those being used by this sound generator
     * @param {BooleanProperty} enableControlProperty
     */
    removeEnableControlProperty: function( enableControlProperty ) {
      this.enableControlProperties.remove( enableControlProperty );
    },

    /**
     * get the current output level
     * @return {number}
     * @public
     */
    get outputLevel() {
      return this._outputLevel;
    },

    /**
     * @public
     */
    get locallyEnabled() {
      return this.locallyEnabledProperty.get();
    },
    set locallyEnabled( locallyEnabled ) {
      this.locallyEnabledProperty.set( locallyEnabled );
    },

    /**
     * public
     * @return {boolean}
     */
    get fullyEnabled() {
      return this.fullyEnabledProperty.get();
    },

    /**
     * @public
     */
    dispose: function() {
      this.disposeSoundGenerator();
    }
  }, {

    // statics
    DEFAULT_TIME_CONSTANT: DEFAULT_TIME_CONSTANT
  } );
} );