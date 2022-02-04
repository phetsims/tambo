// Copyright 2018-2021, University of Colorado Boulder

/**
 * a Scenery node that represents a ball in the view
 */

import { Circle } from '../../../../../scenery/js/imports.js';
import boundaryReached_mp3 from '../../../../sounds/boundaryReached_mp3.js';
import ceilingFloorContact_mp3 from '../../../../sounds/ceilingFloorContact_mp3.js';
import wallContact_mp3 from '../../../../sounds/wallContact_mp3.js';
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
      new SoundClip( wallContact_mp3, { initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL } ),
      new SoundClip( boundaryReached_mp3, { initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL } ),
      new SoundClip( ceilingFloorContact_mp3, { initialOutputLevel: BALL_BOUNCE_OUTPUT_LEVEL } )
    ];

    // @private - sound for ceiling contact
    this.ceilingFloorContactSoundClip = new SoundClip( ceilingFloorContact_mp3, {
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