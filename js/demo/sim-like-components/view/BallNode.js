// Copyright 2018, University of Colorado Boulder

/**
 * a Scenery node that represents a ball in the view
 */
define( function( require ) {
  'use strict';

  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sonificationManager = require( 'TAMBO/sonificationManager' );
  var OneShotSoundClip = require( 'TAMBO/sound-generators/OneShotSoundClip' );
  var tambo = require( 'TAMBO/tambo' );

  // audio
  var wallContactSound = require( 'audio!TAMBO/wall-contact.mp3' );
  var ceilingFloorContactSound = require( 'audio!TAMBO/ceiling-floor-contact.mp3' );

  /**
   * @param {Ball} ball - model of a ball
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BallNode( ball, modelViewTransform ) {

    var self = this;
    Circle.call( this );

    // create a circle node to represent the ball
    var radius = modelViewTransform.modelToViewDeltaX( ball.radius );
    Circle.call( this, radius, { fill: ball.color, stroke: 'gray' } );

    // move this node as the model position changes
    ball.positionProperty.link( function( position ) {
      self.center = modelViewTransform.modelToViewPosition( position );
    } );

    // add sounds

    // @public (read-only) {SoundClip} - make these available so that the output level can be adjusted
    this.wallContactSound = new OneShotSoundClip( wallContactSound );
    this.ceilingFloorContactSound = new OneShotSoundClip( ceilingFloorContactSound );

    // add the sound generators
    sonificationManager.addSoundGenerator( this.wallContactSound );
    sonificationManager.addSoundGenerator( this.ceilingFloorContactSound );

    // play bounces when the ball bounces
    var bounceListener = function( bounceSurface ) {
      if ( bounceSurface === 'left-wall' || bounceSurface === 'right-wall' ) {
        self.wallContactSound.play();
      }
      else if ( bounceSurface === 'floor' || bounceSurface === 'ceiling' ) {
        self.ceilingFloorContactSound.play();
      }
    };
    ball.bounceEmitter.addListener( bounceListener );

    this.disposeBallNode = function() {
      ball.bounceEmitter.removeListener( bounceListener );
    };
  }

  tambo.register( 'BallNode', BallNode );

  return inherit( Circle, BallNode, {

    dispose: function() {
      this.disposeBallNode();
      Circle.prototype.dispose.call( this );
    }
  } );
} );
