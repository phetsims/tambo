// Copyright 2022, University of Colorado Boulder

/**
 * SliderSoundTestNode is a Scenery Node that contains a number of sliders with different configurations that are meant
 * to test and demonstrate several variations of sound generation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import ValueChangeSoundPlayer from '../../../sound-generators/ValueChangeSoundPlayer.js';
import tambo from '../../../tambo.js';
import brightMarimbaShort_mp3 from '../../../../sounds/brightMarimbaShort_mp3.js';
import Range from '../../../../../dot/js/Range.js';
import SoundClipPlayer from '../../../sound-generators/SoundClipPlayer.js';
import birdCall_mp3 from '../../../../sounds/demo-and-test/birdCall_mp3.js';
import loonCall_mp3 from '../../../../sounds/demo-and-test/loonCall_mp3.js';
import HSlider from '../../../../../sun/js/HSlider.js';
import VSlider from '../../../../../sun/js/VSlider.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Utils from '../../../../../dot/js/Utils.js';
import { Font, HBox, Text, VBox } from '../../../../../scenery/js/imports.js';
import SliderPitchChangeSoundGenerator from './SliderPitchChangeSoundGenerator.js';

const PITCH_CHANGE_SLIDER_VALUE_RANGE = new Range( 1, 10 );

class SliderSoundTestNode extends HBox {

  public constructor( labelFont: Font, center: Vector2 ) {

    const horizontalSliderSet = new VBox( {
      children: [

        // very basic continuous slider with default sound
        new Text( 'Continuous with Defaults', { font: labelFont } ),
        new HSlider( new NumberProperty( 0 ), new Range( 0, 100 ) ),

        // discrete slider
        new Text( 'Discrete', { font: labelFont } ),
        new HSlider( new NumberProperty( 0 ), new Range( 0, 5 ), {
          constrainValue: value => Utils.roundSymmetric( value ),
          keyboardStep: 1,
          thumbFill: 'green',
          thumbFillHighlighted: '#80ff80'
        } ),

        // a discrete slider where the values lead to some floating point inaccuracies
        new Text( 'Discrete with Tricky Values', { font: labelFont } ),
        new HSlider( new NumberProperty( 0 ), new Range( 0, 0.7 ), {
          constrainValue: value => Utils.roundToInterval( value, 0.05 ),
          keyboardStep: 1,
          thumbFill: '#6600cc',
          thumbFillHighlighted: '#b366ff',
          valueChangeSoundGeneratorOptions: { numberOfMiddleThresholds: Utils.roundSymmetric( 0.7 / 0.05 ) - 1 }
        } ),

        // slider with custom sound generation, intended to be a little "out there"
        new Text( 'Crazy Custom Sounds', { font: labelFont } ),
        new HSlider( new NumberProperty( 0 ), new Range( 0, 100 ), {
          soundGenerator: new ValueChangeSoundPlayer( new Range( 0, 100 ), {
            middleMovingUpSoundPlayer: new SoundClipPlayer( brightMarimbaShort_mp3, {
              soundClipOptions: { initialOutputLevel: 0.2 },
              soundManagerOptions: { categoryName: 'user-interface' }
            } ),
            middleMovingDownSoundPlayer: new SoundClipPlayer( brightMarimbaShort_mp3, {
              soundClipOptions: { initialOutputLevel: 0.2, initialPlaybackRate: 0.5 },
              soundManagerOptions: { categoryName: 'user-interface' }
            } ),
            numberOfMiddleThresholds: 5,
            minSoundPlayer: new SoundClipPlayer( birdCall_mp3, {
              soundClipOptions: { initialOutputLevel: 0.2 },
              soundManagerOptions: { categoryName: 'user-interface' }
            } ),
            maxSoundPlayer: new SoundClipPlayer( loonCall_mp3, {
              soundClipOptions: { initialOutputLevel: 0.2 },
              soundManagerOptions: { categoryName: 'user-interface' }
            } )
          } ),
          thumbFill: '#ff6666',
          thumbFillHighlighted: '#ffb3b3'
        } ),

        // slider with a sound generator that changes the middle pitches
        new Text( 'Custom Sounds - Pitch Changes', { font: labelFont } ),
        new HSlider( new NumberProperty( 0 ), PITCH_CHANGE_SLIDER_VALUE_RANGE, {
          thumbFill: '#993366',
          thumbFillHighlighted: '#CC6699',
          soundGenerator: new SliderPitchChangeSoundGenerator( PITCH_CHANGE_SLIDER_VALUE_RANGE )
        } )
      ],
      spacing: 20
    } );

    const verticalSliderSet = new VBox( {
      children: [

        // very basic continuous slider with default sound
        new Text( 'Continuous Vertical', { font: labelFont } ),
        new VSlider( new NumberProperty( 0 ), new Range( 0, 100 ), {
          thumbFill: '#AB4E52',
          thumbFillHighlighted: '#CD9397'
        } ),

        // discrete slider
        new Text( 'Discrete Vertical', { font: labelFont } ),
        new VSlider( new NumberProperty( 0 ), new Range( 0, 5 ), {
          constrainValue: value => Utils.roundSymmetric( value ),
          keyboardStep: 1,
          thumbFill: '#9999FF',
          thumbFillHighlighted: '#CCCCFF'
        } )
      ]
    } );

    super( {
      children: [ horizontalSliderSet, verticalSliderSet ],
      center: center
    } );
  }
}

tambo.register( 'SliderSoundTestNode', SliderSoundTestNode );

export default SliderSoundTestNode;