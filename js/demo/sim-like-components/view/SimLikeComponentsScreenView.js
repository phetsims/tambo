// Copyright 2018, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const BallNode = require( 'TAMBO/demo/sim-like-components/view/BallNode' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberSpinner = require( 'SUN/NumberSpinner' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PitchedPopGenerator = require( 'TAMBO/sound-generators/PitchedPopGenerator' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ResetAllSoundGenerator = require( 'TAMBO/sound-generators/ResetAllSoundGenerator' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const soundManager = require( 'TAMBO/soundManager' );
  const tambo = require( 'TAMBO/tambo' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const MAX_BALLS = 8;
  const FONT = new PhetFont( 16 );

  /**
   * @constructor
   * @param {SimLikeComponentsModel} model
   */
  function SimLikeComponentsScreenView( model ) {

    const self = this;

    ScreenView.call( this );

    // set up the model view transform
    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( this.layoutBounds.width * 0.275, this.layoutBounds.height * 0.5 ),
      2
    );

    // add the box where the balls bounce around
    const boxNode = new Path( modelViewTransform.modelToViewShape( model.boxOfBalls.box ), {
      fill: 'white',
      stroke: 'black'
    } );
    this.addChild( boxNode );

    // handle balls being added to or removed from the box
    model.boxOfBalls.balls.addItemAddedListener( addedBall => {

      // add a node that represents the ball
      const ballNode = new BallNode( addedBall, modelViewTransform );
      this.addChild( ballNode );

      // set up a listener to remove the nodes when the corresponding ball is removed from the model
      model.boxOfBalls.balls.addItemRemovedListener( function removalListener( removedBall ) {
        if ( removedBall === addedBall ) {
          self.removeChild( ballNode );
          ballNode.dispose();
          model.boxOfBalls.balls.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // create an inverted version of the reset-in-progress Property, used to mute sounds during reset
    const resetNotInProgressProperty = new DerivedProperty(
      [ model.resetInProgressProperty ],
      function( resetInProgress ) {
        return !resetInProgress;
      }
    );

    // generate sound when balls are added or removed
    const pitchedPopGenerator = new PitchedPopGenerator( {
      enableControlProperties: [ resetNotInProgressProperty ]
    } );
    soundManager.addSoundGenerator( pitchedPopGenerator );
    model.boxOfBalls.balls.lengthProperty.lazyLink( numBalls => {
      pitchedPopGenerator.playPop( numBalls / MAX_BALLS );
    } );

    // add a switch to turn ball motion on and off
    const ballsMovingSwitch = new ABSwitch(
      model.ballsMovingProperty,
      false,
      new Text( 'Paused', { font: FONT } ),
      true,
      new Text( 'Running', { font: FONT } ),
      { switchSize: new Dimension2( 60, 30 ), centerX: boxNode.centerX, top: boxNode.bottom + 25 }
    );
    this.addChild( ballsMovingSwitch );

    // add a number spinner for adding and removing balls
    const ballCountSpinner = new NumberSpinner(
      model.numberOfBallsProperty,
      new Property( new Range( 0, MAX_BALLS ) ),
      {
        font: new PhetFont( 35 ),
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
        top: ballsMovingSwitch.bottom + 25
      } );
    this.addChild( ballCountSpinner );

    // add the reset all button
    const resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.maxX - 25,
      bottom: this.layoutBounds.maxY - 25,
      listener: function() {
        model.reset();
      }
    } );
    this.addChild( resetAllButton );
    soundManager.addSoundGenerator( new ResetAllSoundGenerator( model.resetInProgressProperty ) );
  }

  tambo.register( 'SimLikeComponentsScreenView', SimLikeComponentsScreenView );

  return inherit( ScreenView, SimLikeComponentsScreenView );
} );