// Copyright 2018, University of Colorado Boulder

/**
 * a Scenery node that represents a ball in the view
 */
define( function( require ) {
  'use strict';

  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const ceilingFloorContactSound = require( 'sound!TAMBO/ceiling-floor-contact.mp3' );
  const wallContactSound = require( 'sound!TAMBO/wall-contact.mp3' );

  /**
   * @param {Ball} ball - model of a ball
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BallNode( ball, modelViewTransform ) {

    const self = this;
    Circle.call( this );

    // create a circle node to represent the ball
    const radius = modelViewTransform.modelToViewDeltaX( ball.radius );
    Circle.call( this, radius, { fill: ball.color, stroke: 'gray' } );

    // move this node as the model position changes
    ball.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );

    // add sounds

    // @public (read-only) {SoundClip} - make these available so that the output level can be adjusted
    this.wallContactSoundClip = new SoundClip( wallContactSound, {
      initialOutputLevel: 0.3
    } );
    this.ceilingFloorContactSoundClip = new SoundClip( ceilingFloorContactSound, {
      initialOutputLevel: 0.3
    } );

    // add the sound generators
    soundManager.addSoundGenerator( this.wallContactSoundClip );
    soundManager.addSoundGenerator( this.ceilingFloorContactSoundClip );

    // play bounces when the ball bounces
    const bounceListener = function( bounceSurface ) {
      if ( bounceSurface === 'left-wall' || bounceSurface === 'right-wall' ) {
        self.wallContactSoundClip.play();
      }
      else if ( bounceSurface === 'floor' || bounceSurface === 'ceiling' ) {
        self.ceilingFloorContactSoundClip.play();
      }
    };
    ball.bounceEmitter.addListener( bounceListener );

    this.disposeBallNode = function() {
      ball.bounceEmitter.removeListener( bounceListener );
      self.wallContactSoundClip.stop();
      self.ceilingFloorContactSoundClip.stop();
      soundManager.removeSoundGenerator( this.wallContactSoundClip );
      soundManager.removeSoundGenerator( this.ceilingFloorContactSoundClip );
    };
  }

  tambo.register( 'BallNode', BallNode );

  return inherit( Circle, BallNode, {

    dispose: function() {
      this.disposeBallNode();
      Circle.prototype.dispose.call( this );
    }
  } );
} );
