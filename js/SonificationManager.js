// Copyright 2017, University of Colorado Boulder

/**
 * a type that registers sound generators, connects them to the audio output, and provides a number of relates services,
 * such as:
 *  - master enable/disable
 *  - master gain control
 *  - enable/disable of sounds based on visibility of an associated Scenery node
 *  - enabled/disable of sounds based on which tab is showing
 *  - muting of sounds during reset
 *  - master gain for sounds in general
 *  - enable/disable of sounds based on their assigned sonification level (e.g. "basic" or "enhanced")
 *  - gain control for sounds based on their assigned class, e.g. UI versus sim-specific sounds
 *  - a shared reverb unit to add some spatialization and make all sounds seem to originate with the same room
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var StringProperty = require( 'AXON/StringProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Multilink = require( 'AXON/Multilink' );
  var tambo = require( 'TAMBO/tambo' );

  // constants
  var DEFAULT_REVERB_LEVEL = 0.2;
  var IMPULSE_RESPONSE_FILE_PATH = './audio/cathedral-room-impulse-response.mp3';
  var TC_FOR_PARAM_CHANGES = 0.015; // time constant for param changes, empirically determined to avoid clicks

  // Create the audio context that should be used by all sonification manager instances .  This is done in order to
  // limit the number of audio contexts that are created, since browsers generally only allow a limited number per tab.
  var audioContext = new ( window.AudioContext || window.webkitAudioContext )();

  /**
   * TODO: Document fully once this has stabilized
   * @param {BooleanProperty} simVisibleProperty
   * @param {Object} options
   * @public
   * @constructor
   */
  function SonificationManager( simVisibleProperty, options ) {

    // singleton pattern - if already constructed, return the existing instance
    if ( SonificationManager._instance ) {
      return SonificationManager._instance;
    }

    var self = this;

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

    // @public (read-only) {AudioContext} - audio context to use for all audio operations
    this.audioContext = audioContext;

    // @public {BooleanProperty} - flag that tracks whether sound generation of any kind is enabled
    this.enabledProperty = new BooleanProperty( true );

    // @public {StringProperty} - the level setting, either 'basic' or 'enhanced'
    this.levelProperty = new StringProperty( 'basic' );

    // @private {number} - next ID number value, used to assign a unique ID to each sound generator that is registered
    this.nextIdNumber = 1;

    // @private {Object} - object where the sound generators are stored along with information about how to manage them
    this.soundGeneratorInfo = {};

    // @private {GainNode} - master gain node for all sounds managed by this sonification manager
    this.masterGainNode = audioContext.createGain();
    this.masterGainNode.connect( audioContext.destination );

    // @private {ConvolverNode} - create the convolver, which will be used to create the reverb effect
    this.convolver = audioContext.createConvolver();

    // @private {GainNode} - gain node that will control the reverb level
    this.reverbGainNode = audioContext.createGain();
    this.reverbGainNode.connect( this.masterGainNode );
    this.reverbGainNode.gain.setValueAtTime( DEFAULT_REVERB_LEVEL, audioContext.currentTime );
    this.convolver.connect( this.reverbGainNode );

    // @private {GainNode} - dry (non-reverbed) portion of the output
    this.dryGainNode = audioContext.createGain();
    this.dryGainNode.gain.setValueAtTime( 1 - DEFAULT_REVERB_LEVEL, audioContext.currentTime );
    this.dryGainNode.connect( this.masterGainNode );

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
          self.convolver.buffer = buffer;
        },
        function( err ) {
          console.error( 'error loading impulse response ' + IMPULSE_RESPONSE_FILE_PATH + ', url: ' + ', err: ' );
        }
      );
    };
    request.send();

    // create the gain nodes for each of the defined "classes" and hook them up
    this.gainNodesForClasses = {};
    options.classes.forEach( function( className ) {
      var gainNode = audioContext.createGain();
      gainNode.connect( self.convolver );
      gainNode.connect( self.dryGainNode );
      self.gainNodesForClasses[ className ] = gainNode;
    } );

    // @private {Multilink} - set up the multilink that will enable and disable the sound generators as the conditions
    // in the sim change
    this.soundControlMultilink = new Multilink(
      [
        this.enabledProperty,
        simVisibleProperty,
        this.levelProperty
      ],
      function( soundsEnabled, simVisible, sonificationLevel ) {
        _.values( self.soundGeneratorInfo ).forEach( function( sgInfo ) {
          sgInfo.soundGenerator.setEnabled(
            soundsEnabled &&
            simVisible &&
            ( sonificationLevel === 'enhanced' || sgInfo.sonificationLevel === 'basic' )
          );
        } );
      }
    );

    // @private {SonificationManager} - instance reference
    SonificationManager._instance = this;
  }

  tambo.register( 'SonificationManager', SonificationManager );

  return inherit(
    Object,
    SonificationManager,
    {
      /**
       * register the sound generator, which connects it to the output, puts it on the list of sound generators, and
       * creates and returns a unique ID
       * @param {Object} soundGenerator - TODO: make type more specific when a base class exists
       * @param {Object} [options]
       * context, if this is not present the sound generator WILL be connected
       */
      addSoundGenerator: function( soundGenerator, options ) {

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
          !( options.connect === false && options.className ),
          'must connect sound generator if it is in a class'
        );

        // connect the sound generation to an output path unless the options indicate otherwise
        if ( options.connect ) {
          if ( options.className === null ) {
            soundGenerator.connect( this.convolver );
            soundGenerator.connect( this.dryGainNode );
          }
          else {
            soundGenerator.connect( this.gainNodesForClasses[ options.className ] );
          }
        }

        // create the registration ID for this sound generator
        var id = 'sg' + this.nextIdNumber++;

        // register the sound generator along with additional information about it
        this.soundGeneratorInfo[ id ] = {
          soundGenerator: soundGenerator,
          disabledDuringReset: options.disabledDuringReset,
          sonificationLevel: options.sonificationLevel
        };

        return id;
      },

      /**
       * set the overall enabled/disabled state for all sounds
       * @param {boolean} enabled
       * @public
       */
      setEnabled: function( enabled ) {
        this.enabledProperty.set( enabled );
      },

      /**
       * get the overall enabled/disabled state for all sounds
       * @returns {boolean}
       * @public
       */
      getEnabled: function() {
        return this.enabledProperty.get();
      },

      /**
       * set the master output level for sonification
       * @param {number} outputLevel - valid values from 0 through 1
       * @public
       */
      setOutputLevel: function( outputLevel ) {

        // range check
        assert && assert( outputLevel >= 0 && outputLevel <= 1, 'output level value out of range' );

        this.masterGainNode.gain.setValueAtTime( outputLevel, audioContext.currentTime );
      },

      /**
       * get the current output level setting
       * @return {number}
       */
      getOutputLevel: function() {
        return this.masterGainNode.gain.value;
      },

      /**
       * set the output level for the specified class of sound generator
       * @param {String} className - name of class to which this invocation applies
       * @param {number} outputLevel - valid values from 0 through 1
       * @public
       */
      setOutputLevelForClass: function( className, outputLevel ) {

        // range check
        assert && assert( outputLevel >= 0 && outputLevel <= 1, 'output level value out of range' );

        // verify that the specified class exists
        assert && assert( this.gainNodesForClasses[ className ], 'no class with name = ' + className );

        this.gainNodesForClasses[ className ].gain.setValueAtTime( outputLevel, audioContext.currentTime );
      },

      /**
       * get the output level for the specified sound generator class
       * @param {String} className - name of class to which this invocation applies
       * @public
       */
      getOutputLevelForClass: function( className ) {

        // verify that the specified class exists
        assert && assert( this.gainNodesForClasses[ className ], 'no class with name = ' + className );

        return this.gainNodesForClasses[ className ].value;
      },

      /**
       * set the amount of reverb
       * @param {number} reverbLevel - value from 0 to 1, 0 = totally dry, 1 = wet
       */
      setReverbLevel: function( reverbLevel ) {
        assert && assert( reverbLevel >= 0 && reverbLevel <= 1 );
        var now = audioContext.currentTime;
        this.reverbGainNode.gain.setTargetAtTime( reverbLevel, now, TC_FOR_PARAM_CHANGES );
        this.dryGainNode.gain.setTargetAtTime( 1 - reverbLevel, now, TC_FOR_PARAM_CHANGES );
      },

      getReverbLevel: function() {
        // TODO: Test if this works in all browser, add a var to track if not.
        return this.reverbGainNode.gain.value;
      }
    },
    {
      // statics

      /**
       * get the singleton instance
       * @return {SonificationManager}
       * @public
       */
      getInstance: function() {
        assert && assert(
          SonificationManager._instance,
          'SonificationManager must be constructed before getting instance'
        );
        return SonificationManager._instance;
      },
      get instance() { return SonificationManager.getInstance(); },

      /**
       * create an instance - this is the preferred approach for creating the singleton instance, but calling the
       * constructor works too
       *
       * for parameter descriptions, see the constructor
       *
       * @return {SonificationManager}
       * @public
       */
      createInstance: function( simVisibleProperty, options ) {
        assert && assert( !SonificationManager._instance, 'SonificationManager was already created' );

        // note that the instance property is set inside the constructor
        return new SonificationManager(
          simVisibleProperty,
          options
        );
      },

      isCreated: function() {
        return typeof SonificationManager._instance === 'object';
      },

      AUDIO_CONTEXT: audioContext
    }
  );
} );