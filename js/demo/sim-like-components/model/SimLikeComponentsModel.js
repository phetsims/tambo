// Copyright 2018-2019, University of Colorado Boulder

/**
 * A model that exists only for the purposes of demonstrating sonification, particularly how view and model elements are
 * used together to hook up sonification elements.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const BoxOfBalls = require( 'TAMBO/demo/sim-like-components/model/BoxOfBalls' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const tambo = require( 'TAMBO/tambo' );

  class SimLikeComponentsModel {

    /**
     * @constructor
     */
    constructor() {

      // @public (read-only) {BoxOfBalls) - box containing bouncing balls, size empirically determined
      this.boxOfBalls = new BoxOfBalls( 135, 80 );

      // @public {NumberProperty} - controls the number of balls in the box
      this.numberOfBallsProperty = new NumberProperty( 0 );

      // @public {BooleanProperty} - controls whether the balls are bouncing around in the box or still
      this.ballsMovingProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - tracks whether a reset is happening
      this.resetInProgressProperty = new BooleanProperty( false );

      // add or remove balls as the count changes
      this.numberOfBallsProperty.link( desiredNumberOfBalls => {
        const numberBallsInBox = this.boxOfBalls.balls.lengthProperty.get();
        if ( desiredNumberOfBalls > numberBallsInBox ) {
          _.times( desiredNumberOfBalls - numberBallsInBox, () => {
            this.boxOfBalls.addRandomBall();
          } );
        }
        else if ( desiredNumberOfBalls < numberBallsInBox ) {
          _.times( numberBallsInBox - desiredNumberOfBalls, () => {
            this.boxOfBalls.removeABall();
          } );
        }
      } );
    }

    /**
     * @param {number} dt - delta time, in seconds
     * @public
     */
    step( dt ) {
      if ( this.ballsMovingProperty.value ) {
        this.boxOfBalls.step( dt );
      }
    }

    /**
     * @public
     */
    reset() {
      this.resetInProgressProperty.value = true;
      this.numberOfBallsProperty.reset();
      this.ballsMovingProperty.reset();
      this.resetInProgressProperty.value = false;
    }

  }

  tambo.register( 'SimLikeComponentsModel', SimLikeComponentsModel );

  return SimLikeComponentsModel;
} );