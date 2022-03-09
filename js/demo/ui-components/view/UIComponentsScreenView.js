// Copyright 2018-2022, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import Utils from '../../../../../dot/js/Utils.js';
import ResetAllButton from '../../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import TimeControlNode from '../../../../../scenery-phet/js/TimeControlNode.js';
import { Image, Text, VBox } from '../../../../../scenery/js/imports.js';
import AccordionBox from '../../../../../sun/js/AccordionBox.js';
import AquaRadioButtonGroup from '../../../../../sun/js/AquaRadioButtonGroup.js';
import BooleanRectangularToggleButton from '../../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import RectangularPushButton from '../../../../../sun/js/buttons/RectangularPushButton.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import ComboBox from '../../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../../sun/js/ComboBoxItem.js';
import DemosScreenView from '../../../../../sun/js/demo/DemosScreenView.js';
import HSlider from '../../../../../sun/js/HSlider.js';
import accordion_png from '../../../../images/accordion_png.js';
import brightMarimbaShort_mp3 from '../../../../sounds/brightMarimbaShort_mp3.js';
import birdCall_mp3 from '../../../../sounds/demo-and-test/birdCall_mp3.js';
import loonCall_mp3 from '../../../../sounds/demo-and-test/loonCall_mp3.js';
import SoundClipPlayer from '../../../sound-generators/SoundClipPlayer.js';
import ValueChangeSoundGenerator from '../../../sound-generators/ValueChangeSoundGenerator.js';
import tambo from '../../../tambo.js';

// constants
const LABEL_FONT = new PhetFont( 20 );

class UIComponentsScreenView extends DemosScreenView {

  /**
   * @constructor
   */
  constructor( model ) {

    const radioButtonItems = [
      {
        node: new Text( 'One Thing', { font: LABEL_FONT } ),
        value: 0
      },
      {
        node: new Text( 'Another Thing', { font: LABEL_FONT } ),
        value: 1
      },
      {
        node: new Text( 'An Entirely Different Thing', { font: LABEL_FONT } ),
        value: 2
      }
    ];

    const demos = [
      {
        label: 'PushButton',
        createNode: layoutBounds => new RectangularPushButton( {
          content: new Text( 'You\'re Pushing It.', { font: LABEL_FONT } ),
          center: layoutBounds.center
        } )
      },
      {
        label: 'Checkbox',
        createNode: layoutBounds => new Checkbox(
          new Text( 'Check it Out', { font: LABEL_FONT } ),
          new BooleanProperty( false ),
          {
            center: layoutBounds.center
          }
        )
      },
      {
        label: 'AquaRadioButtonGroup',
        createNode: layoutBounds => new AquaRadioButtonGroup(
          new NumberProperty( 0 ),
          radioButtonItems,
          {
            orientation: 'vertical',
            align: 'left',
            spacing: 10,
            center: layoutBounds.center
          }
        )
      },
      {
        label: 'TimeControlNode',
        createNode: layoutBounds => new TimeControlNode(
          new BooleanProperty( true ),
          {
            center: layoutBounds.center,
            playPauseStepButtonOptions: {
              includeStepBackwardButton: true
            }
          }
        )
      },
      {
        label: 'ResetAllButton',
        createNode: layoutBounds => new ResetAllButton( { center: layoutBounds.center } )
      },
      {
        label: 'ComboBox',
        createNode: layoutBounds => new ComboBox(
          [
            new ComboBoxItem( new Text( 'Rainbows', { font: LABEL_FONT } ), 0 ),
            new ComboBoxItem( new Text( 'Unicorns', { font: LABEL_FONT } ), 1 ),
            new ComboBoxItem( new Text( 'Butterflies', { font: LABEL_FONT } ), 2 )
          ],
          new NumberProperty( 0 ),
          this,
          { center: layoutBounds.center }
        )
      },
      {
        label: 'BooleanRectangularToggleButton',
        createNode: layoutBounds => new BooleanRectangularToggleButton(
          new Text( 'Yep', { font: LABEL_FONT } ),
          new Text( 'Nope', { font: LABEL_FONT } ),
          new BooleanProperty( true ),
          {
            baseColor: '#B3FFEC',
            center: layoutBounds.center
          }
        )
      },
      {
        label: 'AccordionBox',
        createNode: layoutBounds => new AccordionBox(
          new Image( accordion_png, { maxWidth: 200 } ),
          {
            titleNode: new Text( 'Accordion Box', { font: LABEL_FONT } ),
            expandedProperty: new BooleanProperty( false ),
            contentXMargin: 30,
            contentYMargin: 20,
            contentYSpacing: 20,
            center: layoutBounds.center
          }
        )
      },
      {
        label: 'Sliders',
        createNode: layoutBounds => new VBox( {
          children: [

            new Text( 'Continuous', { font: LABEL_FONT } ),

            // very basic slider with default sound
            new HSlider( new NumberProperty( 0 ), new Range( 0, 100 ) ),

            new Text( 'Discrete', { font: LABEL_FONT } ),

            // discrete slider
            new HSlider( new NumberProperty( 0 ), new Range( 0, 5 ), {
              constrainValue: value => Utils.roundSymmetric( value ),
              keyboardStep: 1,
              thumbFill: 'green',
              thumbFillHighlighted: '#80ff80'
            } ),

            new Text( 'Discrete with Tricky Values', { font: LABEL_FONT } ),

            // The following is a discrete slider
            new HSlider( new NumberProperty( 0 ), new Range( 0, 0.7 ), {
              constrainValue: value => Utils.roundToInterval( value, 0.05 ),
              keyboardStep: 1,
              thumbFill: '#6600cc',
              thumbFillHighlighted: '#b366ff',
              soundGeneratorOptions: { numberOfMiddleThresholds: Utils.roundSymmetric( 0.7 / 0.05 ) - 1 }
            } ),

            new Text( 'Custom Sounds', { font: LABEL_FONT } ),

            // slider with custom sound generation, intended to be a little "out there"
            new HSlider( new NumberProperty( 0 ), new Range( 0, 100 ), {
              soundGenerator: new ValueChangeSoundGenerator( new Range( 0, 100 ), {
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
            } )
          ],
          spacing: 20,
          center: layoutBounds.center
        } )
      }
    ];

    super( demos );

    // add the reset all button
    const resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.maxX - 25,
      bottom: this.layoutBounds.maxY - 25,
      listener: () => {
        model.reset();
      }
    } );
    this.addChild( resetAllButton );
  }
}

tambo.register( 'UIComponentsScreenView', UIComponentsScreenView );
export default UIComponentsScreenView;