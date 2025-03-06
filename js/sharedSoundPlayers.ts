// Copyright 2024-2025, University of Colorado Boulder

/**
 * This singleton is used to get instances of shared sound players.  The most common use case for shared sound players
 * is in common UI components that may have multiple instances within a sim, such as checkboxes and buttons. Sharing the
 * sound players between these instances reduces memory consumption and load time versus creating separate instances.
 * It also keeps the sound experience consistent.
 *
 * These shared sound players are automatically added to the soundManager so there is no need for clients to do so.
 *
 * Because these shared sound players are created on the first `get` for a particular one, instances should be gotten
 * well before they need to be played, generally during construction of the view or model element that will need it.
 * Waiting to get an instance until it needs to be played could result in a delayed or muffled first sound being
 * produced.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { combineOptions } from '../../phet-core/js/optionize.js';
import accordionBoxClose_mp3 from '../sounds/accordionBoxClose_mp3.js';
import accordionBoxOpen_mp3 from '../sounds/accordionBoxOpen_mp3.js';
import boundaryReached_mp3 from '../sounds/boundaryReached_mp3.js';
import checkboxChecked_mp3 from '../sounds/checkboxChecked_mp3.js';
import checkboxUnchecked_mp3 from '../sounds/checkboxUnchecked_mp3.js';
import click_mp3 from '../sounds/click_mp3.js';
import erase_mp3 from '../sounds/erase_mp3.js';
import generalBoundaryBoop_mp3 from '../sounds/generalBoundaryBoop_mp3.js';
import generalButton_mp3 from '../sounds/generalButton_mp3.js';
import generalClose_mp3 from '../sounds/generalClose_mp3.js';
import generalOpen_mp3 from '../sounds/generalOpen_mp3.js';
import generalSoftClick_mp3 from '../sounds/generalSoftClick_mp3.js';
import grab_mp3 from '../sounds/grab_mp3.js';
import pause_mp3 from '../sounds/pause_mp3.js';
import playPause_mp3 from '../sounds/playPause_mp3.js';
import release_mp3 from '../sounds/release_mp3.js';
import resetAll_mp3 from '../sounds/resetAll_mp3.js';
import stepBack_mp3 from '../sounds/stepBack_mp3.js';
import stepForward_mp3 from '../sounds/stepForward_mp3.js';
import switchToLeft_mp3 from '../sounds/switchToLeft_mp3.js';
import switchToRight_mp3 from '../sounds/switchToRight_mp3.js';
import SoundClipPlayer, { SoundClipPlayerOptions } from './sound-generators/SoundClipPlayer.js';
import tambo from './tambo.js';
import TSoundPlayer from './TSoundPlayer.js';
import WrappedAudioBuffer from './WrappedAudioBuffer.js';

// A list of all the available shared sound players as a string union type.  Use these values to get a shared player.
export type SharedSoundPlayerName =
  'accordionBoxClosed' |
  'accordionBoxOpened' |
  'boundaryReached' |
  'checkboxChecked' |
  'checkboxUnchecked' |
  'erase' |
  'generalBoundaryBoop' |
  'generalClose' |
  'generalOpen' |
  'generalSoftClick' |
  'grab' |
  'pause' |
  'play' |
  'pushButton' |
  'release' |
  'resetAll' |
  'softClick' |
  'stepBackward' |
  'stepForward' |
  'switchToLeft' |
  'switchToRight' |
  'toggleOff' |
  'toggleOn';

type SoundClipPlayerInfo = {
  wrappedAudioBuffer: WrappedAudioBuffer;
  soundClipPlayerOptions: SoundClipPlayerOptions;
};

// constants
const DEFAULT_SOUND_CLIP_PLAYER_OPTIONS: SoundClipPlayerOptions = {
  soundClipOptions: {
    initialOutputLevel: 0.7
  },
  soundManagerOptions: { categoryName: 'user-interface' }
};
const DEFAULT_SOUND_CLIP_PLAYER_INFO: SoundClipPlayerInfo = {
  wrappedAudioBuffer: resetAll_mp3, // default for undefined sounds, since it will stand out as being wrong
  soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
};
const DEFAULTS_WITH_OUTPUT_LEVEL = ( outputLevel: number ): SoundClipPlayerOptions => {
  return combineOptions<SoundClipPlayerOptions>( {}, DEFAULT_SOUND_CLIP_PLAYER_OPTIONS, {
    soundClipOptions: {
      initialOutputLevel: outputLevel
    }
  } );
};

// Map of shared sound player names to SoundClipPlayer instances.  This is initially unpopulated, and the instances are
// created the first time they are requested, which is generally during sim construction time.
const sharedSoundPlayerInstanceMap: Map<SharedSoundPlayerName, SoundClipPlayer> =
  new Map<SharedSoundPlayerName, SoundClipPlayer>();

/**
 * The sharedSoundPlayers object, which implements a `get` method for obtaining shared sound players based on their
 * names.
 */
const sharedSoundPlayers = {

  /**
   * Get the shared sound player for the specified name.  If this shared sound player has not yet been requested, create
   * it, otherwise return the previously created instance.
   */
  get( sharedSoundPlayerName: SharedSoundPlayerName ): TSoundPlayer {

    // If it doesn't exist, create it and add it to the set of instances.
    if ( !sharedSoundPlayerInstanceMap.has( sharedSoundPlayerName ) ) {

      // Make sure the definitional information for this sound exists.
      assert && assert( sharedSoundPlayerInfoMap.has( sharedSoundPlayerName ), 'no info for this shared sound player' );
      const sharedSoundPlayerInfo = sharedSoundPlayerInfoMap.get( sharedSoundPlayerName ) ||
                                    DEFAULT_SOUND_CLIP_PLAYER_INFO;

      // Create the instance and add it to our map.
      sharedSoundPlayerInstanceMap.set( sharedSoundPlayerName, new SoundClipPlayer(
        sharedSoundPlayerInfo.wrappedAudioBuffer,
        sharedSoundPlayerInfo.soundClipPlayerOptions
      ) );
    }

    return sharedSoundPlayerInstanceMap.get( sharedSoundPlayerName )!;
  }
};

// Map of shared sound player names to the parameters needed to create them.
const sharedSoundPlayerInfoMap: Map<SharedSoundPlayerName, SoundClipPlayerInfo> =
  new Map<SharedSoundPlayerName, SoundClipPlayerInfo>( [
    [
      'accordionBoxClosed',
      {
        wrappedAudioBuffer: accordionBoxClose_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.5 )
      }
    ],
    [
      'accordionBoxOpened',
      {
        wrappedAudioBuffer: accordionBoxOpen_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.5 )
      }
    ],
    [
      'boundaryReached',
      {
        wrappedAudioBuffer: boundaryReached_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.8 )
      }
    ],
    [
      'checkboxChecked',
      {
        wrappedAudioBuffer: checkboxChecked_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ],
    [
      'checkboxUnchecked',
      {
        wrappedAudioBuffer: checkboxUnchecked_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ],
    [
      'erase',
      {
        wrappedAudioBuffer: erase_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.22 )
      }
    ],
    [
      'generalBoundaryBoop',
      {
        wrappedAudioBuffer: generalBoundaryBoop_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.2 )
      }
    ],
    [
      'generalClose',
      {
        wrappedAudioBuffer: generalClose_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.4 )
      }
    ],
    [
      'generalOpen',
      {
        wrappedAudioBuffer: generalOpen_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.4 )
      }
    ],
    [
      'generalSoftClick',
      {
        wrappedAudioBuffer: generalSoftClick_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.2 )
      }
    ],
    [
      'grab',
      {
        wrappedAudioBuffer: grab_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ],
    [
      'pause',
      {
        wrappedAudioBuffer: pause_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ],
    [
      'play',
      {
        wrappedAudioBuffer: playPause_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ],
    [
      'pushButton',
      {
        wrappedAudioBuffer: generalButton_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.5 )
      }
    ],
    [
      'release',
      {
        wrappedAudioBuffer: release_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ],
    [
      'resetAll',
      {
        wrappedAudioBuffer: resetAll_mp3,
        soundClipPlayerOptions: {
          soundClipOptions: {
            initialOutputLevel: 0.39,
            enabledDuringReset: true,
            enabledDuringPhetioStateSetting: true
          },
          soundManagerOptions: { categoryName: 'user-interface' }
        }
      }
    ],
    [
      'softClick',
      {
        wrappedAudioBuffer: click_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ],
    [
      'stepBackward',
      {
        wrappedAudioBuffer: stepBack_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ],
    [
      'stepForward',
      {
        wrappedAudioBuffer: stepForward_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ],
    [
      'switchToLeft',
      {
        wrappedAudioBuffer: switchToLeft_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.2 )
      }
    ],
    [
      'switchToRight',
      {
        wrappedAudioBuffer: switchToRight_mp3,
        soundClipPlayerOptions: DEFAULTS_WITH_OUTPUT_LEVEL( 0.2 )
      }
    ],
    [
      'toggleOff',
      {
        wrappedAudioBuffer: stepBack_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ],
    [
      'toggleOn',
      {
        wrappedAudioBuffer: stepForward_mp3,
        soundClipPlayerOptions: DEFAULT_SOUND_CLIP_PLAYER_OPTIONS
      }
    ]
  ] );

tambo.register( 'sharedSoundPlayers', sharedSoundPlayers );
export default sharedSoundPlayers;