// Copyright 2018-2022, University of Colorado Boulder

/**
 * a Scenery node that represents a ball in the view
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle } from '../../../../../scenery/js/imports.js';
import boundaryReached_mp3 from '../../../../sounds/boundaryReached_mp3.js';
import ceilingFloorContact_mp3 from '../../../../sounds/ceilingFloorContact_mp3.js';
import wallContact_mp3 from '../../../../sounds/wallContact_mp3.js';
import SoundClip from '../../../sound-generators/SoundClip.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';
import Ball from '../model/Ball.js';

// constants
const BALL_BOUNCE_OUTPUT_LEVEL = 0.3;

class BallNode extends Circle {

  // sounds for wall contact
  private readonly wallContactSoundClips: SoundClip[];

  // sound for ceiling contact
  private readonly ceilingFloorContactSoundClip: SoundClip;

  // dispose
  private readonly disposeBallNode: () => void;

  public constructor( ball: Ball, modelViewTransform: ModelViewTransform2 ) {

    // Create a circle node to represent the ball.
    const radius = modelViewTransform.modelToViewDeltaX( ball.radius );
    super( radius, { fill: ball.color, stroke: 'gray' } );

    // Move this node as the model position changes.
    const updatePosition = ( position: Vector2 ) => {
      this.center = modelViewTransform.modelToViewPosition( position );
    };
    ball.positionProperty.link( updatePosition );

    // Create the sound clips used when the balls hit the ceiling or the wall.
    this.wallContactSoundClips = [
      new SoundClip( wallContact_mp3, { initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL } ),
      new SoundClip( boundaryReached_mp3, { initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL } ),
      new SoundClip( ceilingFloorContact_mp3, { initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL } )
    ];
    this.ceilingFloorContactSoundClip = new SoundClip( ceilingFloorContact_mp3, {
      initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL
    } );

    // Add the sound generators.
    this.wallContactSoundClips.forEach( clip => {
      soundManager.addSoundGenerator( clip );
    } );
    soundManager.addSoundGenerator( this.ceilingFloorContactSoundClip );

    // Play bounce sounds when the ball bounces on the wall or ceiling.
    const bounceListener = ( bounceSurface: string ) => {
      if ( bounceSurface === 'left-wall' || bounceSurface === 'right-wall' ) {

        // play the sound that was selected via the preferences control
        this.wallContactSoundClips[ phet.tambo.soundIndexForWallBounceProperty.value ].play();
      }
      else if ( bounceSurface === 'floor' || bounceSurface === 'ceiling' ) {
        this.ceilingFloorContactSoundClip.play();
      }
    };
    ball.bounceEmitter.addListener( bounceListener );

    this.disposeBallNode = () => {
      ball.positionProperty.unlink( updatePosition );
      ball.bounceEmitter.removeListener( bounceListener );
      this.wallContactSoundClips.forEach( clip => {
        clip.stop();
        soundManager.removeSoundGenerator( clip );
      } );
      this.ceilingFloorContactSoundClip.stop();
      soundManager.removeSoundGenerator( this.ceilingFloorContactSoundClip );
    };
  }

  /**
   * Clean up memory references to avoid leaks.
   */
  public override dispose(): void {
    this.disposeBallNode();
    super.dispose();
  }
}

tambo.register( 'BallNode', BallNode );

export default BallNode;