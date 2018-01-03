// Copyright 2017, University of Colorado Boulder

/**
 * singleton type that registers sound generators used for sonification
 */

define( function( require ) {
  'use strict';

  // modules
  var tambo = require( 'TAMBO/tambo' );

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

  // helper function to update the enabled state of a sound generator
  function updateSoundGeneratorEnabledState( sgInfo, resetInProgress, selectedScreenIndex, simVisible ){
    sgInfo.soundGenerator.setEnabled(
      simVisible &&
      selectedScreenIndex === sgInfo.screenNumber &&
      !( resetInProgress && sgInfo.disabledDuringReset )
    );
  }

  // NOTE: singleton pattern
  var SonificationManager = {

    /**
     * @public (read-only)
     */
    audioContext: audioContext,

    /**
     * initialize the sonification manager
     * @param {BooleanProperty} resetInProgressProperty
     * @param {NumberProperty} screenIndexProperty
     * @param {BooleanProperty} simVisibleProperty
     * @public
     */
    initialize: function( resetInProgressProperty, screenIndexProperty, simVisibleProperty ){

      assert && assert( initialized, 'can only initialize once' );

      // disable sound generators when a reset is in progress
      resetInProgressProperty.lazyLink( function( resetInProgress ){
        _.values( soundGeneratorInfo ).forEach( function( sgInfo ){
          updateSoundGeneratorEnabledState(
            sgInfo,
            resetInProgress,
            screenIndexProperty.get(),
            simVisibleProperty.get()
          );
        } );
      } );

      // enable sound generation for the currently selected screen, disable others
      screenIndexProperty.link( function( selectedScreen ){
        _.values( soundGeneratorInfo ).forEach( function( sgInfo ){
          updateSoundGeneratorEnabledState(
            sgInfo,
            resetInProgressProperty.get(),
            selectedScreen,
            simVisibleProperty.get()
          );
        } );
      } );

      // only allow sound generation when the sim is visible
      simVisibleProperty.link( function( simVisible ){
        _.values( soundGeneratorInfo ).forEach( function( sgInfo ){
          updateSoundGeneratorEnabledState(
            sgInfo,
            resetInProgressProperty.get(),
            screenIndexProperty.get(),
            simVisible
          );
        } );
      } );

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
        disabledDuringReset: true
      }, options );

      // connect the sound generation to the audio context unless the options indicate otherwise
      if ( options.connect ){
        soundGenerator.connect( audioContext.destination );
      }

      // create the registration ID for this sound generator
      var id = 'sg' + idNumber++;

      // register the sound generator along with additional information about it
      soundGeneratorInfo[ id ] = {
        soundGenerator: soundGenerator,
        screenNumber: screenNumber,
        disabledDuringReset: options.disabledDuringReset
      };

      return id;
    }
  };

  tambo.register( 'SonificationManager', SonificationManager );

  return SonificationManager;
} );