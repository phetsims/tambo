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
import Text from '../../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup from '../../../../../sun/js/AquaRadioButtonGroup.js';
import RectangularPushButton from '../../../../../sun/js/buttons/RectangularPushButton.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import DemosScreenView from '../../../../../sun/js/demo/DemosScreenView.js';
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
          content: new Text( 'Push Me Already', { font: LABEL_FONT } ),
          center: layoutBounds.center
        } )
      },
      {
        label: 'Checkbox',
        createNode: layoutBounds => new Checkbox(
          new Text( 'Check Me', { font: LABEL_FONT } ),
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