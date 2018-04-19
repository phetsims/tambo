// Copyright 2018, University of Colorado Boulder

/**
 * model of a box containing moving balls that bounce off the walls
 */
define( function( require ) {
  'use strict';

  // modules
  var Ball = require( 'TAMBO/demo/sim-like-components/model/Ball' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var tambo = require( 'TAMBO/tambo' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BALL_RADIUS = 5;
  var MIN_X_OR_Y_VELOCITY = 30;
  var MAX_X_OR_Y_VELOCITY = 60;

  // helper function
  function createRandomColor() {
    var r = Math.floor( phet.joist.random.nextDouble() * 256 );
    var g = Math.floor( phet.joist.random.nextDouble() * 256 );
    var b = Math.floor( phet.joist.random.nextDouble() * 256 );
    return new Color( r, g, b );
  }

  /**
   * @param {number} width - in centimeters
   * @param {number} height - in centimeters
   * @param {number} ballRadius - in centimeters
   * @constructor
   */
  function BoxOfBalls( width, height, ballRadius ) {

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

      var xVelocity = MIN_X_OR_Y_VELOCITY + phet.joist.random.nextDouble() * (MAX_X_OR_Y_VELOCITY - MIN_X_OR_Y_VELOCITY);
      xVelocity = phet.joist.random.nextBoolean() ? xVelocity : -xVelocity;
      var yVelocity = MIN_X_OR_Y_VELOCITY + phet.joist.random.nextDouble() * (MAX_X_OR_Y_VELOCITY - MIN_X_OR_Y_VELOCITY);
      yVelocity = phet.joist.random.nextBoolean() ? yVelocity : -yVelocity;
      var velocity = new Vector2( xVelocity, yVelocity );
      this.balls.push( new Ball(
        BALL_RADIUS,
        createRandomColor(),
        new Vector2(
          BALL_RADIUS + (phet.joist.random.nextDouble() * (this.box.bounds.width - 2 * BALL_RADIUS)),
          BALL_RADIUS + (phet.joist.random.nextDouble() * (this.box.bounds.height - 2 * BALL_RADIUS))
        ),
        velocity
      ) );
    },

    removeABall: function() {
      this.balls.pop();
    },

    /**
     * step function to move and bounce the balls
     */
    step: function( dt ) {
      var boxBounds = this.box.bounds;
      this.balls.forEach( function( ball ) {
        var positionBeforeMotion = ball.positionProperty.get();
        var ballVelocity = ball.velocityProperty.get();
        var newPosition = positionBeforeMotion.plus( ballVelocity.timesScalar( dt ) );

        // set new position
        ball.positionProperty.set( newPosition );

        // handle bouncing
        var newBallVelocity = ball.velocityProperty.get().copy();
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

    reset: function() {
      this.balls.reset();
    }

  } );
} );