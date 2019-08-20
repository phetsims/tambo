// Copyright 2018-2019, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const BallNode = require( 'TAMBO/demo/sim-like-components/view/BallNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const NumberSpinner = require( 'SUN/NumberSpinner' );
  const Panel = require( 'SUN/Panel' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PitchedPopGenerator = require( 'TAMBO/sound-generators/PitchedPopGenerator' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ResetAllSoundGenerator = require( 'TAMBO/sound-generators/ResetAllSoundGenerator' );
  const ContinuousPropertySoundGenerator = require( 'TAMBO/sound-generators/ContinuousPropertySoundGenerator' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const soundManager = require( 'TAMBO/soundManager' );
  const tambo = require( 'TAMBO/tambo' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // sounds
  const stringSound1 = require( 'sound!TAMBO/strings-loop-middle-c-oscilloscope.mp3' );
  const windSound1 = require( 'sound!TAMBO/winds-loop-middle-c-oscilloscope.mp3' );
  const windSound2 = require( 'sound!TAMBO/winds-loop-c3-oscilloscope.mp3' );
  const sineSound = require( 'sound!TAMBO/220hz-saturated-sine-loop.mp3' );

  // constants
  const MAX_BALLS = 8;
  const FONT = new PhetFont( 16 );

  class SimLikeComponentsScreenView extends ScreenView {

    /**
     * @constructor
     * @param {SimLikeComponentsModel} model
     */
    constructor( model ) {

      super();

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
        const removalListener = removedBall => {
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

      // Creates a panel that demonstrates a ContinuousPropertySoundGenerator
      const createTester = ( sound, max ) => {
        const numberProperty = new NumberProperty( 5 );
        const range = new Range( 1, 10 );
        const continuousPropertySoundGenerator = new ContinuousPropertySoundGenerator( numberProperty, sound, range, new BooleanProperty( false ), {} );
        soundManager.addSoundGenerator( continuousPropertySoundGenerator );
        const isOscillatingProperty = new BooleanProperty( false );
        let phase = 0;
        model.stepEmitter.addListener( dt => {
          if ( isOscillatingProperty.value ) {
            numberProperty.value = ( max * Math.sin( Date.now() / 1000 - phase ) + 1 ) * ( range.max - range.min ) / 2 + range.min;
          }
          continuousPropertySoundGenerator.step( dt );
        } );
        isOscillatingProperty.link( oscillate => {
          phase = Date.now() / 1000;
        } );

        return new Panel( new VBox( {
          children: [
            new Checkbox( new Text( 'Oscillate' ), isOscillatingProperty ),
            new NumberControl( 'Value', numberProperty, range, {
              delta: 0.1,
              numberDisplayOptions: { decimalPlaces: 1 }
            } )
          ]
        } ) );
      };

      const panel = new VBox( {
        children: [
          createTester( stringSound1, 1 ),
          createTester( windSound1, 0.5 ),
          createTester( windSound2, 0.25 ),
          createTester( sineSound, 1 )
        ]
      } );
      this.addChild( panel );

      // add the reset all button
      const resetAllButton = new ResetAllButton( {
        right: this.layoutBounds.maxX - 25,
        bottom: this.layoutBounds.maxY - 25,
        listener: () => { model.reset(); }
      } );
      this.addChild( resetAllButton );
      soundManager.addSoundGenerator( new ResetAllSoundGenerator( model.resetInProgressProperty ) );
    }
  }

  tambo.register( 'SimLikeComponentsScreenView', SimLikeComponentsScreenView );

  return SimLikeComponentsScreenView;
} );