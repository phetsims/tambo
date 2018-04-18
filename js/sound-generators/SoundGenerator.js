// Copyright 2018, University of Colorado Boulder

/**
 * abstract base class for sound generators that work in conjunction with the sonification manager
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DisplayedProperty = require( 'SCENERY/util/DisplayedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sonificationManager = require( 'TAMBO/sonificationManager' );
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

      // A Scenery node that, if provided, must be visible in the display for the sound to be played.  This is generally
      // used only for sounds that can play for long durations, such as a looping sound clip.
      associatedViewNode: null,

      // By default, the audio context created and used by the sonification manager is used, but this can be overridden
      // if desired.  In general, this will only be done for testing.
      audioContext: sonificationManager.AUDIO_CONTEXT,

      // This flag controls whether the output of this sound generator is immediately connected to the audio context
      // destination.  This is useful for testing, but should not be set to true if this sound generator is being used
      // in conjunction with the sonification manager.
      connectImmediately: false
    }, options );

    // @protected {AudioContext}
    this.audioContext = options.audioContext;

    // @private {number}
    this._outputLevel = options.initialOutputLevel;

    // @private {boolean}
    this._enabled = true;

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

    // if a view node was specified, mute the sound if the node is not visible
    var nodeDisplayedProperty = null;
    if ( options.associatedViewNode ) {
      nodeDisplayedProperty = new DisplayedProperty( options.associatedViewNode, phet.joist.display );
      nodeDisplayedProperty.link( function( displayed ) {
        self.setEnabled( displayed );
      } );
    }

    // @private {function} - interally used disposal function
    this.disposeSoundGenerator = function() {
      if ( nodeDisplayedProperty ) {
        nodeDisplayedProperty.dispose();
      }
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
     * get the current output level
     * @return {number}
     * @public
     */
    get outputLevel() {
      return this._outputLevel;
    },

    /**
     * Set this sound generator to be enabled or disabled.  Sets the gain of the master gain node to zero when disabled,
     * other actions may be needed in subclasses.
     * @param {boolean} enabled
     * @public
     * TODO: Need to handle multiple reasons why disabled, and only enable fully if thare are no reasons for it to be
     * disabled.  Reasons that I (jbphet) can think of: reset in progress, associated node not visible, sim not visible...
     */
    setEnabled: function( enabled ) {
      if ( this._enabled !== enabled ) {
        var now = this.audioContext.currentTime;
        if ( enabled ) {
          this.masterGainNode.gain.setTargetAtTime( this._outputLevel, now, DEFAULT_TIME_CONSTANT );
        }
        else {
          this.masterGainNode.gain.setTargetAtTime( 0, now, DEFAULT_TIME_CONSTANT );
        }
        this._enabled = enabled;
      }
    },

    isEnabled: function() {
      return this._enabled;
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