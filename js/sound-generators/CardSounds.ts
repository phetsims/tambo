// Copyright 2025, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import dotRandom from '../../../dot/js/dotRandom.js';
import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import cardMovement1_mp3 from '../../sounds/cardMovement1_mp3.js';
import cardMovement2_mp3 from '../../sounds/cardMovement2_mp3.js';
import cardMovement3_mp3 from '../../sounds/cardMovement3_mp3.js';
import cardMovement4_mp3 from '../../sounds/cardMovement4_mp3.js';
import cardMovement5_mp3 from '../../sounds/cardMovement5_mp3.js';
import cardMovement6_mp3 from '../../sounds/cardMovement6_mp3.js';
import soundManager from '../soundManager.js';
import tambo from '../tambo.js';
import SoundClip from './SoundClip.js';

const cardMovementSounds = [
  cardMovement1_mp3,
  cardMovement2_mp3,
  cardMovement3_mp3,
  cardMovement4_mp3,
  cardMovement5_mp3,
  cardMovement6_mp3
];

const cardMovementSoundsEnabledProperty = new BooleanProperty( true );

export const cardMovementSoundClips = cardMovementSounds.map( sound => new SoundClip( sound, {
  initialOutputLevel: 0.3,
  additionalAudioNodes: [],
  enabledProperty: cardMovementSoundsEnabledProperty
} ) );
cardMovementSoundClips.forEach( soundClip => soundManager.addSoundGenerator( soundClip ) );

export default class CardSounds {
  public static readonly CARD_MOVEMENT_SOUNDS_ENABLED_PROPERTY = cardMovementSoundsEnabledProperty;
  public static readonly PLAYBACK_RATE = 1.5;

  public static playCardMovementSound( directionToPlay: 'left' | 'right' | 'both' ): void {

    // Help protect JavaScript call sites, which do not have type checking.
    affirm( directionToPlay === 'left' || directionToPlay === 'right' || directionToPlay === 'both', `Invalid directionToPlay: ${directionToPlay}` );

    const availableSoundClips = cardMovementSoundClips.filter( clip => !clip.isPlayingProperty.value );

    // Don't interrupt sounds that are already playing
    if ( ( directionToPlay === 'left' || directionToPlay === 'right' || directionToPlay === 'both' ) && availableSoundClips.length > 0 ) {

      const randomClip = availableSoundClips[ dotRandom.nextInt( availableSoundClips.length ) ];

      // Moving to the right, go up in pitch by 4 semitones
      randomClip.setPlaybackRate( CardSounds.PLAYBACK_RATE *
                                  ( directionToPlay === 'left' ? 1 :
                                    directionToPlay === 'right' ? Math.pow( 2, 4 / 12 ) :
                                    directionToPlay === 'both' ? Math.pow( 2, 2 / 12 ) : 0 ) );
      randomClip.play();
    }
  }
}

tambo.register( 'CardSounds', CardSounds );