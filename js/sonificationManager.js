// Copyright 2017, University of Colorado Boulder

/**
 * singleton object that registers sound generators and connects them to the audio output
 *
 * provides:
 *  - master enable/disable
 *  - master gain control
 *  - enable/disable of sounds based on visibility of the browser tab in which the sim is running
 *  - enabled/disable of sounds based on which tab is showing
 *  - muting of sounds during reset
 *  - master gain for sounds in general
 *  - enable/disable of sounds based on their assigned sonification level (e.g. "basic" or "enhanced")
 *  - gain control for sounds based on their assigned class, e.g. UI versus sim-specific sounds
 *  - a shared reverb unit to add some spatialization and make all sounds seem to originate with the same room
 *
 * TODO: It might make more sense to have this functionality in the base class of an audio view object.  Consider that.
 */

define( function( require ) {
  'use strict';

  // modules
  var tambo = require( 'TAMBO/tambo' );
  var Multilink = require( 'AXON/Multilink' );

  // constants
  var DEFAULT_REVERB_LEVEL = 0.2;
  var IMPULSE_RESPONSE_FILE_PATH = '../../common/audio/CathedralRoom.mp3';
  var TC_FOR_PARAM_CHANGES = 0.015; // time constant for param changes, empirically determined to avoid clicks

  // Create the audio context that should be used by all sounds registered with the sonification manager.  This is done
  // in order to limit the number of audio contexts that are created, since browsers generally only allow a limited
  // number per tab.
  var audioContext = new ( window.AudioContext || window.webkitAudioContext )();

  // flag to track whether this singleton has been initialized
  var initialized = false;

  // ID number value, incremented each time a sound generator is added in order to create a unique ID
  var idNumber = 1;

  // object where the sound generators are stored with information about how to manage them
  var soundGeneratorInfo = {};

  // define the master gain stage and hook it to the output
  var masterGainNode = audioContext.createGain();
  masterGainNode.connect( audioContext.destination );

  // create the convolver, which will be used to create the reverb effect
  var convolver = audioContext.createConvolver();

  // create the gain nodes that will control the reverb level and hook them up
  var reverbGainNode = audioContext.createGain();
  reverbGainNode.connect( masterGainNode );
  reverbGainNode.gain.setValueAtTime( DEFAULT_REVERB_LEVEL, audioContext.currentTime );
  convolver.connect( reverbGainNode );
  var dryGainNode = audioContext.createGain();
  dryGainNode.gain.setValueAtTime( 1 - DEFAULT_REVERB_LEVEL, audioContext.currentTime );
  dryGainNode.connect( masterGainNode );

  // load the reverb impulse response
  // TODO: This should be migrated to use the audio plugin when we start using it in real sims.  It is not using it
  // now to make things easier in the sonification wrappers.  If both continue to coexist, we may need to work out a
  // way to make the audio plugin work in the sonification wrappers.
  var request = new XMLHttpRequest();
  request.open( 'GET', IMPULSE_RESPONSE_FILE_PATH, true );
  request.responseType = 'arraybuffer';

  // decode the sound asynchronously
  request.onload = function() {
    audioContext.decodeAudioData(
      request.response,
      function( buffer ) {
        convolver.buffer = buffer;
      },
      function( err ) {
        console.error( 'error loading impulse response ' + IMPULSE_RESPONSE_FILE_PATH + ', url: ' + ', err: ' );
      }
    );
  };
  request.send();

  /**
   * definition of the singleton object
   */
  var sonificationManager = {

    /**
     * @public (read-only)
     */
    audioContext: audioContext,

    /**
     * initialize the sonification manager
     * @param {BooleanProperty} resetInProgressProperty
     * @param {NumberProperty} selectedScreenIndexProperty
     * @param {BooleanProperty} simVisibleProperty
     * @param {StringProperty} sonificationLevelProperty
     * @public
     */
    initialize: function( resetInProgressProperty, 
                          selectedScreenIndexProperty, 
                          simVisibleProperty, 
                          sonificationLevelProperty ){

      assert && assert( initialized, 'can only call initialize once' );
      
      // set up the multilink that will enable and disable sounds as the conditions in the sim change
      this.soundControlMultilink = new Multilink(
        [ resetInProgressProperty, selectedScreenIndexProperty, simVisibleProperty, sonificationLevelProperty ],
        function( resetInProgress, screenIndex, simVisible, sonificationLevel ){
          _.values( soundGeneratorInfo ).forEach( function( sgInfo ){
            sgInfo.soundGenerator.setEnabled(
              simVisible &&
              screenIndex === sgInfo.screenNumber &&
              !( resetInProgress && sgInfo.disabledDuringReset ) &&
              sonificationLevel >= sgInfo.sonificationLevel
            );
          } );
        }
      );
      
      initialized = true;
    },

    /**
     * register the sound generator, which connects it to the output, puts it on the list of sound generators, and
     * creates and returns a unique ID
     * @param {Object} soundGenerator - TODO: make type more specific when a base class exists
     * @param {number} screenNumber - the screen number with which this sound generator is associated
     * @param {Object} [options]
     * context, if this is not present the sound generator WILL be connected
     */
    registerSoundGenerator: function( soundGenerator, screenNumber, options ){

      // make sure this has been initialized
      assert && assert( initialized, 'can\'t register sound generators prior to initialization' );

      // default options
      options = _.extend( {
        connect: true,
        disabledDuringReset: true,

        // The 'sonification level' is used to determine whether a given sound should be enabled given the setting of
        // the sonification level value for the sim.  Valid values are 1 for 'basic' and 2 for 'enhanced'.  Numeric
        // values are used to enable the use of comparison operators.
        sonificationLevel: 1
      }, options );

      // connect the sound generation to the audio context unless the options indicate otherwise
      if ( options.connect ){
        soundGenerator.connect( convolver );
        soundGenerator.connect( dryGainNode );
      }

      // create the registration ID for this sound generator
      var id = 'sg' + idNumber++;

      // register the sound generator along with additional information about it
      soundGeneratorInfo[ id ] = {
        soundGenerator: soundGenerator,
        screenNumber: screenNumber,
        disabledDuringReset: options.disabledDuringReset,
        sonificationLevel: options.sonificationLevel
      };

      return id;
    },

    /**
     * set the master output level for sonification
     * @param {number} outputLevel - valid values from 0 through 1
     */
    setOutputLevel: function( outputLevel ){

      // range check
      assert && assert( outputLevel >= 0 && outputLevel <= 1, 'output level value out of range' );

      masterGainNode.setValueAtTime( outputLevel, audioContext.currentTime );
    },

    /**
     * get the current output level setting
     * @return {number}
     */
    getOutputLevel: function(){
      return masterGainNode.gain.value;
    },

    /**
     * set the amount of reverb
     * @param {number} reverbLevel - value from 0 to 1, 0 = totally dry, 1 = wet
     */
    setReverbLevel: function( reverbLevel ){
      assert && assert ( reverbLevel >= 0 && reverbLevel <= 1 );
      var now = audioContext.currentTime;
      reverbGainNode.gain.setTargetAtTime( reverbLevel, now, TC_FOR_PARAM_CHANGES );
      dryGainNode.gain.setTargetAtTime( 1 - reverbLevel, now, TC_FOR_PARAM_CHANGES );
    },

    getReverbLevel: function(){
      // TODO: Test if this works in all browser, add a var to track if not.
      return reverbGainNode.gain.value;
    }
  };

  tambo.register( 'sonificationManager', sonificationManager );

  return sonificationManager;
} );