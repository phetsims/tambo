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

    // add a ball to start
    this.addRandomBall();


  }

  tambo.register( 'BoxOfBalls', BoxOfBalls );

  return inherit( Object, BoxOfBalls, {

    /**
     * add a ball with random size, color, position, and velocity
     * @public
     */
    addRandomBall: function() {
      this.balls.push( new Ball(
        5,
        new Color( '#aa0011' ),
        new Vector2( this.box.bounds.width / 2, this.box.bounds.height / 2 ),
        new Vector2( 50, 50 )
      ) );
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
    }

  } );
} );