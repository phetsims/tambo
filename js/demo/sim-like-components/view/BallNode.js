// Copyright 2018-2019, University of Colorado Boulder

/**
 * a Scenery node that represents a ball in the view
 */
define( require => {
  'use strict';

  const Circle = require( 'SCENERY/nodes/Circle' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const ceilingFloorContactSound = require( 'sound!TAMBO/ceiling-floor-contact.mp3' );
  const wallContactSound = require( 'sound!TAMBO/wall-contact.mp3' );

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

  return BallNode;
} );
