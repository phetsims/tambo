// Copyright 2018-2020, University of Colorado Boulder

/**
 * A singleton object that registers sound generators, connects them to the audio output, and provides a number of
 * related services, such as:
 *  - master enable/disable
 *  - master gain control
 *  - enable/disable of sounds based on visibility of an associated Scenery node
 *  - enable/disable of sounds based on their assigned sonification level (e.g. "basic" or "enhanced")
 *  - gain control for sounds based on their assigned category, e.g. UI versus sim-specific sounds
 *  - a shared reverb unit to add some spatialization and make all sounds seem to originate with the same space
 *
 *  The singleton object must be initialized before sound generators can be added.
 */
define( require => {
  'use strict';

  // modules
  const audioContextStateChangeMonitor = require( 'TAMBO/audioContextStateChangeMonitor' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Display = require( 'SCENERY/display/Display' );
  const DisplayedProperty = require( 'SCENERY/util/DisplayedProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const phetAudioContext = require( 'TAMBO/phetAudioContext' );
  const Property = require( 'AXON/Property' );
  const soundConstants = require( 'TAMBO/soundConstants' );
  const soundInfoDecoder = require( 'TAMBO/soundInfoDecoder' );
  const SoundLevelEnum = require( 'TAMBO/SoundLevelEnum' );
  const tambo = require( 'TAMBO/tambo' );
  const TamboQueryParameters = require( 'TAMBO/TamboQueryParameters' );
  const Tandem = require( 'TANDEM/Tandem' );

  // sounds
  const reverbImpulseResponse = require( 'sound!TAMBO/empty_apartment_bedroom_06_resampled.mp3' );

  // constants
  const DEFAULT_REVERB_LEVEL = 0.02;
  const LINEAR_GAIN_CHANGE_TIME = soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME; // in seconds
  const SOUND_MANAGER_TANDEM = Tandem.GENERAL.createTandem( 'soundManager' );

  /**
   * sonification manager object definition
   */
  class SoundManager {

    constructor() {

      // @public (read-only) {BooleanProperty} - global enabled state for sound generation
      this.enabledProperty = new BooleanProperty( phet.chipper.queryParameters.sound === 'enabled', {

        // so that tambo can be used in a wrapper it is necessary to short circuit tandem creation in some cases
        tandem: phet.inWrapper ? Tandem.OPT_OUT : SOUND_MANAGER_TANDEM.createTandem( 'enabledProperty' ),
        phetioDocumentation: 'If the sim contains sound, then this Property will toggle whether sound is enabled or ' +
                             'disabled.'
      } );

      // @public (read-only) {BooleanProperty} - enabled state for enhanced sounds
      this.enhancedSoundEnabledProperty = new BooleanProperty( phet.chipper.queryParameters.enhancedSoundInitiallyEnabled );

      // @private {Array.<{ soundGenerator:SoundGenerator, sonificationLevel:string }>} - array where the sound
      // generators are stored along with information about how to manage them
      this.soundGeneratorInfoArray = [];

      // @private {number} - output level for the master gain node when sonification is enabled, valid range is 0 to 1
      this._masterOutputLevel = 1;

      // @private {number} - reverb level, needed because some browsers don't support reading of gain values, see
      // methods for more info
      this._reverbLevel = DEFAULT_REVERB_LEVEL;

      // @private {Object} - a map of category name to GainNode instances that control gains for that category name,
      // will be filled in during init, see the usage of options.categories in the initialize function for more 
      // information.
      this.gainNodesForCategories = {};

      // @private {boolean} - flag that tracks whether the sonification manager has been initialized
      this.initialized = false;

      // @private {Object[]} - sound generators and options that were added before initialization and will be added once
      // initialization is complete
      this.soundGeneratorsAwaitingAdd = [];
    }

    /**
     * Initialize the sonification manager. This function must be invoked before any sound generators can be added.
     * @param {BooleanProperty} simVisibleProperty
     * @param {BooleanProperty} simActiveProperty
     * @param {Object} [options]
     */
    initialize( simVisibleProperty, simActiveProperty, options ) {

      assert && assert( !this.initialized, 'can\'t initialize the sound manager more than once' );

      options = merge( {

        // Categories that can be used to group sound generators together and control their volume as a group - the
        // names can be anything that will work as a key for a JavaScript object, but initially we've chosen to use
        // names with conventions similar to what is commonly seen for CSS classes.
        categories: [ 'sim-specific', 'user-interface' ]

      }, options );

      // validate the options
      assert && assert( typeof Array.isArray( options.categories ), 'unexpected type for options.categories' );
      assert && assert(
        _.every( options.categories, categoryName => typeof categoryName === 'string' ),
        'unexpected type of element in options.categories'
      );

      const now = phetAudioContext.currentTime;

      // the final stage is a dynamics compressor that is used essentially as a limiter to prevent clipping
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
      this.reverbGainNode.gain.setValueAtTime( this._reverbLevel, phetAudioContext.currentTime );
      this.convolver.connect( this.reverbGainNode );

      // dry (non-reverbed) portion of the output
      this.dryGainNode = phetAudioContext.createGain();
      this.dryGainNode.gain.setValueAtTime( 1 - this._reverbLevel, phetAudioContext.currentTime );
      this.dryGainNode.gain.linearRampToValueAtTime(
        1 - this._reverbLevel,
        phetAudioContext.currentTime + LINEAR_GAIN_CHANGE_TIME
      );
      this.dryGainNode.connect( this.masterGainNode );

      // load the reverb impulse response into the convolver
      soundInfoDecoder.decode(
        reverbImpulseResponse,
        phetAudioContext,
        decodedAudioData => { this.convolver.buffer = decodedAudioData; },
        () => {

          // error handler, we haven't seen this happen, so for now just log a message to the console
          console.log( 'Error: Unable to decode audio data.' );
        }
      );

      // create and hook up gain nodes for each of the defined categories
      options.categories.forEach( categoryName => {
        const gainNode = phetAudioContext.createGain();
        gainNode.connect( this.convolver );
        gainNode.connect( this.dryGainNode );
        this.gainNodesForCategories[ categoryName ] = gainNode;
      } );

      // hook up a listener that turns down the gain if sonification is disabled or if the sim isn't visible or isn't
      // active
      Property.multilink(
        [ this.enabledProperty, simVisibleProperty, simActiveProperty ],
        ( enabled, simVisible, simActive ) => {
          const gain = enabled && simVisible && simActive ? this._masterOutputLevel : 0;
          this.masterGainNode.gain.linearRampToValueAtTime(
            gain,
            phetAudioContext.currentTime + LINEAR_GAIN_CHANGE_TIME
          );
        }
      );

      // Handle the audio context state, both when changes occur and when it is initially muted.  As of this writing
      // (Feb 2019), there are some differences in how the audio context state behaves on different platforms, so the
      // code monitors different events and states to keep the audio context running.  As the behavior of the audio
      // context becomes more consistent across browsers, it may be possible to simplify this.
      if ( !phetAudioContext.isStubbed ) {

        // function to remove the listeners, used to avoid code duplication
        const removeUserInteractionListeners = () => {
          window.removeEventListener( 'touchstart', resumeAudioContext, false );
          if ( Display.userGestureEmitter.hasListener( resumeAudioContext ) ) {
            Display.userGestureEmitter.removeListener( resumeAudioContext );
          }
        };

        // listener that resumes the audio context
        const resumeAudioContext = () => {

          if ( phetAudioContext.state !== 'running' ) {

            phet.log && phet.log( 'audio context not running, attempting to resume, state = ' + phetAudioContext.state );

            // tell the audio context to resume
            phetAudioContext.resume()
              .then( () => {
                phet.log && phet.log( 'resume appears to have succeeded, phetAudioContext.state = ' + phetAudioContext.state );
                removeUserInteractionListeners();
              } )
              .catch( err => {
                const errorMessage = 'error when trying to resume audio context, err = ' + err;
                console.error( errorMessage );
                assert && alert( errorMessage );
              } );
          }
          else {

            // audio context is already running, no need to listen anymore
            removeUserInteractionListeners();
          }
        };

        // listen for a touchstart - this only works to resume the audio context on iOS devices (as of this writing)
        window.addEventListener( 'touchstart', resumeAudioContext, false );

        // listen for other user gesture events
        Display.userGestureEmitter.addListener( resumeAudioContext );

        // During testing, several use cases were found where the audio context state changes to something other than
        // the "running" state while the sim is in use (generally either "suspended" or "interrupted", depending on the
        // browser).  The following code is intended to handle this situation by trying to resume it right away.  GitHub
        // issues with details about why this is necessary are:
        // - https://github.com/phetsims/tambo/issues/58
        // - https://github.com/phetsims/tambo/issues/59
        // - https://github.com/phetsims/fractions-common/issues/82
        // - https://github.com/phetsims/friction/issues/173
        // - https://github.com/phetsims/resistance-in-a-wire/issues/190
        let previousAudioContextState = phetAudioContext.state;
        audioContextStateChangeMonitor.addStateChangeListener( phetAudioContext, state => {
          phet.log && phet.log(
            'audio context state changed, old state = ' +
            previousAudioContextState +
            ', new state = ' +
            state +
            ', audio context time = ' +
            phetAudioContext.currentTime
          );

          if ( previousAudioContextState === 'running' && state !== 'running' ) {

            phet.log && phet.log( 'attempting to resume audio context in ' + state + ' state' );

            // the audio context isn't running, so tell it to resume
            phetAudioContext.resume()
              .then( () => {
                phet.log && phet.log( 'resume of audio context completed, state = ' + phetAudioContext.state );
              } )
              .catch( err => {
                assert && assert( false, 'error when trying to resume audio context, err = ' + err );
              } );
          }

          previousAudioContextState = state;
        } );
      }

      this.initialized = true;

      // add any sound generators that were waiting for initialization to complete (must be done after init complete)
      this.soundGeneratorsAwaitingAdd.forEach( soundGeneratorAwaitingAdd => {
        this.addSoundGenerator( soundGeneratorAwaitingAdd.soundGenerator, soundGeneratorAwaitingAdd.options );
      } );
      this.soundGeneratorsAwaitingAdd.length = 0;
    }

    /**
     * Returns true if the soundGenerator has been added to the soundManager.
     * @param {SoundGenerator} soundGenerator
     * @returns {boolean}
     * @public
     */
    hasSoundGenerator( soundGenerator ) {
      return _.some(
        this.soundGeneratorInfoArray,
        soundGeneratorInfo => soundGeneratorInfo.soundGenerator === soundGenerator
      );
    }

    /**
     * add a sound generator, which connects it to the audio path, puts it on the list of sound generators, and creates
     * and returns a unique ID
     * @param {SoundGenerator} soundGenerator
     * @param {Object} [options]
     * @public
     */
    addSoundGenerator( soundGenerator, options ) {

      // Check if initialization has been done and, if not, queue the sound generator and its options for addition
      // once initialization is complete.  Note that when sound is not supported, initialization will never occur.
      if ( !this.initialized ) {
        this.soundGeneratorsAwaitingAdd.push( { soundGenerator: soundGenerator, options: options } );
        return;
      }

      // verify that this is not a duplicate addition
      const hasSoundGenerator = this.hasSoundGenerator( soundGenerator );
      assert && assert( !hasSoundGenerator, 'can\'t add the same sound generator twice' );

      // default options
      options = merge( {

        // {string} - The 'sonification level' is used to determine whether a given sound should be enabled given the
        // setting of the sonification level parameter for the sim.  Valid values are 'BASIC' or 'ENHANCED'.
        sonificationLevel: SoundLevelEnum.BASIC,

        // {Node|null} - A Scenery node that, if provided, must be visible in the display for the sound generator to be
        // enabled.  This is generally used only for sounds that can play for long durations, such as a looping sound
        // clip.
        associatedViewNode: null,

        // {string} - category name for this sound, which can be used to group sounds together an control them as a group
        categoryName: null
      }, options );

      // validate the options
      assert && assert(
        _.includes( _.values( SoundLevelEnum ), options.sonificationLevel ),
        'invalid value for sonification level: ' + options.sonificationLevel
      );

      // connect the sound generator to an output path
      if ( options.categoryName === null ) {
        soundGenerator.connect( this.convolver );
        soundGenerator.connect( this.dryGainNode );
      }
      else {
        soundGenerator.connect( this.gainNodesForCategories[ options.categoryName ] );
      }

      // keep a record of the sound generator along with additional information about it
      const soundGeneratorInfo = {
        soundGenerator: soundGenerator,
        sonificationLevel: options.sonificationLevel
      };
      this.soundGeneratorInfoArray.push( soundGeneratorInfo );

      // add the global enable Property to the list of Properties that enable this sound generator
      soundGenerator.addEnableControlProperty( this.enabledProperty );

      // if this sound generator is only enabled in enhanced mode, add the enhanced mode Property as an enable control
      if ( options.sonificationLevel === SoundLevelEnum.ENHANCED ) {
        soundGenerator.addEnableControlProperty( this.enhancedSoundEnabledProperty );
      }

      // if a view node was specified, create and pass in a boolean Property that is true only when the node is displayed
      if ( options.associatedViewNode ) {
        soundGenerator.addEnableControlProperty(
          new DisplayedProperty( options.associatedViewNode, phet.joist.display )
        );
      }
    }

    /**
     * remove the specified sound generator
     * @param {SoundGenerator} soundGenerator
     * @public
     */
    removeSoundGenerator( soundGenerator ) {

      // Check if the sound manager is initialized and, if not, issue a warning and ignore the request.  This is not an
      // assertion because the sound manager may not be initialized in cases where the sound is not enabled for the
      // simulation, but this method can still end up being invoked.
      if ( !this.initialized ) {
        console.warn( 'an attempt was made to remove a sound generator from an uninitialized sound manager, ignoring' );
        return null;
      }

      // find the info object for this sound generator
      let soundGeneratorInfo = null;
      for ( let i = 0; i < this.soundGeneratorInfoArray.length; i++ ) {
        if ( this.soundGeneratorInfoArray[ i ].soundGenerator === soundGenerator ) {

          // found it
          soundGeneratorInfo = this.soundGeneratorInfoArray[ i ];
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
      _.values( this.gainNodesForCategories ).forEach( gainNode => {
        if ( soundGenerator.isConnectedTo( gainNode ) ) {
          soundGenerator.disconnect( gainNode );
        }
      } );

      // remove the sound generator from the list
      this.soundGeneratorInfoArray = _.without( this.soundGeneratorInfoArray, soundGeneratorInfo );
    }

    /**
     * set the master output level for sonification
     * @param {number} level - valid values from 0 (min) through 1 (max)
     * @public
     */
    setMasterOutputLevel( level ) {

      // Check if initialization has been done.  This is not an assertion because the sound manager may not be
      // initialized if sound is not enabled for the sim.
      if ( !this.initialized ) {
        console.warn( 'an attempt was made to set the master output level on an uninitialized sound manager, ignoring' );
        return null;
      }

      // range check
      assert && assert( level >= 0 && level <= 1, 'output level value out of range: ' + level );

      this._masterOutputLevel = level;
      if ( this.enabledProperty.value ) {
        this.masterGainNode.gain.linearRampToValueAtTime(
          level,
          phetAudioContext.currentTime + LINEAR_GAIN_CHANGE_TIME
        );
      }
    }

    set masterOutputLevel( outputLevel ) {
      this.setMasterOutputLevel( outputLevel );
    }

    /**
     * get the current output level setting
     * @returns {number}
     */
    getMasterOutputLevel() {
      return this._masterOutputLevel;
    }

    get masterOutputLevel() {
      return this.getMasterOutputLevel();
    }

    /**
     * set the output level for the specified category of sound generator
     * @param {String} categoryName - name of category to which this invocation applies
     * @param {number} outputLevel - valid values from 0 through 1
     * @public
     */
    setOutputLevelForCategory( categoryName, outputLevel ) {

      // Check if initialization has been done.  This is not an assertion because the sound manager may not be
      // initialized if sound is not enabled for the sim.
      if ( !this.initialized ) {
        console.warn( 'an attempt was made to set the output level for a sound category on an uninitialized sound manager, ignoring' );
        return null;
      }

      assert && assert( this.initialized, 'output levels for categories cannot be added until initialization has been done' );

      // range check
      assert && assert( outputLevel >= 0 && outputLevel <= 1, 'output level value out of range: ' + outputLevel );

      // verify that the specified category exists
      assert && assert( this.gainNodesForCategories[ categoryName ], 'no category with name = ' + categoryName );

      this.gainNodesForCategories[ categoryName ].gain.setValueAtTime( outputLevel, phetAudioContext.currentTime );
    }

    /**
     * get the output level for the specified sound generator category
     * @param {String} categoryName - name of category to which this invocation applies
     * @public
     */
    getOutputLevelForCategory( categoryName ) {

      // Check if initialization has been done.  This is not an assertion because the sound manager may not be
      // initialized if sound is not enabled for the sim.
      if ( !this.initialized ) {
        console.warn( 'an attempt was made to get the output level for a sound category on an uninitialized sound manager, returning 0' );
        return 0;
      }

      // verify that the specified category exists
      assert && assert( this.gainNodesForCategories[ categoryName ], 'no category with name = ' + categoryName );

      return this.gainNodesForCategories[ categoryName ].value;
    }

    /**
     * set the amount of reverb
     * @param {number} newReverbLevel - value from 0 to 1, 0 = totally dry, 1 = wet
     */
    setReverbLevel( newReverbLevel ) {

      // Check if initialization has been done.  This is not an assertion because the sound manager may not be
      // initialized if sound is not enabled for the sim.
      if ( !this.initialized ) {
        console.warn( 'an attempt was made to set the reverb level on an uninitialized sound manager, ignoring' );
        return null;
      }

      assert && assert( newReverbLevel >= 0 && newReverbLevel <= 1, 'reverb value out of range: ' + newReverbLevel );
      const now = phetAudioContext.currentTime;
      this.reverbGainNode.gain.linearRampToValueAtTime( newReverbLevel, now + LINEAR_GAIN_CHANGE_TIME );
      this.dryGainNode.gain.linearRampToValueAtTime( 1 - newReverbLevel, now + LINEAR_GAIN_CHANGE_TIME );
      this._reverbLevel = newReverbLevel;
    }

    set reverbLevel( reverbLevel ) {
      this.setReverbLevel( reverbLevel );
    }

    getReverbLevel() {
      return this._reverbLevel;
    }

    get reverbLevel() {
      return this.getReverbLevel();
    }

    /**
     * ES5 setter for enabled state
     * @param {boolean} enabled
     */
    set enabled( enabled ) {
      this.enabledProperty.value = enabled;
    }

    /**
     * ES5 getter for enabled state
     * @returns {boolean}
     */
    get enabled() {
      return this.enabledProperty.value;
    }

    /**
     * ES5 setter for sonification level
     * @param {string} sonificationLevel
     */
    set sonificationLevel( sonificationLevel ) {
      assert && assert(
        _.includes( _.values( SoundLevelEnum ), sonificationLevel ),
        'invalid sonification level: ' + sonificationLevel
      );
      this.enhancedSoundEnabledProperty.value = sonificationLevel === SoundLevelEnum.ENHANCED;
    }

    /**
     * ES5 getter for sonification level
     * @returns {string}
     */
    get sonificationLevel() {
      return this.enhancedSoundEnabledProperty.value ? SoundLevelEnum.ENHANCED : SoundLevelEnum.BASIC;
    }

    /**
     * Log the value of the gain parameter at every animation frame for the specified duration.  This is useful for
     * debugging, because these parameters change over time when set using methods like "setTargetAtTime", and the
     * details of how they change seems to be different on the different browsers.
     *
     * It may be possible to remove this method someday once the behavior is more consistent across browsers.  See
     * https://github.com/phetsims/resistance-in-a-wire/issues/205 for some history on this.
     *
     * @param {GainNode} gainNode
     * @param {number} duration - duration for logging, in seconds
     */
    logGain( gainNode, duration ) {

      duration = duration || 1;
      const startTime = Date.now();

      // closure that will be invoked multiple times to log the changing values
      function logGain() {
        const now = Date.now();
        const timeInMilliseconds = now - startTime;
        console.log( 'Time (ms): ' + timeInMilliseconds.toFixed( 2 ) + ', Gain Value: ' + gainNode.gain.value );
        if ( now - startTime < ( duration * 1000 ) ) {
          window.requestAnimationFrame( logGain );
        }
      }

      if ( TamboQueryParameters.gainLoggingEnabled ) {

        // kick off the logging
        console.log( '------- start of gain logging -----' );
        logGain();
      }
    }

    /**
     * log the value of the master gain as it changes
     * @param {number} duration - in seconds
     */
    logMasterGain( duration ) {
      this.logGain( this.masterGainNode, duration );
    }

    /**
     * log the value of the reverb gain as it changes
     * @param {number} duration - in seconds
     */
    logReverbGain( duration ) {
      this.logGain( this.reverbGainNode, duration );
    }
  }

  const soundManager = new SoundManager();
  return tambo.register( 'soundManager', soundManager );
} );