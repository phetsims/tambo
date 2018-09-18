// Copyright 2017, University of Colorado Boulder

/**
 * A singleton object that registers sound generators, connects them to the audio output, and provides a number of
 * related services, such as:
 *  - master enable/disable
 *  - master gain control
 *  - enable/disable of sounds based on visibility of an associated Scenery node
 *  - enable/disable of sounds based on their assigned sonification level (e.g. "basic" or "enhanced")
 *  - gain control for sounds based on their assigned class, e.g. UI versus sim-specific sounds
 *  - a shared reverb unit to add some spatialization and make all sounds seem to originate with the same space
 *
 *  The singleton object must be initialized before sound generators can be added.
 */
define( function( require ) {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Display = require( 'SCENERY/display/Display' );
  const DisplayedProperty = require( 'SCENERY/util/DisplayedProperty' );
  const phetAudioContext = require( 'TAMBO/phetAudioContext' );
  const platform = require( 'PHET_CORE/platform' );
  const Property = require( 'AXON/Property' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundInfoDecoder = require( 'TAMBO/soundInfoDecoder' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const reverbImpulseResponse = require( 'sound!TAMBO/empty_apartment_bedroom_06_resampled.mp3' );
  const emptySound = require( 'sound!TAMBO/empty.mp3' );

  //REVIEW with the exception of TC_FOR_PARAM_CHANGES, these constants are used in 1 place, better to inline them?
  // constants
  const DEFAULT_REVERB_LEVEL = 0.02;
  //REVIEW time units?
  const TC_FOR_PARAM_CHANGES = 0.015; // time constant for param changes, empirically determined to avoid clicks
  const SOUND_INITIALLY_ENABLED = phet.chipper.queryParameters.soundInitiallyEnabled;
  const ENHANCED_SOUND_INITIALLY_ENABLED = phet.chipper.queryParameters.enhancedSoundInitiallyEnabled;

  // flag that tracks whether sound generation of any kind is enabled
  //REVIEW a bit confusing to have both a constant and this.enabledProperty, consider inlining
  const enabledProperty = new BooleanProperty( SOUND_INITIALLY_ENABLED );

  // flag that tracks whether enhanced sounds are enabled (basic sounds are always enabled if sound generation is)
  //REVIEW same comment as enabledProperty
  const enhancedSoundEnabledProperty = new BooleanProperty( ENHANCED_SOUND_INITIALLY_ENABLED );

  // next ID number value, used to assign a unique ID to each sound generator that is registered
  let nextIdNumber = 1;

  //REVIEW needs a type expression, probably {Array.<{soundGenerator:SoundGenerator,sonificationLevel:string, id:string}>}, or pointer to where to look
  // array where the sound generators are stored along with information about how to manage them
  let soundGeneratorInfoArray = [];

  //REVIEW document range
  //REVIEW related functions (setOutputLevel, getOutputLevel,...) don't indicate that they are related to "master"
  // output level for the master gain node when sonification is enabled
  let masterOutputLevel = 1;

  //REVIEW document range here, or refer to doc for setReverbLevel
  // reverb level, needed because some browsers don't support reading of gain values
  let _reverbLevel = DEFAULT_REVERB_LEVEL;

  //REVIEW better doc, looks like this is a map from class name -> {Node}?
  //REVIEW Does "classes" refer to the doc for initialize() options.classes?
  // gain nodes for each of the defined "classes", will be defined during init
  const gainNodesForClasses = {};

  // flag that tracks whether the sonification manager has been initialized
  let initialized = false;

  /**
   * sonification manager object definition
   */
  const soundManager = {

    //REVIEW sentences without capitalization and punctuation.
    /**
     * initialize the sonification manager - this function must be invoked before any sound generators can be added
     * @param {BooleanProperty} simVisibleProperty
     * @param {Object} [options]
     */
    initialize: function( simVisibleProperty, options ) {

      assert && assert( !initialized, 'can\'t initialize the sound manager more than once' );
      const self = this;

      options = _.extend( {

        // Classes that can be used to group sound generators together and control their volume as a group - the names
        // can be anything that will work as a key for a JavaScript object, but initially we've chosen to use names
        // with conventions similar to what is commonly seen for CSS classes.
        classes: [ 'sim-specific', 'user-interface' ]

      }, options );

      // validate the options
      //REVIEW should the assertion check be Array.isArray( options.classes ) ?
      assert && assert( typeof options.classes === 'object', 'unexpected type for options.classes' );
      assert && assert(
        _.every( options.classes, className => { return typeof className === 'string'; } ),
        'unexpected type for options.classes' //REVIEW message should be 'unexpected type of element in options.classes'
      );

      // create the master gain node for all sounds managed by this sonification manager
      this.masterGainNode = phetAudioContext.createGain();
      this.masterGainNode.connect( phetAudioContext.destination );

      // convolver node, which will be used to create the reverb effect
      this.convolver = phetAudioContext.createConvolver();

      // gain node that will control the reverb level
      this.reverbGainNode = phetAudioContext.createGain();
      this.reverbGainNode.connect( this.masterGainNode );
      this.reverbGainNode.gain.setValueAtTime( _reverbLevel, phetAudioContext.currentTime );
      this.convolver.connect( this.reverbGainNode );

      // dry (non-reverbed) portion of the output
      this.dryGainNode = phetAudioContext.createGain();
      this.dryGainNode.gain.setValueAtTime( 1 - _reverbLevel, phetAudioContext.currentTime );
      this.dryGainNode.connect( this.masterGainNode );

      // load the reverb impulse response into the convolver
      soundInfoDecoder.decode(
        reverbImpulseResponse,
        phetAudioContext,
        decodedAudioData => { self.convolver.buffer = decodedAudioData; },
        () => {

          // error handler, we haven't seen this happen, so for now just log a message to the console
          console.log( 'Error: Unable to decode audio data.' );
        }
      );

      // create and hook up gain nodes for each of the defined classes
      options.classes.forEach( className => {
        const gainNode = phetAudioContext.createGain();
        gainNode.connect( this.convolver );
        gainNode.connect( this.dryGainNode );
        gainNodesForClasses[ className ] = gainNode;
      } );

      // hook up a listener that turns down the gain if sonification is disabled or the sim isn't visible
      Property.multilink(
        [ this.enabledProperty, simVisibleProperty ],
        ( enabled, simVisible ) => {
          const gain = enabled && simVisible ? masterOutputLevel : 0;
          this.masterGainNode.gain.setTargetAtTime( gain, phetAudioContext.currentTime, TC_FOR_PARAM_CHANGES );
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
                phetAudioContext.resume().catch( err => {
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
          const emptySoundClip = new SoundClip( emptySound, { connectImmediately: true } );
          const playSilence = function() {
            emptySoundClip.play();
            window.removeEventListener( 'touchstart', playSilence, false );
          };
          window.addEventListener( 'touchstart', playSilence, false );
        }
      }

      initialized = true;
    },

    /**
     * add a sound generator, which connects it to the audio path, puts it on the list of sound generators, and creates
     * and
     * returns a unique ID
     * @param {SoundGenerator} soundGenerator
     * @param {Object} [options]
     * @returns {string|null} - unique ID of sound generator, null if add not allowed
     */
    addSoundGenerator: function( soundGenerator, options ) {

      //REVIEW why isn't this an assertion?
      if ( !initialized ) {
        console.warn( 'an attempt was made to add a sound generator to an uninitialized sound manager, ignoring (sound will not be produced)' );
        return null;
      }

      // verify that this is not a duplicate addition
      let duplicateAdd = _.some( soundGeneratorInfoArray, sgInfo => {
        return sgInfo.soundGenerator === soundGenerator;
      } );
      assert && assert( !duplicateAdd, 'can\'t add the same sound generator twice' );

      // default options
      options = _.extend( {

        //REVIEW document this
        connect: true,

        //REVIEW {string}
        // The 'sonification level' is used to determine whether a given sound should be enabled given the setting of
        // the sonification level parameter for the sim.  Valid values are 'basic' or 'enhanced'.
        sonificationLevel: 'basic',

        //REVIEW {Node|null} ?
        // A Scenery node that, if provided, must be visible in the display for the sound generator to be enabled.  This
        // is generally used only for sounds that can play for long durations, such as a looping sound clip.
        associatedViewNode: null,

        //REVIEW {string} ?
        // class name for this sound, which can be used to group sounds together an control them as a group
        className: null
      }, options );

      //REVIEW validate options.sonficationLevel

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
      const id = 'sg-' + nextIdNumber++;

      // keep a record of the sound generator along with additional information about it
      const soundGeneratorInfo = {
        soundGenerator: soundGenerator,
        sonificationLevel: options.sonificationLevel,
        id: id
      };
      soundGeneratorInfoArray.push( soundGeneratorInfo );

      // add the global enable Property to the list of Properties that enable this sound generator
      soundGenerator.addEnableControlProperty( enabledProperty );

      // if this sound generator is only enabled in enhanced mode, add the enhanced mode Property as an enable control
      if ( options.sonificationLevel === 'enhanced' ) {
        soundGenerator.addEnableControlProperty( enhancedSoundEnabledProperty );
      }

      // if a view node was specified, create and pass in a boolean Property that is true only when the node is displayed
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

      //REVIEW why isn't this an assertion?
      if ( !initialized ) {
        console.warn( 'an attempt was made to remove a sound generator from an uninitialized sound manager, ignoring' );
        return null;
      }

      // find the info object for this sound generator
      //REVIEW above you used soundGeneratorInfo, here you use sgInfoObject, especially important to be consistent in this case
      let sgInfoObject = null;
      for ( let i = 0; i < soundGeneratorInfoArray.length; i++ ) {
        if ( soundGeneratorInfoArray[ i ].soundGenerator === soundGenerator ) {

          // found it
          sgInfoObject = soundGeneratorInfoArray[ i ];
          break;
        }
      }

      // make sure it is actually present on the list
      //REVIEW should there be some way to identify a specific sound generator is assertion messages?
      assert && assert( sgInfoObject, 'unable to remove sound generator - not found' );

      //REVIEW move this to SoundGenerator.disconnectAll ?
      // disconnect the sound generator from any nodes to which it may be connected
      if ( soundGenerator.isConnectedTo( this.convolver ) ) {
        soundGenerator.disconnect( this.convolver );
      }
      if ( soundGenerator.isConnectedTo( this.dryGainNode ) ) {
        soundGenerator.disconnect( this.dryGainNode );
      }
      _.values( gainNodesForClasses ).forEach( gainNode => {
        if ( soundGenerator.isConnectedTo( gainNode ) ) {
          soundGenerator.disconnect( gainNode );
        }
      } );

      // remove the sound generator from the list
      soundGeneratorInfoArray = _.without( soundGeneratorInfoArray, sgInfoObject );
    },

    //REVIEW rename to setMasterOutputLevel? Similar for other functions related to masterOutputLevel.
    /**
     * set the master output level for sonification
     * @param {number} outputLevel - valid values from 0 (min) through 1 (max)
     * @public
     */
    setOutputLevel: function( outputLevel ) {

      // range check
      //REVIEW include outputLevel in message
      assert && assert( outputLevel >= 0 && outputLevel <= 1, 'output level value out of range' );

      masterOutputLevel = outputLevel;
      if ( enabledProperty.get() ) {
        this.masterGainNode.gain.setTargetAtTime( outputLevel, phetAudioContext.currentTime, TC_FOR_PARAM_CHANGES );
      }
    },
    set outputLevel( outputLevel ) {
      this.setOutputLevel( outputLevel );
    },

    /**
     * get the current output level setting
     * @return {number}
     */
    getOutputLevel: function() {
      return masterOutputLevel;
    },
    get outputLevel() {
      return this.getOutputLevel();
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
      //REVIEW include outputLevel in message
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
     * @param {number} newReverbLevel - value from 0 to 1, 0 = totally dry, 1 = wet
     */
    setReverbLevel: function( newReverbLevel ) {
      //REVIEW add assertion message that includes newReverbLevel
      assert && assert( newReverbLevel >= 0 && newReverbLevel <= 1 );
      let now = phetAudioContext.currentTime;
      this.reverbGainNode.gain.setTargetAtTime( newReverbLevel, now, TC_FOR_PARAM_CHANGES );
      this.dryGainNode.gain.setTargetAtTime( 1 - newReverbLevel, now, TC_FOR_PARAM_CHANGES );
      _reverbLevel = newReverbLevel;
    },
    set reverbLevel( reverbLevel ) {
      this.setReverbLevel( reverbLevel );
    },

    getReverbLevel: function() {
      return _reverbLevel;
    },
    get reverbLevel() {
      return this.getReverbLevel();
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

    //REVIEW Consider relocating earlier in the source code, since this.enabledProperty is referenced in initialize.
    //REVIEW With a singleton, I think it's clearer to define fields before functions.
    /**
     * Property that corresponds to the enabled state setting
     * @public (read-only)
     */
    enabledProperty: enabledProperty,

    /**
     * ES5 setter for sonification level
     * @param {string} sonificationLevel
     */
    set sonificationLevel( sonificationLevel ) {
      //REVIEW 'basic' occurs 4 time in this file, 'enhanced' occurs 5 times. Maybe that's OK.
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
     * get the ID for a sound generator, null if the provided sound generator isn't registered
     * @param {SoundGenerator} soundGenerator
     * @return {string}
     */
    getSoundGeneratorId: function( soundGenerator ) {
      let id = null;
      soundGeneratorInfoArray.forEach( soundGeneratorInfo => {
        if ( soundGeneratorInfo.soundGenerator === soundGenerator ) {
          id = soundGeneratorInfo.id;
        }
      } );
      return id;
    },

    //REVIEW Same comment as enabledProperty above, define fields before functions in singletons.
    /**
     * Property that corresponds to the sonification level setting
     * @public (read-only)
     */
    enhancedSoundEnabledProperty: enhancedSoundEnabledProperty
  };

  tambo.register( 'soundManager', soundManager );

  return soundManager;
} );