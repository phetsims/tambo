// Copyright 2018-2020, University of Colorado Boulder

/**
 * simple model of a ball
 */

import Emitter from '../../../../../axon/js/Emitter.js';
import Property from '../../../../../axon/js/Property.js';
import tambo from '../../../tambo.js';

class Ball {

  /**
   * @param {number} radius - in centimeters
   * @param {Color|string} color
   * @param {Vector2} initialPosition
   * @param {Vector2} initialVelocity
   */
  constructor( radius, color, initialPosition, initialVelocity ) {

    // @public read-only {number}
    this.radius = radius;

    // @public read-only {Color}
    this.color = color;

    // @public {Property.<Vector2>}
    this.positionProperty = new Property( initialPosition );

    // @public {Property.<Vector2>}
    this.velocityProperty = new Property( initialVelocity );

    // @public (read-only) {Emitter} - emitter that fires when the ball bounces, indicates surface on which it bounced
    this.bounceEmitter = new Emitter( { parameters: [ { valueType: 'string' } ] } );

    // monitor the velocity Property and fire the emitter when a bounce occurs
    this.velocityProperty.lazyLink( ( newVelocity, oldVelocity ) => {

      // check for wall bounce
      if ( oldVelocity.x > 0 && newVelocity.x < 0 ) {
        this.bounceEmitter.emit( 'right-wall' );
      }
      else if ( oldVelocity.x < 0 && newVelocity.x > 0 ) {
        this.bounceEmitter.emit( 'left-wall' );
      }

      // check for floor and ceiling bounce
      if ( oldVelocity.y > 0 && newVelocity.y < 0 ) {
        this.bounceEmitter.emit( 'ceiling' );
      }
      else if ( oldVelocity.y < 0 && newVelocity.y > 0 ) {
        this.bounceEmitter.emit( 'floor' );
      }
    } );
  }

  /**
   * restore initial state
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.velocityProperty.reset();
  }

}

tambo.register( 'Ball', Ball );

export default Ball;