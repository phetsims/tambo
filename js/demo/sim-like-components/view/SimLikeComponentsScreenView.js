// Copyright 2018, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ABSwitch = require( 'SUN/ABSwitch' );
  var BallNode = require( 'TAMBO/demo/sim-like-components/view/BallNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var NumberSpinner = require( 'SUN/NumberSpinner' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PitchedPopGenerator = require( 'TAMBO/sound-generators/PitchedPopGenerator' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ResetAllSound = require( 'TAMBO/demo/common/audio/ResetAllSound' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var soundManager = require( 'TAMBO/soundManager' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var tambo = require( 'TAMBO/tambo' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var MAX_BALLS = 8;

  /**
   * @constructor
   */
  function SimLikeComponentsScreenView( model ) {

    var self = this;

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    // set up the model view transform
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( this.layoutBounds.width * 0.275, this.layoutBounds.height * 0.5 ),
      2
    );

    // add the box where the balls bounce around
    var boxNode = new Path( modelViewTransform.modelToViewShape( model.boxOfBalls.box ), {
      fill: 'white',
      stroke: 'black'
    } );
    this.addChild( boxNode );

    // handle balls being added to or removed from the box
    model.boxOfBalls.balls.addItemAddedListener( function( addedBall ) {

      // add a node that represents the ball
      var ballNode = new BallNode( addedBall, modelViewTransform );
      self.addChild( ballNode );

      // set up a listener to remove the nodes when the corresponding ball is removed from the model
      model.boxOfBalls.balls.addItemRemovedListener( function removalListener( removedBall ) {
        if ( removedBall === addedBall ) {
          self.removeChild( ballNode );
          ballNode.dispose();
          model.boxOfBalls.balls.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // generate sound when balls are added or removed
    var pitchedPopGenerator = new PitchedPopGenerator();
    soundManager.addSoundGenerator( pitchedPopGenerator, { disabledDuringReset: true } );
    model.boxOfBalls.balls.lengthProperty.lazyLink( function( numBalls ) {
      pitchedPopGenerator.playPop( numBalls / MAX_BALLS );
    } );

    // add a switch to turn ball motion on and off
    var ballsMovingSwitch = new ABSwitch(
      model.ballsMovingProperty,
      false,
      new Text( 'Paused' ),
      true,
      new Text( 'Running' ),
      { switchSize: new Dimension2( 40, 20 ), centerX: boxNode.centerX, top: boxNode.bottom + 20 }
    );
    this.addChild( ballsMovingSwitch );

    // add a number spinner for adding and removing balls
    var ballCountSpinner = new NumberSpinner(
      model.numberOfBallsProperty,
      new Property( new Range( 0, MAX_BALLS ) ),
      {
        arrowsPosition: 'bothBottom',
        backgroundFill: '#cccccc',
        backgroundStroke: 'green',
        backgroundLineWidth: 3,
        arrowButtonFill: 'lightblue',
        arrowButtonStroke: 'blue',
        arrowButtonLineWidth: 0.2,
        valueAlign: 'center',
        xMargin: 20,
        centerX: ballsMovingSwitch.centerX,
        top: ballsMovingSwitch.bottom + 20
      } );
    this.addChild( ballCountSpinner );

    // add the reset all button
    var resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.maxX - 20,
      bottom: this.layoutBounds.maxY - 20,
      listener: function() {
        model.reset();
      }
    } );
    this.addChild( resetAllButton );
    soundManager.addSoundGenerator( new ResetAllSound( model.resetInProgressProperty ) );

    // add the sound toggle button
    var soundToggleButton = new SoundToggleButton( soundManager.enabledProperty, {
      right: resetAllButton.left - 10,
      centerY: resetAllButton.centerY
    } );
    this.addChild( soundToggleButton );

    // hook up the reset-in-progress property to the sonification manager so sounds can be muted during reset
    soundManager.addResetInProgressProperty( model.resetInProgressProperty );
  }

  tambo.register( 'SimLikeComponentsScreenView', SimLikeComponentsScreenView );

  return inherit( ScreenView, SimLikeComponentsScreenView );
} );