// Copyright 2026, University of Colorado Boulder

/**
 * A reusable utility that plays the tambo boundary-reached sound on the rising edge of a position being clamped
 * to the available bounds. Used when dragging objects (skater, control points, tracks) to provide audio feedback
 * when hitting the edge of the available area.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import SoundClip from '../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../tambo/js/soundManager.js';
import boundaryReached_mp3 from '../../tambo/sounds/boundaryReached_mp3.js';

const boundaryReachedSoundClip = new SoundClip( boundaryReached_mp3 );
soundManager.addSoundGenerator( boundaryReachedSoundClip );

export default class BoundaryReachedSoundPlayer {
  private readonly isOnBoundaryProperty: BooleanProperty;

  public constructor() {

    this.isOnBoundaryProperty = new BooleanProperty( false );
    this.isOnBoundaryProperty.lazyLink( isOnBoundary => {
      if ( isOnBoundary ) {
        boundaryReachedSoundClip.play();
      }
    } );
  }

  /**
   * Call from drag handlers. Plays the boundary-reached sound on the rising edge
   * (transition from not-on-boundary to on-boundary).
   */
  public setOnBoundary( onBoundary: boolean ): void {
    this.isOnBoundaryProperty.value = onBoundary;
  }
}
