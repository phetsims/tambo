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

    // @private {ObservableArray.<Object>} - A set of objects, each of which contains a boolean property and a flag
    // that indicates whether the property should be considered 'inverted'.  All propoerties that are non-inverted
    // have to have a value of true for this sound generator to produce sound, and all properties that are flagged as
    // inverted have to be false for sound to be produced.  These objects should be added through methods only, please
    // see the methods for more detail on what these look like.
    this.enableControlObjects = new ObservableArray();

    // @public (read-only) {BooleanProperty} - A property that tracks whether this sound generator is fully enabled,
    // meaning that all the enable control properties are in a state indicating that sound can be produced.  This
    // should only be updated in the listener function defined below, no where else.
    this.fullyEnabledProperty = new BooleanProperty( true );

    // listener that updates the state of fullyEnabledProperty when any of the enable control properties change
    function updateFullyEnabledState() {

      var allPositivesEnabled = true;
      var noInvertedsEnabled = true;
      self.enableControlObjects.forEach( function( enableControlObject ) {
        if ( enableControlObject.inverted ) {
          if ( enableControlObject.enableControlProperty.get() ) {
            noInvertedsEnabled = false;
          }
        }
        else {
          if ( !enableControlObject.enableControlProperty.get() ) {
            allPositivesEnabled = false;
          }
        }
      } );

      self.fullyEnabledProperty.set( allPositivesEnabled && noInvertedsEnabled );
    }

    // listen for new enable control properties and hook them up as they arrive
    this.enableControlObjects.addItemAddedListener( function( addedItem ) {
      addedItem.enableControlProperty.link( updateFullyEnabledState );
      self.enableControlObjects.addItemRemovedListener( function checkAndRemove( removedItem ) {
        if ( removedItem === addedItem ) {
          removedItem.enableControlProperty.unlink( updateFullyEnabledState );
          self.enableControlObjects.removeItemRemovedListener( checkAndRemove );
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
      // TODO: Fill this in.
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
     * @param {boolean} [inverted] - optional flag to indicate whether this property should be considered 'inverted',
     * meaning that it must be false for sound production to occur (something like resetInProgressProperty is a good
     * example of where this might be used).
     */
    addEnableControlProperty: function( enableControlProperty, inverted ) {

      inverted = typeof inverted === 'undefined' ? false : inverted;
      this.enableControlObjects.push( {
        enableControlProperty: enableControlProperty,
        inverted: inverted
      } );
    },

    /**
     * remove the provided enable control property from the list of those being used by this sound generator
     * @param {BooleanProperty} enableControlProperty
     */
    removeEnableControlProperty: function( enableControlProperty ) {

      var itemToRemove = null;
      for ( var i = 0; i < this.enableControlObjects.length; i++ ) {
        if ( this.enableControlObjects.get( i ).enableControlProperty === enableControlProperty ) {
          itemToRemove = this.enableControlObjects.get( i );
        }
      }
      assert && assert( itemToRemove !== null, 'attempt to remove enable control propert that is not preset' );
      this.enableControlObjects.remove( itemToRemove );
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