// Copyright 2018-2020, University of Colorado Boulder

/**
 * a Scenery node that represents a ball in the view
 */

import Circle from '../../../../../scenery/js/nodes/Circle.js';
import wallContactSound2 from '../../../../sounds/boundary-reached_mp3.js';
import ceilingFloorContactSound from '../../../../sounds/ceiling-floor-contact_mp3.js';
import wallContactSound3 from '../../../../sounds/ceiling-floor-contact_mp3.js';
import wallContactSound1 from '../../../../sounds/wall-contact_mp3.js';
import SoundClip from '../../../sound-generators/SoundClip.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';

// constants
const BALL_BOUNCE_OUTPUT_LEVEL = 0.3;

class BallNode extends Circle {

  /**
   * @param {Ball} ball - model of a ball
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  constructor( ball, modelViewTransform ) {

    // create a circle node to represent the ball
    const radius = modelViewTransform.modelToViewDeltaX( ball.radius );
    super( radius, { fill: ball.color, stroke: 'gray' } );

    // move this node as the model position changes
    ball.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );

    // @private - sounds for wall contact
    this.wallContactSoundClips = [
      new SoundClip( wallContactSound1, { initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL } ),
      new SoundClip( wallContactSound2, { initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL } ),
      new SoundClip( wallContactSound3, { initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL } )
    ];

    // @private - sound for ceiling contact
    this.ceilingFloorContactSoundClip = new SoundClip( ceilingFloorContactSound, {
      initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL
    } );

    // add the sound generators
    this.wallContactSoundClips.forEach( clip => {
      soundManager.addSoundGenerator( clip );
    } );
    soundManager.addSoundGenerator( this.ceilingFloorContactSoundClip );

    // play bounces when the ball bounces
    const bounceListener = bounceSurface => {
      if ( bounceSurface === 'left-wall' || bounceSurface === 'right-wall' ) {

        // play the sound that was selected via the options dialog
        this.wallContactSoundClips[ phet.tambo.soundIndexForWallBounceProperty.value ].play();
      }
      else if ( bounceSurface === 'floor' || bounceSurface === 'ceiling' ) {
        this.ceilingFloorContactSoundClip.play();
      }
    };
    ball.bounceEmitter.addListener( bounceListener );

    this.disposeBallNode = () => {
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
   * @public
   * @override
   */
  dispose() {
    this.disposeBallNode();
    super.dispose();
  }

}

tambo.register( 'BallNode', BallNode );

export default BallNode;