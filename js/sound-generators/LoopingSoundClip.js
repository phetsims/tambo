// Copyright 2018, University of Colorado Boulder

/**
 * sound generator that plays a pre-recorded sound loop
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var tambo = require( 'TAMBO/tambo' );

  /**
   * @param {Object} soundInfo - An object that includes *either* a url that points to the sound to be played *or* a
   * base64-encoded version of the sound data.  The former is generally used when a sim is running in RequireJS mode,
   * the latter is used in built versions.
   * @param {Object} options
   * @constructor
   */
  function LoopingSoundClip( soundInfo, options ) {
    SoundClip.call( this, soundInfo, options );

    // @private {boolean}
    this._isPlaying = false;
  }

  tambo.register( 'LoopingSoundClip', LoopingSoundClip );

  return inherit( SoundClip, LoopingSoundClip, {

    /**
     * start playing the loop, restarts it if it's already running
     * @public
     */
    start: function() {

      if ( !this.isEnabled() ) {

        // ignore the play request if not enabled
        return;
      }

      var self = this;

      if ( this.soundBuffer ) {

        // TODO: Do we really need to do all of this every time to play the sound, or can some of it be set up in constructor?
        // @private {AudioBufferSourceNode}
        this.loopBufferSource = this.audioContext.createBufferSource();
        this.loopBufferSource.buffer = this.soundBuffer;
        this.loopBufferSource.connect( this.masterGainNode );
        this.loopBufferSource.loop = true;
        var now = this.audioContext.currentTime;
        this.loopBufferSource.playbackRate.setValueAtTime( this.playbackRate, now );
        this.loopBufferSource.start( now );
        this._isPlaying = true;
      }
      else {

        // the play method was called before the sound buffer finished loading, create an action that play the sound
        // once the loading has completed
        this.loadCompleteAction = function() { self.start(); };
      }
    },

    /**
     * stop playing of the loop - when started again, it will start from the begining of the loop
     * @public
     */
    stop: function() {
      if ( this.soundBuffer ) {
        this.loopBufferSource.stop();
        this._isPlaying = false;
      }
      else {

        // this was called before the sound finished loading, cancel any previously created actions
        this.loadCompleteAction = null;
      }
    },

    get isPlaying() {
      return this._isPlaying;
    }
  } );
} );