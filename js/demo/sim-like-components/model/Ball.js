// Copyright 2018, University of Colorado Boulder

/**
 * simple model of a ball
 */
define( function( require ) {
  'use strict';

  // modules
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

    // @public read-only {number}
    this.radius = radius;

    // @public read-only {Color}
    this.color = color;

    // @public {Property<Vector2>}
    this.positionProperty = new Property( initialPosition );

    // @public {Property<Vector2>}
    this.velocityProperty = new Property( initialVelocity );
  }

  tambo.register( 'Ball', Ball );

  return inherit( Object, Ball );
} );