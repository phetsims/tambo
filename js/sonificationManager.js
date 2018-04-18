// Copyright 2017, University of Colorado Boulder

/**
 * A singleton object that registers sound generators, connects them to the audio output, and provides a number of
 * related services, such as:
 *  - master enable/disable
 *  - master gain control
 *  - enable/disable of sounds based on visibility of an associated Scenery node
 *  - enabled/disable of sounds based on which tab is showing
 *  - muting of sounds during reset
 *  - master gain for sounds in general
 *  - enable/disable of sounds based on their assigned sonification level (e.g. "basic" or "enhanced")
 *  - gain control for sounds based on their assigned class, e.g. UI versus sim-specific sounds
 *  - a shared reverb unit to add some spatialization and make all sounds seem to originate with the same room
 *
 *  The singleton object must be initialized before sound generators can be added.
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var StringProperty = require( 'AXON/StringProperty' );
  var Multilink = require( 'AXON/Multilink' );
  var soundInfoDecoder = require( 'TAMBO/soundInfoDecoder' );
  var tambo = require( 'TAMBO/tambo' );

  // audio
  var reverbImpulseResponse = require( 'audio!TAMBO/empty-apartment-bedroom-06.mp3' );

  // constants
  var DEFAULT_REVERB_LEVEL = 0.2;
  var TC_FOR_PARAM_CHANGES = 0.015; // time constant for param changes, empirically determined to avoid clicks

  // Create the audio context that will be used by the sonification manager.
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // flag that tracks whether sound generation of any kind is enabled
  var enabledProperty = new BooleanProperty( true );

  // the level setting, either 'basic' or 'enhanced'
  var sonificationLevelProperty = new StringProperty( 'basic' );

  // next ID number value, used to assign a unique ID to each sound generator that is registered
  var nextIdNumber = 1;

  // object where the sound generators are stored along with information about how to manage them
  var soundGeneratorInfo = {};

  // master gain node for all sounds managed by this sonification manager
  var masterGainNode = audioContext.createGain();
  masterGainNode.connect( audioContext.destination );

  // convolver node, which will be used to create the reverb effect
  var convolver = audioContext.createConvolver();

  // gain node that will control the reverb level
  var reverbGainNode = audioContext.createGain();
  reverbGainNode.connect( masterGainNode );
  reverbGainNode.gain.setValueAtTime( DEFAULT_REVERB_LEVEL, audioContext.currentTime );
  convolver.connect( reverbGainNode );

  // dry (non-reverbed) portion of the output
  var dryGainNode = audioContext.createGain();
  dryGainNode.gain.setValueAtTime( 1 - DEFAULT_REVERB_LEVEL, audioContext.currentTime );
  dryGainNode.connect( masterGainNode );

  // load the reverb impulse response into the convolver
  soundInfoDecoder.decode(
    reverbImpulseResponse,
    audioContext,
    function( decodedAudioData ) {
      convolver.buffer = decodedAudioData;
    },
    function() {
      // we haven't seen this happen, so for now a message is logged to the console and that's it
      console.log( 'Error: Unable to decode audio data.' );
    }
  );

  // create the gain nodes for each of the defined "classes" and hook them up, will be defined during init
  var gainNodesForClasses = {};

  // flag that tracks whether the sonification manager has been initialized
  var initialized = false;

  /**
   * sonification manager object definition
   */
  var sonificationManager = {

    /**
     * initialize the sonificaiton manager, this function must be invoked before the sonification manager is used
     * @param {BooleanProperty} simVisibleProperty
     * @param {Object} [options]
     */
    initialize: function( simVisibleProperty, options ) {

      options = _.extend( {

        // Classes that can be used to group sound generators together and control their volume as a group - the names
        // can be anything that will work as a key for a JavaScript object, but initially we've chosen to use names
        // with conventions similar to what is commonly seen for CSS classes.
        classes: [ 'sim-specific', 'user-interface' ]

      }, options );

      // validate the options
      assert && assert( typeof options.classes === 'object', 'unexpected type for options.classes' );
      assert && assert(
        _.every( options.classes, function( className ) { return typeof className === 'string'; } ),
        'unexpected type for options.classes'
      );

      // create and hook up gain nodes for each of the defined classes
      options.classes.forEach( function( className ) {
        var gainNode = audioContext.createGain();
        gainNode.connect( convolver );
        gainNode.connect( dryGainNode );
        gainNodesForClasses[ className ] = gainNode;
      } );

      // set up the multilink that will enable and disable the sound generators as the conditions in the sim change
      this.soundControlMultilink = new Multilink(
        [
          enabledProperty,
          simVisibleProperty,
          sonificationLevelProperty
        ],
        function( enabled, simVisible, sonificationLevel ) {
          _.values( soundGeneratorInfo ).forEach( function( sgInfo ) {
            sgInfo.soundGenerator.setEnabled(
              enabled &&
              simVisible &&
              (sonificationLevel === 'enhanced' || sgInfo.sonificationLevel === 'basic')
            );
          } );
        }
      );

      initialized = true;
    },

    /**
     * register a sound generator, which connects it to the output, puts it on the list of sound generators, and
     * creates and returns a unique ID
     * @param {SoundGenerator} soundGenerator
     * @param {Object} [options]
     * @returns {string} - unique ID of sound generator
     */
    addSoundGenerator: function( soundGenerator, options ) {

      assert && assert( initialized, 'sound generators cannot be added until initialization has been done' );

      // default options
      options = _.extend( {
        connect: true,
        disabledDuringReset: true,

        // The 'sonification level' is used to determine whether a given sound should be enabled given the setting of
        // the sonification level parameter for the sim.  Valid values are 'basic' or 'enhanced'.
        sonificationLevel: 'basic',

        // class name for this sound, which can be used to group sounds together an control them as a group
        className: null
      }, options );

      // validate the options
      assert && assert(
        !(options.connect === false && options.className),
        'must connect sound generator if it is in a class'
      );

      // connect the sound generator to an output path unless the options indicate otherwise
      if ( options.connect ) {
        if ( options.className === null ) {
          soundGenerator.connect( convolver );
          soundGenerator.connect( dryGainNode );
        }
        else {
          soundGenerator.connect( gainNodesForClasses[ options.className ] );
        }
      }

      // create the registration ID for this sound generator
      var id = 'sg-' + nextIdNumber++;

      // register the sound generator along with additional information about it
      soundGeneratorInfo[ id ] = {
        soundGenerator: soundGenerator,
        disabledDuringReset: options.disabledDuringReset,
        sonificationLevel: options.sonificationLevel
      };

      return id;
    },

    /**
     * set the master output level for sonification
     * @param {number} outputLevel - valid values from 0 through 1
     * @public
     */
    setOutputLevel: function( outputLevel ) {

      // range check
      assert && assert( outputLevel >= 0 && outputLevel <= 1, 'output level value out of range' );

      masterGainNode.gain.setValueAtTime( outputLevel, audioContext.currentTime );
    },

    /**
     * get the current output level setting
     * @return {number}
     */
    getOutputLevel: function() {
      return masterGainNode.gain.value;
    },

    /**
     * set the output level for the specified class of sound generator
     * @param {String} className - name of class to which this invocation applies
     * @param {number} outputLevel - valid values from 0 through 1
     * @public
     */
    setOutputLevelForClass: function( className, outputLevel ) {

      assert && assert( initialized, 'output levels for classes cannot be added until initialization has been done' );

      // range check
      assert && assert( outputLevel >= 0 && outputLevel <= 1, 'output level value out of range' );

      // verify that the specified class exists
      assert && assert( gainNodesForClasses[ className ], 'no class with name = ' + className );

      gainNodesForClasses[ className ].gain.setValueAtTime( outputLevel, audioContext.currentTime );
    },

    /**
     * get the output level for the specified sound generator class
     * @param {String} className - name of class to which this invocation applies
     * @public
     */
    getOutputLevelForClass: function( className ) {

      assert && assert( initialized, 'output levels for classes cannot be obtained until initialization has been done' );

      // verify that the specified class exists
      assert && assert( gainNodesForClasses[ className ], 'no class with name = ' + className );

      return gainNodesForClasses[ className ].value;
    },

    /**
     * set the amount of reverb
     * @param {number} reverbLevel - value from 0 to 1, 0 = totally dry, 1 = wet
     */
    setReverbLevel: function( reverbLevel ) {
      assert && assert( reverbLevel >= 0 && reverbLevel <= 1 );
      var now = audioContext.currentTime;
      reverbGainNode.gain.setTargetAtTime( reverbLevel, now, TC_FOR_PARAM_CHANGES );
      dryGainNode.gain.setTargetAtTime( 1 - reverbLevel, now, TC_FOR_PARAM_CHANGES );
    },

    getReverbLevel: function() {
      // TODO: Test if this works in all browser, add a var to track if not.
      return reverbGainNode.gain.value;
    },

    /**
     * ES5 setter for enabled state
     * @param {boolean} enabled
     */
    set enabled( enabled ) {
      enabledProperty.set( enabled );
    },

    /**
     * ES5 getter for enabled state
     * @returns {boolean}
     */
    get enabled() {
      return enabledProperty.get();
    },

    /**
     * property that corresponds to the enabled state setting
     * @public (read-only)
     */
    enabledProperty: enabledProperty,

    /**
     * ES5 setter for sonification level
     * @param {string} sonificationLevel
     */
    set sonificationLevel( sonificationLevel ) {
      assert && assert( sonificationLevel === 'basic' || sonificationLevel === 'enhanced' );
      sonificationLevelProperty.set( sonificationLevel );
    },

    /**
     * ES5 getter for sonification level
     * @returns {string}
     */
    get sonificationLevel() {
      return sonificationLevelProperty.get();
    },

    /**
     * property that corresponds to the sonification level setting
     * @public (read-only)
     */
    sonificationLevelProperty: sonificationLevelProperty,

    // @public (read-only) {AudioContext}
    AUDIO_CONTEXT: audioContext
  };

  tambo.register( 'sonificationManager', sonificationManager );

  return sonificationManager;
} );