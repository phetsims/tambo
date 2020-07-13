// Copyright 2018-2020, University of Colorado Boulder

/**
 * view for a screen that demonstrates views and sounds for components that interact with the model in some way
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import ResetAllButton from '../../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import TimeControlNode from '../../../../../scenery-phet/js/TimeControlNode.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../../sun/js/AccordionBox.js';
import AquaRadioButtonGroup from '../../../../../sun/js/AquaRadioButtonGroup.js';
import BooleanRectangularToggleButton from '../../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import RectangularPushButton from '../../../../../sun/js/buttons/RectangularPushButton.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import ComboBox from '../../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../../sun/js/ComboBoxItem.js';
import DemosScreenView from '../../../../../sun/js/demo/DemosScreenView.js';
import accordionImage from '../../../../images/accordion_png.js';
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
          new Image( accordionImage, { maxWidth: 200 } ),
          {
            titleNode: new Text( 'Accordion Box', { font: LABEL_FONT } ),
            expandedProperty: new BooleanProperty( false ),
            contentXMargin: 30,
            contentYMargin: 20,
            contentYSpacing: 20,
            center: layoutBounds.center
          }
        )
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