// Copyright 2018-2020, University of Colorado Boulder

/**
 * a Scenery node that represents a ball in the view
 */

import Circle from '../../../../../scenery/js/nodes/Circle.js';
import ceilingFloorContactSound from '../../../../sounds/ceiling-floor-contact_mp3.js';
import wallContactSound from '../../../../sounds/wall-contact_mp3.js';
import SoundClip from '../../../sound-generators/SoundClip.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';

// sounds

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

    // add sounds

    // @public (read-only) {SoundClip} - make these available so that the output level can be adjusted
    this.wallContactSoundClip = new SoundClip( wallContactSound, { initialOutputLevel: 0.3 } );
    this.ceilingFloorContactSoundClip = new SoundClip( ceilingFloorContactSound, { initialOutputLevel: 0.3 } );

    // add the sound generators
    soundManager.addSoundGenerator( this.wallContactSoundClip );
    soundManager.addSoundGenerator( this.ceilingFloorContactSoundClip );

    // play bounces when the ball bounces
    const bounceListener = bounceSurface => {
      if ( bounceSurface === 'left-wall' || bounceSurface === 'right-wall' ) {
        this.wallContactSoundClip.play();
      }
      else if ( bounceSurface === 'floor' || bounceSurface === 'ceiling' ) {
        this.ceilingFloorContactSoundClip.play();
      }
    };
    ball.bounceEmitter.addListener( bounceListener );

    this.disposeBallNode = () => {
      ball.bounceEmitter.removeListener( bounceListener );
      this.wallContactSoundClip.stop();
      this.ceilingFloorContactSoundClip.stop();
      soundManager.removeSoundGenerator( this.wallContactSoundClip );
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