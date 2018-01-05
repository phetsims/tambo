// Copyright 2017, University of Colorado Boulder

/**
 * singleton type that registers sound generators used for sonification
 *
 * TODO: It might make more sense to have this functionality in the base class of an audio view object.  Consider that.
 */

define( function( require ) {
  'use strict';

  // modules
  var tambo = require( 'TAMBO/tambo' );
  var Multilink = require( 'AXON/Multilink' );

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

  // NOTE: singleton pattern
  var sonificationManager = {

    /**
     * @public (read-only)
     */
    audioContext: audioContext,

    /**
     * initialize the sonification manager
     * @param {BooleanProperty} resetInProgressProperty
     * @param {NumberProperty} screenIndexProperty
     * @param {BooleanProperty} simVisibleProperty
     * @param {StringProperty} sonificationLevelProperty
     * @public
     */
    initialize: function( resetInProgressProperty, screenIndexProperty, simVisibleProperty, sonificationLevelProperty ){

      assert && assert( initialized, 'can only initialize once' );

      // set up the multilink that will enable and disable sounds as the conditions in the sim change
      this.soundControlMultilink = new Multilink(
        [ resetInProgressProperty, screenIndexProperty, simVisibleProperty, sonificationLevelProperty ],
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
        soundGenerator.connect( audioContext.destination );
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
    }
  };

  tambo.register( 'sonificationManager', sonificationManager );

  return sonificationManager;
} );