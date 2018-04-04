// Copyright 2018, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */
define( function( require ) {
  'use strict';

  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var tambo = require( 'TAMBO/tambo' );

  /**
   * @param {Ball} ball - model of a ball
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BallNode( ball, modelViewTransform ) {

    var self = this;
    Node.call( this );

    // create a circle node to represent the ball
    var radius = modelViewTransform.modelToViewDeltaX( ball.radius );
    this.addChild( new Circle( radius, { fill: ball.color, stroke: 'gray' } ) );

    ball.positionProperty.link( function( position ) {
      self.center = modelViewTransform.modelToViewPosition( position );
    } );
  }

  tambo.register( 'BallNode', BallNode );

  return inherit( Node, BallNode );
} );
