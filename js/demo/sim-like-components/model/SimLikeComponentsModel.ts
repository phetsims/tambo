// Copyright 2018-2023, University of Colorado Boulder

/**
 * SimLikeComponentsModel is a model that exists only for the purposes of demonstrating sonification, particularly how
 * view and model elements are used together to hook up sonification elements.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import TModel from '../../../../../joist/js/TModel.js';
import tambo from '../../../tambo.js';
import BoxOfBalls from './BoxOfBalls.js';

class SimLikeComponentsModel implements TModel {

  // a box containing bouncing balls
  public readonly boxOfBalls: BoxOfBalls;

  // controls the number of balls in the box
  public readonly numberOfBallsProperty: NumberProperty;

  // controls whether the balls are bouncing around in the box or still
  public readonly ballsMovingProperty: BooleanProperty;

  // tracks whether a reset is happening
  public readonly resetInProgressProperty: BooleanProperty;

  public constructor() {

    this.boxOfBalls = new BoxOfBalls( 135, 80 ); // size empirically determined
    this.numberOfBallsProperty = new NumberProperty( 0 );
    this.ballsMovingProperty = new BooleanProperty( false );
    this.resetInProgressProperty = new BooleanProperty( false );

    // Add or remove balls as the count changes.
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
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {
    if ( this.ballsMovingProperty.value ) {
      this.boxOfBalls.step( dt );
    }
  }

  /**
   */
  public reset(): void {
    this.resetInProgressProperty.value = true;
    this.numberOfBallsProperty.reset();
    this.ballsMovingProperty.reset();
    this.resetInProgressProperty.value = false;
  }
}

tambo.register( 'SimLikeComponentsModel', SimLikeComponentsModel );

export default SimLikeComponentsModel;