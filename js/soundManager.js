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
 *  - a shared reverb unit to add some spatialization and make all sounds seem to originate with the same space
 *
 *  The singleton object must be initialized before sound generators can be added.
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Display = require( 'SCENERY/display/Display' );
  var DisplayedProperty = require( 'SCENERY/util/DisplayedProperty' );
  var OneShotSoundClip = require( 'TAMBO/sound-generators/OneShotSoundClip' );
  var phetAudioContext = require( 'TAMBO/phetAudioContext' );
  var platform = require( 'PHET_CORE/platform' );
  var Property = require( 'AXON/Property' );
  var soundInfoDecoder = require( 'TAMBO/soundInfoDecoder' );
  var tambo = require( 'TAMBO/tambo' );

  // audio
  var reverbImpulseResponse = require( 'audio!TAMBO/empty-apartment-bedroom-06.mp3' );
  var empty = require( 'audio!TAMBO/empty.mp3' );

  // constants
  var DEFAULT_REVERB_LEVEL = 0.2;
  var TC_FOR_PARAM_CHANGES = 0.015; // time constant for param changes, empirically determined to avoid clicks
  var SOUND_INITIALLY_ENABLED = phet.chipper.queryParameters.soundInitiallyEnabled;
  var ENHANCED_SOUND_INITIALLY_ENABLED = phet.chipper.queryParameters.enhancedSoundInitiallyEnabled;

  // flag that tracks whether sound generation of any kind is enabled
  var enabledProperty = new BooleanProperty( SOUND_INITIALLY_ENABLED );

  // flag that tracks whether just basic or basic+enhanced sounds are enabled
  var enhancedSoundEnabledProperty = new BooleanProperty( ENHANCED_SOUND_INITIALLY_ENABLED );

  // next ID number value, used to assign a unique ID to each sound generator that is registered
  var nextIdNumber = 1;

  // array where the sound generators are stored along with information about how to manage them
  var soundGeneratorInfoArray = [];

  // output level for the master gain node when sonification is enabled
  var masterOutputLevel = 1;

  // list of reset-in-progress properties, one should be supplied for each screen
  var resetInProgressProperties = [];

  // a local property that is true when no resets are happening (which would presumably be most of the time) and goes
  // false when a reset is in progress
  var noResetInProgressProperty = new BooleanProperty( true );

  // gain nodes for each of the defined "classes", will be defined during init
  var gainNodesForClasses = {};

  // flag that tracks whether the sonification manager has been initialized
  var initialized = false;

  /**
   * sonification manager object definition
   */
  var soundManager = {

    /**
     * initialize the sonification manager - this function must be invoked before any sound generators can be added
     * @param {BooleanProperty} simVisibleProperty
     * @param {Object} [options]
     */
    initialize: function( simVisibleProperty, options ) {

      assert && assert( !initialized, 'can\'t initialize the sound manager more than once' );
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

      // create the master gain node for all sounds managed by this sonification manager
      this.masterGainNode = phetAudioContext.createGain();
      this.masterGainNode.connect( phetAudioContext.destination );

      // convolver node, which will be used to create the reverb effect
      this.convolver = phetAudioContext.createConvolver();

      // gain node that will control the reverb level
      this.reverbGainNode = phetAudioContext.createGain();
      this.reverbGainNode.connect( this.masterGainNode );
      this.reverbGainNode.gain.setValueAtTime( DEFAULT_REVERB_LEVEL, phetAudioContext.currentTime );
      this.convolver.connect( this.reverbGainNode );

      // dry (non-reverbed) portion of the output
      this.dryGainNode = phetAudioContext.createGain();
      this.dryGainNode.gain.setValueAtTime( 1 - DEFAULT_REVERB_LEVEL, phetAudioContext.currentTime );
      this.dryGainNode.connect( this.masterGainNode );

      // load the reverb impulse response into the convolver
      soundInfoDecoder.decode(
        reverbImpulseResponse,
        phetAudioContext,
        function( decodedAudioData ) {
          self.convolver.buffer = decodedAudioData;
        },
        function() {

          // we haven't seen this happen, so for now a message is logged to the console and that's it
          console.log( 'Error: Unable to decode audio data.' );
        }
      );

      // create and hook up gain nodes for each of the defined classes
      options.classes.forEach( function( className ) {
        var gainNode = phetAudioContext.createGain();
        gainNode.connect( self.convolver );
        gainNode.connect( self.dryGainNode );
        gainNodesForClasses[ className ] = gainNode;
      } );

      // hook up a listener that turns down the gain if sonification is disabled or the sim isn't visible
      Property.multilink(
        [ this.enabledProperty, simVisibleProperty ],
        function( enabled, simVisible ) {
          var gain = enabled && simVisible ? masterOutputLevel : 0;
          self.masterGainNode.gain.setTargetAtTime( gain, phetAudioContext.currentTime, TC_FOR_PARAM_CHANGES );
        }
      );

      // Below is some platform-specific code for handling some issues related to audio.  It may be possible to remove
      // some or all of this as Web Audio becomes more consistently implemented.
      if ( phetAudioContext ) {

        if ( !platform.mobileSafari ) {

          // In some browsers the audio context is not allowed to run before the user interacts with the simulation.
          // The motivation for this is to prevent auto-play of sound (mostly videos) when users land on websites, but
          // it ends up preventing PhET sims from being able to play sound.  To deal with this, we add a listener that
          // can check the state of the audio context and "resume" it if necessary when the user starts interacting with
          // the sim.  See https://github.com/phetsims/vibe/issues/32 and https://github.com/phetsims/tambo/issues/9 for
          // more information.
          if ( phetAudioContext.state !== 'running' ) {

            Display.userGestureEmitter.addListener( function resumeAudioContext() {
              if ( phetAudioContext.state !== 'running' ) {

                // the audio context isn't running, so tell it to resume
                phetAudioContext.resume().catch( function( err ) {
                  assert && assert( false, 'error when trying to resume audio context, err = ' + err );
                } );
              }
              Display.userGestureEmitter.removeListener( resumeAudioContext ); // only do this once
            } );
          }
        }
        else {

          // There is a different issue for audio on iOS+Safari: On this platform, we must play an audio file from a
          // thread initiated by a user event such as touchstart before any sounds will play.  This requires the user to
          // touch the screen before audio can be played. See
          // http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api
          var silence = new OneShotSoundClip( empty, { connectImmediately: true } );
          var playSilence = function() {
            silence.play();
            window.removeEventListener( 'touchstart', playSilence, false );
          };
          window.addEventListener( 'touchstart', playSilence, false );
        }
      }

      initialized = true;
    },

    /**
     * get a value that indicates whether the sound manager has been initialized
     * TODO: This was added when the global controls in joist were not yet on master, and was necessary to allow the
     * demo sim to run, and may not be needed in the long term.  Added 7/10/2018, if not in use a month or two after
     * that, remove it.
     * @return {boolean}
     */
    isInitialized: function() {
      return initialized;
    },

    /**
     * register a sound generator, which connects it to the output, puts it on the list of sound generators, and
     * creates and returns a unique ID
     * @param {SoundGenerator} soundGenerator
     * @param {Object} [options]
     * @returns {string|null} - unique ID of sound generator, null if add not allowed
     */
    addSoundGenerator: function( soundGenerator, options ) {

      if ( !initialized ) {
        console.warn( 'an attempt was made to add a sound generator to an uninitialized sound manager, ignoring (sound will not be created)' );
        return null;
      }

      // verify that this is not a duplicate addition
      var duplicateAdd = _.some( soundGeneratorInfoArray, function( sgInfo ) {
        return sgInfo.soundGenerator === soundGenerator;
      } );
      assert && assert( !duplicateAdd, 'can\'t add the same sound generator twice' );

      // default options
      options = _.extend( {
        connect: true,
        disabledDuringReset: false,

        // The 'sonification level' is used to determine whether a given sound should be enabled given the setting of
        // the sonification level parameter for the sim.  Valid values are 'basic' or 'enhanced'.
        sonificationLevel: 'basic',

        // A Scenery node that, if provided, must be visible in the display for the sound generator to be enabled.  This
        // is generally used only for sounds that can play for long durations, such as a looping sound clip.
        associatedViewNode: null,

        // class name for this sound, which can be used to group sounds together an control them as a group
        className: null
      }, options );

      // validate the options
      assert && assert(
        !( options.connect === false && options.className ),
        'must connect sound generator if it is in a class'
      );

      // connect the sound generator to an output path unless the options indicate otherwise
      if ( options.connect ) {
        if ( options.className === null ) {
          soundGenerator.connect( this.convolver );
          soundGenerator.connect( this.dryGainNode );
        }
        else {
          soundGenerator.connect( gainNodesForClasses[ options.className ] );
        }
      }

      // create the registration ID for this sound generator
      var id = 'sg-' + nextIdNumber++;

      // keep a record of the sound generator along with additional information about it
      var soundGeneratorInfo = {
        soundGenerator: soundGenerator,
        disabledDuringReset: options.disabledDuringReset,
        sonificationLevel: options.sonificationLevel
      };
      soundGeneratorInfoArray.push( soundGeneratorInfo );

      // add the global enable property to the list of properties that enable this sound generator
      soundGenerator.addEnableControlProperty( enabledProperty );

      // if this sound generator should be disabled during reset, add an "enable control" property to make that happen
      if ( options.disabledDuringReset ) {
        soundGenerator.addEnableControlProperty( noResetInProgressProperty );
      }

      // if this sound generator is only enabled in enhanced mode, add the enhanced mode property as an enable control
      if ( options.sonificationLevel === 'enhanced' ) {
        soundGenerator.addEnableControlProperty( enhancedSoundEnabledProperty );
      }

      // if a view node was specified, create and pass in a boolean property that is true only when the node is displayed
      if ( options.associatedViewNode ) {
        soundGenerator.addEnableControlProperty(
          new DisplayedProperty( options.associatedViewNode, phet.joist.display )
        );
      }

      return id;
    },

    /**
     * remove the specified sound generator
     * @param {SoundGenerator} soundGenerator
     * @public
     */
    removeSoundGenerator: function( soundGenerator ) {

      if ( !initialized ) {
        console.warn( 'an attempt was made to remove a sound generator from an uninitialized sound manager, ignoring' );
        return null;
      }

      // find the info object for this sound generator
      var sgInfoObject = null;
      for ( var i = 0; i < soundGeneratorInfoArray.length; i++ ) {
        if ( soundGeneratorInfoArray[ i ].soundGenerator === soundGenerator ) {

          // found it
          sgInfoObject = soundGeneratorInfoArray[ i ];
          break;
        }
      }

      // make sure it is actually present on the list
      assert && assert( sgInfoObject, 'unable to remove sound generator - not found' );

      // disconnect the sound generator
      // TODO - add disconnect

      // remove the sound generator from the list
      soundGeneratorInfoArray = _.without( soundGeneratorInfoArray, sgInfoObject );
    },

    /**
     * set the master output level for sonification
     * @param {number} outputLevel - valid values from 0 (min) through 1 (max)
     * @public
     */
    setOutputLevel: function( outputLevel ) {

      // range check
      assert && assert( outputLevel >= 0 && outputLevel <= 1, 'output level value out of range' );

      masterOutputLevel = outputLevel;
      if ( enabledProperty.get() ) {
        this.masterGainNode.gain.setTargetAtTime( outputLevel, phetAudioContext.currentTime, TC_FOR_PARAM_CHANGES );
      }
    },

    /**
     * get the current output level setting
     * @return {number}
     */
    getOutputLevel: function() {
      return masterOutputLevel;
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

      gainNodesForClasses[ className ].gain.setValueAtTime( outputLevel, phetAudioContext.currentTime );
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
      var now = phetAudioContext.currentTime;
      this.reverbGainNode.gain.setTargetAtTime( reverbLevel, now, TC_FOR_PARAM_CHANGES );
      this.dryGainNode.gain.setTargetAtTime( 1 - reverbLevel, now, TC_FOR_PARAM_CHANGES );
    },

    getReverbLevel: function() {
      // TODO: Test if this works in all browser, add a var to track if not.
      return this.reverbGainNode.gain.value;
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
      enhancedSoundEnabledProperty.set( sonificationLevel === 'enhanced' );
    },

    /**
     * ES5 getter for sonification level
     * @returns {string}
     */
    get sonificationLevel() {
      return enhancedSoundEnabledProperty.get() ? 'enhanced' : 'basic';
    },

    /**
     * property that corresponds to the sonification level setting
     * @public (read-only)
     */
    enhancedSoundEnabledProperty: enhancedSoundEnabledProperty,

    /**
     * add a property that indicates that a reset is in progress for a screen, should be called 1x per screen
     * @param {BooleanProperty} resetProperty
     */
    addResetInProgressProperty: function( resetProperty ) {

      // keep a reference
      resetInProgressProperties.push( resetProperty );

      // update the local, collective property that tracks whether any reset is in progress
      resetProperty.link( function() {
        var resetInProgress = _.some( resetInProgressProperties, function( ripp ) {
          return ripp.value;
        } );
        noResetInProgressProperty.set( !resetInProgress );
      } );

      // no need to unhook anything since reset-in-progress properties are not expected to be removed
    }
  };

  tambo.register( 'soundManager', soundManager );

  return soundManager;
} );