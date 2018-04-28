// Copyright 2018, University of Colorado Boulder

/**
 * simple model of a ball
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var tambo = require( 'TAMBO/tambo' );

  /**
   * @param {number} radius - in centimeters
   * @param {Color} color
   * @param {Vector2} initialPosition
   * @param {Vector2} initialVelocity
   * @constructor
   */
  function Ball( radius, color, initialPosition, initialVelocity ) {

    var self = this;

    // @public read-only {number}
    this.radius = radius;

    // @public read-only {Color}
    this.color = color;

    // @public {Property<Vector2>}
    this.positionProperty = new Property( initialPosition );

    // @public {Property<Vector2>}
    this.velocityProperty = new Property( initialVelocity );

    // @public (read-only) {Emitter} - emitter that fires when the ball bounces, indicates surface on which it bounced
    this.bounceEmitter = new Emitter();

    // monitor the velocity property and fire the emitter when a bounce occurs
    this.velocityProperty.lazyLink( function( newVelocity, oldVelocity ) {

      // check for wall bounce
      if ( oldVelocity.x > 0 && newVelocity.x < 0 ) {
        self.bounceEmitter.emit1( 'right-wall' );
      }
      else if ( oldVelocity.x < 0 && newVelocity.x > 0 ) {
        self.bounceEmitter.emit1( 'left-wall' );
      }

      // check for floor and ceiling bounce
      if ( oldVelocity.y > 0 && newVelocity.y < 0 ) {
        self.bounceEmitter.emit1( 'ceiling' );
      }
      else if ( oldVelocity.y < 0 && newVelocity.y > 0 ) {
        self.bounceEmitter.emit1( 'floor' );
      }
    } );
  }

  tambo.register( 'Ball', Ball );

  return inherit( Object, Ball, {

    reset: function() {
      this.positionProperty.reset();
      this.velocityProperty.reset();
    }
  } );
} );