// Copyright 2018, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BallNode = require( 'TAMBO/demo/sim-like-components/view/BallNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ResetAllSound = require( 'TAMBO/demo/common/audio/ResetAllSound' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SonificationManager = require( 'TAMBO/SonificationManager' );
  // var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var tambo = require( 'TAMBO/tambo' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function SimLikeComponentsScreenView( model ) {

    var self = this;

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    var sonificationManager = SonificationManager.getInstance();

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( this.layoutBounds.width * 0.275, this.layoutBounds.height * 0.5 ),
      2
    );

    var boxNode = new Path( modelViewTransform.modelToViewShape( model.boxOfBalls.box ), {
      fill: 'white',
      stroke: 'black'
    } );
    this.addChild( boxNode );

    // TODO: handle balls coming and going
    model.boxOfBalls.balls.forEach( function( ball ) {
      self.addChild( new BallNode( ball, modelViewTransform ) );
    } );

    // add the reset all button
    var resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.maxX - 20,
      bottom: this.layoutBounds.maxY - 20,
      listener: function() {
        model.reset();
      }
    } );
    this.addChild( resetAllButton );
    sonificationManager.addSoundGenerator( new ResetAllSound( model.resetInProgressProperty ) );

  }

  tambo.register( 'SimLikeComponentsScreenView', SimLikeComponentsScreenView );

  return inherit( ScreenView, SimLikeComponentsScreenView );
} );