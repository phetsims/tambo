// Copyright 2018-2022, University of Colorado Boulder

/**
 * simple model of a ball
 */

import Emitter from '../../../../../axon/js/Emitter.js';
import TEmitter from '../../../../../axon/js/TEmitter.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../../dot/js/Vector2Property.js';
import { Color } from '../../../../../scenery/js/imports.js';
import tambo from '../../../tambo.js';

class Ball {
  public readonly radius: number;
  public readonly color: Color;
  public readonly positionProperty: Vector2Property;
  public readonly velocityProperty: Vector2Property;
  public readonly bounceEmitter: TEmitter<[ string ]>;

  public constructor( radius: number, color: Color, initialPosition: Vector2, initialVelocity: Vector2 ) {

    this.radius = radius;
    this.color = color;
    this.positionProperty = new Vector2Property( initialPosition );
    this.velocityProperty = new Vector2Property( initialVelocity );
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
   */
  public reset(): void {
    this.positionProperty.reset();
    this.velocityProperty.reset();
  }
}

tambo.register( 'Ball', Ball );

export default Ball;