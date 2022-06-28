// Copyright 2018-2022, University of Colorado Boulder

/**
 * BoxOfBalls is a model of a box containing moving balls that bounce off the walls.
 */

import createObservableArray, { ObservableArray } from '../../../../../axon/js/createObservableArray.js';
import dotRandom from '../../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import { Shape } from '../../../../../kite/js/imports.js';
import { Color } from '../../../../../scenery/js/imports.js';
import tambo from '../../../tambo.js';
import Ball from './Ball.js';

// constants
const BALL_RADIUS = 7; // ball radius in cm
const MIN_X_OR_Y_VELOCITY = 30;
const MAX_X_OR_Y_VELOCITY = 60;

// helper function
const createRandomColor = () => {
  const r = Math.floor( dotRandom.nextDouble() * 256 );
  const g = Math.floor( dotRandom.nextDouble() * 256 );
  const b = Math.floor( dotRandom.nextDouble() * 256 );
  return new Color( r, g, b );
};

class BoxOfBalls {

  // an array the contains the balls that are in this box
  public readonly balls: ObservableArray<Ball>;

  // the bounding box
  public readonly box: Shape;

  public constructor( width: number, height: number ) {
    this.box = Shape.rect( 50, 0, width, height );
    this.balls = createObservableArray();
  }

  /**
   * Add a ball with random size, color, position, and velocity.
   */
  public addRandomBall(): void {

    let xVelocity = MIN_X_OR_Y_VELOCITY + dotRandom.nextDouble() * ( MAX_X_OR_Y_VELOCITY - MIN_X_OR_Y_VELOCITY );
    xVelocity = dotRandom.nextBoolean() ? xVelocity : -xVelocity;
    let yVelocity = MIN_X_OR_Y_VELOCITY + dotRandom.nextDouble() * ( MAX_X_OR_Y_VELOCITY - MIN_X_OR_Y_VELOCITY );
    yVelocity = dotRandom.nextBoolean() ? yVelocity : -yVelocity;
    const velocity = new Vector2( xVelocity, yVelocity );
    this.balls.push( new Ball(
      BALL_RADIUS,
      createRandomColor(),
      new Vector2(
        BALL_RADIUS + ( dotRandom.nextDouble() * ( this.box.bounds.width - 2 * BALL_RADIUS ) + this.box.bounds.minX ),
        BALL_RADIUS + ( dotRandom.nextDouble() * ( this.box.bounds.height - 2 * BALL_RADIUS ) + this.box.bounds.minY )
      ),
      velocity
    ) );
  }

  /**
   * Remove a ball.
   */
  public removeABall(): void {
    this.balls.pop();
  }

  /**
   * step function to move and bounce the balls
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    const boxBounds = this.box.bounds;
    this.balls.forEach( ball => {
      const positionBeforeMotion = ball.positionProperty.value;
      const ballVelocity = ball.velocityProperty.value;
      const newPosition = positionBeforeMotion.plus( ballVelocity.timesScalar( dt ) );

      // set new position
      ball.positionProperty.value = newPosition;

      // handle bouncing
      let newBallVelocity = ball.velocityProperty.value.copy();
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
        ball.velocityProperty.value = newBallVelocity;
      }
    } );
  }

  /**
   * restore initial state
   */
  public reset(): void {
    this.balls.reset();
  }
}

tambo.register( 'BoxOfBalls', BoxOfBalls );

export default BoxOfBalls;