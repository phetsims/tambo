// Copyright 2018-2022, University of Colorado Boulder

/**
 * UIComponentsScreenView is a view for a screen that demonstrates views and sounds for common User Interface
 * components.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import ResetAllButton from '../../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NumberControl from '../../../../../scenery-phet/js/NumberControl.js';
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
import accordion_png from '../../../../images/accordion_png.js';
import tambo from '../../../tambo.js';
import SliderSoundTestNode from './SliderSoundTestNode.js';
import UIComponentsModel from '../model/UIComponentsModel.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';

// constants
const LABEL_FONT = new PhetFont( 20 );

class UIComponentsScreenView extends DemosScreenView {

  constructor( model: UIComponentsModel ) {

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
        createNode: ( layoutBounds: Bounds2 ) => new RectangularPushButton( {
          content: new Text( 'You\'re Pushing It.', { font: LABEL_FONT } ),
          center: layoutBounds.center
        } )
      },
      {
        label: 'Checkbox',
        createNode: ( layoutBounds: Bounds2 ) => new Checkbox(
          new Text( 'Check it Out', { font: LABEL_FONT } ),
          new BooleanProperty( false ),
          {
            center: layoutBounds.center
          }
        )
      },
      {
        label: 'AquaRadioButtonGroup',
        createNode: ( layoutBounds: Bounds2 ) => new AquaRadioButtonGroup(
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
        createNode: ( layoutBounds: Bounds2 ) => new TimeControlNode(
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
        createNode: ( layoutBounds: Bounds2 ) => new ResetAllButton( { center: layoutBounds.center } )
      },
      {
        label: 'ComboBox',
        createNode: ( layoutBounds: Bounds2 ) => new ComboBox(
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
        createNode: ( layoutBounds: Bounds2 ) => new BooleanRectangularToggleButton(
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
        createNode: ( layoutBounds: Bounds2 ) => new AccordionBox(
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
        createNode: ( layoutBounds: Bounds2 ) => new SliderSoundTestNode( LABEL_FONT, layoutBounds.center )
      },
      {
        label: 'NumberControl',
        createNode: ( layoutBounds: Bounds2 ) => new VBox( {
          children: [

            new NumberControl( 'How much you want?', new NumberProperty( 0 ), new Range( 0, 10 ), { delta: 2 } ),

            // This is an example of a number control that has a delta value that leads to thresholds in the sound
            // player that are not all equally sized.  See https://github.com/phetsims/sun/issues/697.
            new NumberControl( 'How much you want (asymmetric)?', new NumberProperty( 0 ), new Range( 0, 100 ), { delta: 22 } )
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