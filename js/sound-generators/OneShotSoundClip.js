// Copyright 2018, University of Colorado Boulder

/**
 * sound generator that plays pre-recorded sound clips
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
  function OneShotSoundClip( soundInfo, options ) {

    options = _.extend( {

      // This option controls whether sound generation can be initiated when this sound generator is disabled.  This
      // is useful when a sound is long, so if the user does something that generally would cause a sound, but sound
      // is disable, and they immediately re-enable it, the "tail" of this sound would be heard.
      initiateWhenDisabled: true

    }, options );

    // a list of active source buffers, used so that this clip can be played again before previous play finishes
    this.activeSources = [];

    // @public {boolean} - see description in options above
    this.initiateWhenDisabled = options.initiateWhenDisabled;

    SoundClip.call( this, soundInfo, options );
  }

  tambo.register( 'OneShotSoundClip', OneShotSoundClip );

  return inherit( SoundClip, OneShotSoundClip, {

    /**
     * function to start playing of the sound
     * @public
     */
    play: function() {

      var self = this;
      if ( this.initiateWhenDisabled || this.fullyEnabled ) {

        if ( this.soundBuffer ) {

          // TODO: Do we really need to do all of this every time to play the sound, or can some of it be set up in constructor?
          var source = this.audioContext.createBufferSource();
          source.buffer = this.soundBuffer;
          source.connect( this.masterGainNode );
          this.activeSources.push( source );
          source.onended = function() {

            // remove the source from the list of active sources
            var indexOfSource = self.activeSources.indexOf( source );
            if ( indexOfSource > -1 ) {
              self.activeSources.splice( indexOfSource );
            }
          };
          var now = this.audioContext.currentTime;
          source.playbackRate.setValueAtTime( this.playbackRate, now );
          source.start( now );
        }
        else {

          // the play method was called before the sound buffer finished loading, create an action that play the sound
          // once the loading has completed
          this.loadCompleteAction = function() { self.play(); };
        }
      }
    },

    /**
     * stop playing the sound - usage of this is pretty rare for a one-shot sound
     */
    stop: function() {
      if ( this.soundBuffer ) {
        this.activeSources.forEach( function( source ) {
          source.stop();
        } );
        this.activeSources = [];
      }
      else {

        // this was called before the sound finished loading, cancel any previously created actions
        this.loadCompleteAction = null;
      }
    }

  } );

} );