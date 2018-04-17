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
  var SonificationManager = require( 'TAMBO/SonificationManager' );
  var tambo = require( 'TAMBO/tambo' );

  // constants
  var DEFAULT_TC = 0.015; // empirically determined to be fast but not cause clicks when applied to gain

  /**
   * @param {Object} options
   * @constructor
   */
  function SoundClip( options ) {

    var self = this;

    options = _.extend( {

      initialOutputLevel: 1,
      loop: false,

      // A Scenery node that, if provided, must be visible in the display for the sound to be played.  This is generally
      // used only for sounds that can play for long durations, such as a looping sound clip.
      associatedViewNode: null,

      // By default, the audio context created and used by the sonification manager is used, but this can be overridden
      // if desired.  In general, this will only be done for testing.
      audioContext: SonificationManager.instance.audioContext,

      // This flag controls whether the output of this sound generator is immediately connected to the audio context
      // destination.  This is useful for testing, but should not be set to true if this sound generator is being used
      // in conjunction with the sonification manager.
      connectImmediately: false
    }, options );

    // @private {Object}
    this.options = options;

    // @private {number}
    this._outputLevel = options.initialOutputLevel;

    // @private {boolean}
    this._enabled = true;

    // @protected {GainNode) - master gain control that will be used to control the volume of the sound
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.gain.setTargetAtTime(
      this._outputLevel,
      this.audioContext.currentTime,
      DEFAULT_TC
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
        self.enabled = displayed;
      } );
    }

    // @private {function} - interally used disposal function
    this.disposeSoundClip = function() {
      if ( nodeDisplayedProperty ) {
        nodeDisplayedProperty.dispose();
      }
    };
  }

  tambo.register( 'SoundClip', SoundClip );

  return inherit( Object, SoundClip, {

    /**
     * connect the sound generator to an audio parameter
     * @param {AudioParam} audioParam
     * @public
     */
    connect: function( audioParam ) {
      this.masterGainNode.connect( audioParam );
    },

    /**
     * set outputLevel of the playing sound
     * @param {number} outputLevel - between 0 and 1.
     * @param {number} [timeConstant] - time constant for outputLevel change, see AudioParam.setTargetAtTime
     */
    set outputLevel()
:

  function( outputLevel, timeConstant ) {
    outputLevel = Math.max( 0, outputLevel );
    outputLevel = Math.min( 1, outputLevel );
    this.outputLevel = outputLevel;
    if ( this.enabled ) {
      this.masterGainNode.gain.setTargetAtTime(
        outputLevel,
        this.audioContext.currentTime,
        timeConstant || DEFAULT_TC
      );
    }
  }

,

  /**
   * @return {number}
   */
  getOutputLevel: function() {
    return this.outputLevel;
  }
,

  /**
   * Set this sound clip to be enabled or disabled.  This uses the master gain node so that if the sound is looping
   * it can be easily re-enabled without having to restart the sound.
   * @param {boolean} enabled
   * @public
   */
  setEnabled: function( enabled ) {
    if ( this.enabled !== enabled ) {
      var now = this.audioContext.currentTime;
      if ( this.options.loop ) {

        // if this sound clip is a loop, just manipulate the output level so that it doesn't have to restart
        if ( enabled ) {
          this.masterGainNode.gain.setTargetAtTime( this.outputLevel, now, DEFAULT_TC );
        }
        else {
          this.masterGainNode.gain.setTargetAtTime( 0, now, DEFAULT_TC );
        }
      }
      else {
        this.stop();
      }
      this.enabled = enabled;
    }
  }
,

  /**
   * @public
   */
  dispose: function() {
    this.disposeSoundClip();
  }

} )
  ;

} );