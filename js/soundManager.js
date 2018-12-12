// Copyright 2018, University of Colorado Boulder

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
  const SoundLevelEnum = require( 'TAMBO/SoundLevelEnum' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const emptySound = require( 'sound!TAMBO/empty.mp3' );
  const reverbImpulseResponse = require( 'sound!TAMBO/empty_apartment_bedroom_06_resampled.mp3' );

  // constants
  const DEFAULT_REVERB_LEVEL = 0.02;
  const TC_FOR_PARAM_CHANGES = 0.015; // in seconds, time constant for param changes, empirically determined to avoid clicks

  // flag that tracks whether sound generation of any kind is enabled
  const enabledProperty = new BooleanProperty( phet.chipper.queryParameters.sound === 'enabled' );

  // flag that tracks whether enhanced sounds are enabled (basic sounds are always enabled if sound generation is)
  const enhancedSoundEnabledProperty = new BooleanProperty( phet.chipper.queryParameters.enhancedSoundInitiallyEnabled );

  // next ID number value, used to assign a unique ID to each sound generator that is registered
  let nextIdNumber = 1;

  // {Array.<{ soundGenerator:SoundGenerator, sonificationLevel:string, id:string }>} - array where the sound generators
  // are stored along with information about how to manage them
  let soundGeneratorInfoArray = [];

  // output level for the master gain node when sonification is enabled, valid range is 0 to 1
  let masterOutputLevel = 1;

  // reverb level, needed because some browsers don't support reading of gain values, see methods for more info
  let _reverbLevel = DEFAULT_REVERB_LEVEL;

  // A map of class name to GainNode instances that control gains for that class name, will be filled in during init,
  // see the usage of options.classes in the initialize function for more information.
  const gainNodesForClasses = {};

  // flag that tracks whether the sonification manager has been initialized
  let initialized = false;

  /**
   * sonification manager object definition
   */
  const soundManager = {

    /**
     * Property that corresponds to the enabled state setting
     * @public (read-only)
     */
    enabledProperty: enabledProperty,

    /**
     * Property that corresponds to the sonification level setting
     * @public (read-only)
     */
    enhancedSoundEnabledProperty: enhancedSoundEnabledProperty,

    /**
     * Initialize the sonification manager. This function must be invoked before any sound generators can be added.
     * @param {BooleanProperty} simVisibleProperty
     * @param {BooleanProperty} simActiveProperty
     * @param {Object} [options]
     */
    initialize: function( simVisibleProperty, simActiveProperty, options ) {

      assert && assert( !initialized, 'can\'t initialize the sound manager more than once' );
      const self = this;

      options = _.extend( {

        // Classes that can be used to group sound generators together and control their volume as a group - the names
        // can be anything that will work as a key for a JavaScript object, but initially we've chosen to use names
        // with conventions similar to what is commonly seen for CSS classes.
        classes: [ 'sim-specific', 'user-interface' ]

      }, options );

      // validate the options
      assert && assert( typeof Array.isArray( options.classes ), 'unexpected type for options.classes' );
      assert && assert(
        _.every( options.classes, className => { return typeof className === 'string'; } ),
        'unexpected type of element in options.classes'
      );

      const now = phetAudioContext.currentTime;

      // the final stage is a dynamics compressor that is used essentially as a limiter to prevent clipping
      // TODO: This dynamics compressor was added due to a problem where generation of some sounds in rapid succession
      // was causing clipping, see https://github.com/phetsims/resistance-in-a-wire/issues/182.  I (jbphet) am not sure
      // if there is a better way to do this, if there are undesirable consequences to doing this, or if it can be
      // configured better.  This comment is a reminder to "keep our eye" on this.  This comment was added in November
      // 2018, so if this has been working well for, say, six months, we should remove the comment and go with it.
      const dynamicsCompressor = phetAudioContext.createDynamicsCompressor();
      dynamicsCompressor.threshold.setValueAtTime( -6, now );
      dynamicsCompressor.knee.setValueAtTime( 5, now );
      dynamicsCompressor.ratio.setValueAtTime( 12, now );
      dynamicsCompressor.attack.setValueAtTime( 0, now );
      dynamicsCompressor.release.setValueAtTime( 0.25, now );
      dynamicsCompressor.connect( phetAudioContext.destination );

      // create the master gain node for all sounds managed by this sonification manager
      this.masterGainNode = phetAudioContext.createGain();
      this.masterGainNode.connect( dynamicsCompressor );

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

      // hook up a listener that turns down the gain if sonification is disabled or if the sim isn't visible or isn't
      // active
      Property.multilink(
        [ this.enabledProperty, simVisibleProperty, simActiveProperty ],
        ( enabled, simVisible, simActive ) => {
          const gain = enabled && simVisible && simActive ? masterOutputLevel : 0;
          this.masterGainNode.gain.setTargetAtTime( gain, phetAudioContext.currentTime, TC_FOR_PARAM_CHANGES );
        }
      );

      if ( platform.mobileSafari ) {

        // When running on iOS, we sometimes see the audio context get set to the "interrupted" state if the user
        // switches to a different tab and plays sound.  This code resumes the audio context if it is in that state
        // when the tab containing the sim becomes visible again, see
        // https://github.com/phetsims/resistance-in-a-wire/issues/199.
        simVisibleProperty.lazyLink( function( simVisible ) {
          if ( simVisible && phetAudioContext.state === 'interrupted' ) {
            phetAudioContext.resume();
          }
        } );
      }

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
     * and returns a unique ID
     * @param {SoundGenerator} soundGenerator
     * @param {Object} [options]
     * @returns {string|null} - unique ID of sound generator, null if add not allowed
     */
    addSoundGenerator: function( soundGenerator, options ) {

      // Check if initialization has been done.  This is not an assertion because the sound manager may not be
      // initialized if sound is not enabled for the sim.
      if ( !initialized ) {
        console.warn( 'an attempt was made to add a sound generator to an uninitialized sound manager, ignoring (sound will not be produced)' );
        return null;
      }

      // verify that this is not a duplicate addition
      let duplicateAdd = _.some( soundGeneratorInfoArray, soundGeneratorInfo => {
        return soundGeneratorInfo.soundGenerator === soundGenerator;
      } );
      assert && assert( !duplicateAdd, 'can\'t add the same sound generator twice' );

      // default options
      options = _.extend( {

        // {string} - The 'sonification level' is used to determine whether a given sound should be enabled given the
        // setting of the sonification level parameter for the sim.  Valid values are 'BASIC' or 'ENHANCED'.
        sonificationLevel: SoundLevelEnum.BASIC,

        // {Node|null} - A Scenery node that, if provided, must be visible in the display for the sound generator to be
        // enabled.  This is generally used only for sounds that can play for long durations, such as a looping sound
        // clip.
        associatedViewNode: null,

        // {string} - class name for this sound, which can be used to group sounds together an control them as a group
        className: null
      }, options );

      // validate the options
      assert && assert(
        _.values( SoundLevelEnum ).includes( options.sonificationLevel ),
        'invalid value for sonification level: ' + options.sonificationLevel
      );

      // connect the sound generator to an output path
      if ( options.className === null ) {
        soundGenerator.connect( this.convolver );
        soundGenerator.connect( this.dryGainNode );
      }
      else {
        soundGenerator.connect( gainNodesForClasses[ options.className ] );
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
      if ( options.sonificationLevel === SoundLevelEnum.ENHANCED ) {
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

      // Check if the sound manager is initialized and, if not, issue a warning and ignore the request.  This is not an
      // assertion because the sound manager may not be initialized in cases where the sound is not enabled for the
      // simulation, but this method can still end up being invoked.
      if ( !initialized ) {
        console.warn( 'an attempt was made to remove a sound generator from an uninitialized sound manager, ignoring' );
        return null;
      }

      // find the info object for this sound generator
      let soundGeneratorInfo = null;
      for ( let i = 0; i < soundGeneratorInfoArray.length; i++ ) {
        if ( soundGeneratorInfoArray[ i ].soundGenerator === soundGenerator ) {

          // found it
          soundGeneratorInfo = soundGeneratorInfoArray[ i ];
          break;
        }
      }

      // make sure it is actually present on the list
      assert && assert( soundGeneratorInfo, 'unable to remove sound generator - not found' );

      // disconnect the sound generator from any audio nodes to which it may be connected
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
      soundGeneratorInfoArray = _.without( soundGeneratorInfoArray, soundGeneratorInfo );
    },

    /**
     * set the master output level for sonification
     * @param {number} level - valid values from 0 (min) through 1 (max)
     * @public
     */
    setMasterOutputLevel: function( level ) {

      // Check if initialization has been done.  This is not an assertion because the sound manager may not be
      // initialized if sound is not enabled for the sim.
      if ( !initialized ) {
        console.warn( 'an attempt was made to set the master output level on an uninitialized sound manager, ignoring' );
        return null;
      }

      // range check
      assert && assert( level >= 0 && level <= 1, 'output level value out of range: ' + level );

      masterOutputLevel = level;
      if ( enabledProperty.get() ) {
        this.masterGainNode.gain.setTargetAtTime( level, phetAudioContext.currentTime, TC_FOR_PARAM_CHANGES );
      }
    },
    set masterOutputLevel( outputLevel ) {
      this.setMasterOutputLevel( outputLevel );
    },

    /**
     * get the current output level setting
     * @return {number}
     */
    getMasterOutputLevel: function() {
      return masterOutputLevel;
    },
    get masterOutputLevel() {
      return this.getMasterOutputLevel();
    },

    /**
     * set the output level for the specified class of sound generator
     * @param {String} className - name of class to which this invocation applies
     * @param {number} outputLevel - valid values from 0 through 1
     * @public
     */
    setOutputLevelForClass: function( className, outputLevel ) {

      // Check if initialization has been done.  This is not an assertion because the sound manager may not be
      // initialized if sound is not enabled for the sim.
      if ( !initialized ) {
        console.warn( 'an attempt was made to set the output level for a sound class on an uninitialized sound manager, ignoring' );
        return null;
      }

      assert && assert( initialized, 'output levels for classes cannot be added until initialization has been done' );

      // range check
      assert && assert( outputLevel >= 0 && outputLevel <= 1, 'output level value out of range: ' + outputLevel );

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

      // Check if initialization has been done.  This is not an assertion because the sound manager may not be
      // initialized if sound is not enabled for the sim.
      if ( !initialized ) {
        console.warn( 'an attempt was made to get the output level for a sound class on an uninitialized sound manager, returning 0' );
        return 0;
      }

      // verify that the specified class exists
      assert && assert( gainNodesForClasses[ className ], 'no class with name = ' + className );

      return gainNodesForClasses[ className ].value;
    },

    /**
     * set the amount of reverb
     * @param {number} newReverbLevel - value from 0 to 1, 0 = totally dry, 1 = wet
     */
    setReverbLevel: function( newReverbLevel ) {

      // Check if initialization has been done.  This is not an assertion because the sound manager may not be
      // initialized if sound is not enabled for the sim.
      if ( !initialized ) {
        console.warn( 'an attempt was made to set the reverb level on an uninitialized sound manager, ignoring' );
        return null;
      }

      assert && assert( newReverbLevel >= 0 && newReverbLevel <= 1, 'reverb value out of range: ' + newReverbLevel );
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

    /**
     * ES5 setter for sonification level
     * @param {string} sonificationLevel
     */
    set sonificationLevel( sonificationLevel ) {
      assert && assert(
        _.values( SoundLevelEnum ).includes( sonificationLevel ),
        'invalid sonification level: ' + sonificationLevel
      );
      enhancedSoundEnabledProperty.set( sonificationLevel === SoundLevelEnum.ENHANCED );
    },

    /**
     * ES5 getter for sonification level
     * @returns {string}
     */
    get sonificationLevel() {
      return enhancedSoundEnabledProperty.get() ? SoundLevelEnum.ENHANCED : SoundLevelEnum.BASIC;
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
    }
  };

  tambo.register( 'soundManager', soundManager );

  return soundManager;
} );