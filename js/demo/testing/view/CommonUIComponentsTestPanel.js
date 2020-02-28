// Copyright 2019-2020, University of Colorado Boulder

/**
 * CommonUIComponentsTestPanel is a panel that allows the user to add sound-generating common UI components to the scene
 * graph, interact with them (one at a time), and then remove and dispose them.  It is essentially a test harness for
 * verifying that creation and registration of the sounds associated with these components works and can be done after
 * initialization, that the basic operation is correct, and that disposal works.
 *
 * Note that this is intended to test sound-generating common user interface components, not all common UI components.
 * SoundGeneratingCommonUIComponentsTestPanel just seemed a little verbose.
 *
 * @author John Blanco
 */

import Property from '../../../../../axon/js/Property.js';
import merge from '../../../../../phet-core/js/merge.js';
import PlayPauseButton from '../../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../../../../sun/js/buttons/RectangularPushButton.js';
import RoundPushButton from '../../../../../sun/js/buttons/RoundPushButton.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import ComboBox from '../../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../../sun/js/ComboBoxItem.js';
import Panel from '../../../../../sun/js/Panel.js';
import tambo from '../../../tambo.js';

// constants
const COMBO_BOX_FONT = new PhetFont( 16 );

// items for the combo box, each consists of a text node and a creator function for the common UI component
const UI_COMPONENT_SELECTOR_COMBO_BOX_ITEMS = [
  new ComboBoxItem(
    new Text( 'None', { font: COMBO_BOX_FONT } ),
    null
  ),
  new ComboBoxItem(
    new Text( 'Rectangular Push Button', { font: COMBO_BOX_FONT } ),
    () => new RectangularPushButton( {
      content: new Text( 'Push Me', { font: new PhetFont( 18 ) } ),
      baseColor: '#009900'
    } )
  ),
  new ComboBoxItem(
    new Text( 'Round Push Button', { font: COMBO_BOX_FONT } ),
    () => new RoundPushButton( {
      content: new Text( 'Push Me', { font: new PhetFont( 14 ) } ),
      baseColor: '#884400'
    } )
  ),
  new ComboBoxItem(
    new Text( 'Checkbox', { font: COMBO_BOX_FONT } ),
    () => new Checkbox(
      new Text( 'Check Me', { font: new PhetFont( 16 ) } ),
      new Property( false )
    )
  ),
  new ComboBoxItem(
    new Text( 'Play/Pause Button', { font: COMBO_BOX_FONT } ),
    () => new PlayPauseButton( new Property( true ) )
  )
];

class CommonUIComponentsTestPanel extends Panel {

  /**
   * @param {Object} [options]
   * @constructor
   */
  constructor( options ) {

    options = merge( {
      fill: '#E5F3FF',
      xMargin: 14,
      yMargin: 14,
      comboBoxListParent: null
    }, options );

    // the UI component that has been added and is under test, null signifies none
    const activeUIComponentProperty = new Property( null );

    // node where the content goes, needed so that ComboBox will have a good place to put its list if a list parent
    // node is not provided
    const panelContentNode = new Node();

    const comboBoxListParent = options.comboBoxListParent || panelContentNode;

    // informational text that goes at the top of the panel
    const infoText = new Text( 'Test addition, removal, and disposal of sound generating UI components', {
      font: new PhetFont( { size: 18, weight: 'bold' } )
    } );

    // create the combo box for selecting the type of UI component to add
    const selectedUIComponentItem = new Property( UI_COMPONENT_SELECTOR_COMBO_BOX_ITEMS[ 0 ].value );
    const componentSelectorComboBox = new ComboBox(
      UI_COMPONENT_SELECTOR_COMBO_BOX_ITEMS,
      selectedUIComponentItem,
      comboBoxListParent
    );

    // remove the current item and switch to the next when the combo box value changes
    selectedUIComponentItem.link( uiComponentGenerator => {

      // remove the currently displayed UI component - this is where the dispose function is tested
      const activeUIComponent = activeUIComponentProperty.value;
      if ( activeUIComponent !== null ) {
        uiComponentBackgroundNode.removeChild( activeUIComponent );
        activeUIComponent.dispose();
        activeUIComponentProperty.set( null );
      }

      // add the newly chosen UI component if it's not "nothing"
      if ( uiComponentGenerator ) {
        const uiComponent = uiComponentGenerator();
        uiComponent.center = uiComponentBackgroundNode.localBounds.center;
        uiComponentBackgroundNode.addChild( uiComponent );
        activeUIComponentProperty.set( uiComponent );
      }
    } );


    // create a background node where the added controls will come and go, size empirically determined
    const uiComponentBackgroundNode = new Rectangle( 0, 0, 350, 80, {
      fill: 'rgba( 200, 200, 200, 0.4 )'
    } );

    // create an HBox with the controls on the left and the space where the components go on the right
    const controlsAndComponentSpace = new HBox( {
      children: [ componentSelectorComboBox, uiComponentBackgroundNode ],
      spacing: 20
    } );

    // add everything to a vertical box
    const rootVBox = new VBox( {
      children: [ infoText, controlsAndComponentSpace ],
      align: 'center',
      spacing: 19
    } );

    panelContentNode.addChild( rootVBox );

    super( panelContentNode, options );
  }
}

tambo.register( 'CommonUIComponentsTestPanel', CommonUIComponentsTestPanel );

export default CommonUIComponentsTestPanel;