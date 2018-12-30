// Copyright 2018, University of Colorado Boulder

/**
 * model of a box containing moving balls that bounce off the walls
 */
define( function( require ) {
  'use strict';

  // modules
  const Ball = require( 'TAMBO/demo/sim-like-components/model/Ball' );
  const Color = require( 'SCENERY/util/Color' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const Shape = require( 'KITE/Shape' );
  const tambo = require( 'TAMBO/tambo' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const BALL_RADIUS = 7; // ball radius in cm
  const MIN_X_OR_Y_VELOCITY = 30;
  const MAX_X_OR_Y_VELOCITY = 60;

  // helper function
  function createRandomColor() {
    const r = Math.floor( phet.joist.random.nextDouble() * 256 );
    const g = Math.floor( phet.joist.random.nextDouble() * 256 );
    const b = Math.floor( phet.joist.random.nextDouble() * 256 );
    return new Color( r, g, b );
  }

  /**
   * @param {number} width - in centimeters
   * @param {number} height - in centimeters
   * @constructor
   */
  function BoxOfBalls( width, height ) {

    // @public (read-only) {Shape.rect} - the bounding box
    this.box = Shape.rect( 0, 0, width, height );

    // @public (read-only) {ObservableArray}
    this.balls = new ObservableArray();
  }

  tambo.register( 'BoxOfBalls', BoxOfBalls );

  return inherit( Object, BoxOfBalls, {

    /**
     * add a ball with random size, color, position, and velocity
     * @public
     */
    addRandomBall: function() {

      let xVelocity = MIN_X_OR_Y_VELOCITY + phet.joist.random.nextDouble() * ( MAX_X_OR_Y_VELOCITY - MIN_X_OR_Y_VELOCITY );
      xVelocity = phet.joist.random.nextBoolean() ? xVelocity : -xVelocity;
      let yVelocity = MIN_X_OR_Y_VELOCITY + phet.joist.random.nextDouble() * ( MAX_X_OR_Y_VELOCITY - MIN_X_OR_Y_VELOCITY );
      yVelocity = phet.joist.random.nextBoolean() ? yVelocity : -yVelocity;
      const velocity = new Vector2( xVelocity, yVelocity );
      this.balls.push( new Ball(
        BALL_RADIUS,
        createRandomColor(),
        new Vector2(
          BALL_RADIUS + ( phet.joist.random.nextDouble() * ( this.box.bounds.width - 2 * BALL_RADIUS ) ),
          BALL_RADIUS + ( phet.joist.random.nextDouble() * ( this.box.bounds.height - 2 * BALL_RADIUS ) )
        ),
        velocity
      ) );
    },

    /**
     * remove a ball
     * @public
     */
    removeABall: function() {
      this.balls.pop();
    },

    /**
     * step function to move and bounce the balls
     * @param {number} dt - time step, in seconds
     * @public
     */
    step: function( dt ) {
      const boxBounds = this.box.bounds;
      this.balls.forEach( ball => {
        const positionBeforeMotion = ball.positionProperty.get();
        const ballVelocity = ball.velocityProperty.get();
        const newPosition = positionBeforeMotion.plus( ballVelocity.timesScalar( dt ) );

        // set new position
        ball.positionProperty.set( newPosition );

        // handle bouncing
        let newBallVelocity = ball.velocityProperty.get().copy();
        if ( ballVelocity.x > 0 && newPosition.x + ball.radius > boxBounds.maxX ) {
          newBallVelocity = new Vector2( -ballVelocity.x, ballVelocity.y );
        }
        else if ( ballVelocity.x < 0 && newPosition.x - ball.radius < boxBounds.minX ) {
          newBallVelocity = new Vector2( -ballVelocity.x, ballVelocity.y );
        }
        if ( ballVelocity.y > 0 && newPosition.y + ball.radius > boxBounds.maxY ) {
          newBallVelocity = new Vector2( ballVelocity.x, -ballVelocity.y );
        }
        else if ( ballVelocity.y < 0 && newPosition.y - ball.radius < boxBounds.minY ) {
          newBallVelocity = new Vector2( ballVelocity.x, -ballVelocity.y );
        }

        // update the velocity if it has changed
        if ( !ballVelocity.equals( newBallVelocity ) ) {
          ball.velocityProperty.set( newBallVelocity );
        }
      } );
    },

    /**
     * restore initial state
     * @public
     */
    reset: function() {
      this.balls.reset();
    }

  } );
} );