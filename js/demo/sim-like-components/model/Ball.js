// Copyright 2018, University of Colorado Boulder

/**
 * simple model of a ball
 */
define( function( require ) {
  'use strict';

  // modules
  const Emitter = require( 'AXON/Emitter' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const tambo = require( 'TAMBO/tambo' );

  /**
   * @param {number} radius - in centimeters
   * @param {Color|string} color
   * @param {Vector2} initialPosition
   * @param {Vector2} initialVelocity
   * @constructor
   */
  function Ball( radius, color, initialPosition, initialVelocity ) {

    // @public read-only {number}
    this.radius = radius;

    // @public read-only {Color}
    this.color = color;

    // @public {Property<Vector2>}
    this.positionProperty = new Property( initialPosition );

    // @public {Property<Vector2>}
    this.velocityProperty = new Property( initialVelocity );

    // @public (read-only) {Emitter} - emitter that fires when the ball bounces, indicates surface on which it bounced
    this.bounceEmitter = new Emitter( { validators: [ { valueType: 'string' } ] } );

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

  tambo.register( 'Ball', Ball );

  return inherit( Object, Ball, {

    /**
     * restore initial state
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.velocityProperty.reset();
    }
  } );
} );