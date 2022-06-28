// Copyright 2018-2022, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Property from '../../../../../axon/js/Property.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ScreenView from '../../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Path, Text } from '../../../../../scenery/js/imports.js';
import ABSwitch from '../../../../../sun/js/ABSwitch.js';
import NumberSpinner from '../../../../../sun/js/NumberSpinner.js';
import PitchedPopGenerator from '../../../sound-generators/PitchedPopGenerator.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';
import BallNode from './BallNode.js';
import SimLikeComponentsModel from '../model/SimLikeComponentsModel.js';
import Ball from '../model/Ball.js';
import Tandem from '../../../../../tandem/js/Tandem.js';

// constants
const MAX_BALLS = 8;
const FONT = new PhetFont( 16 );

class SimLikeComponentsScreenView extends ScreenView {

  public constructor( model: SimLikeComponentsModel ) {

    super( {
      tandem: Tandem.OPT_OUT
    } );

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
      const removalListener = ( removedBall: Ball ) => {
        if ( removedBall === addedBall ) {
          this.removeChild( ballNode );
          ballNode.dispose();
          model.boxOfBalls.balls.removeItemRemovedListener( removalListener );
        }
      };
      model.boxOfBalls.balls.addItemRemovedListener( removalListener );
    } );

    // create an inverted version of the reset-in-progress Property, used to mute sounds during reset
    const resetNotInProgressProperty = new DerivedProperty(
      [ model.resetInProgressProperty ],
      resetInProgress => !resetInProgress
    );

    // generate sound when balls are added or removed
    const pitchedPopGenerator = new PitchedPopGenerator( { enableControlProperties: [ resetNotInProgressProperty ] } );
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
      {
        toggleSwitchOptions: { size: new Dimension2( 60, 30 ) },
        centerX: boxNode.centerX,
        top: boxNode.bottom + 25
      } );
    this.addChild( ballsMovingSwitch );

    // add a number spinner for adding and removing balls
    const ballCountSpinner = new NumberSpinner(
      model.numberOfBallsProperty,
      new Property( new Range( 0, MAX_BALLS ) ),
      {
        numberDisplayOptions: {
          backgroundFill: '#cccccc',
          backgroundStroke: 'green',
          backgroundLineWidth: 3,
          align: 'center',
          xMargin: 20,
          yMargin: 3,
          textOptions: {
            font: new PhetFont( 35 )
          }
        },
        arrowsPosition: 'bothBottom',
        arrowButtonFill: 'lightblue',
        arrowButtonStroke: 'blue',
        arrowButtonLineWidth: 0.2,
        centerX: ballsMovingSwitch.centerX,
        top: ballsMovingSwitch.bottom + 25
      } );
    this.addChild( ballCountSpinner );

    // add the reset all button
    const resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.maxX - 25,
      bottom: this.layoutBounds.maxY - 25,
      listener: () => { model.reset(); }
    } );
    this.addChild( resetAllButton );
  }
}

tambo.register( 'SimLikeComponentsScreenView', SimLikeComponentsScreenView );

export default SimLikeComponentsScreenView;