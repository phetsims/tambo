// Copyright 2019, University of Colorado Boulder

/**
 * RemoveAndDisposeCommonUIComponentsTestPanel is a panel that allows the user to add sound-generating common UI
 * components to the scene graph and then remove and dispose them.  It is essentially a test harness for verifying that
 * creation and registration of the sounds associated with these components works at any time, as well as the disposal
 * of these components.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const tambo = require( 'TAMBO/tambo' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );

  // constants
  const ADD_REMOVE_BUTTON_FONT = new PhetFont( 18 );
  const ADD_REMOVE_BUTTON_COLOR = '#C38888';
  const COMBO_BOX_FONT = new PhetFont( 16 );

  // info needed for selecting the various common UI components from the combo box
  const UI_COMPONENT_INFO = {
    rectangularPushButton: {
      comboBoxName: 'Rectangular Push Button',
      createUIComponent: () => new RectangularPushButton( {
        content: new Text( 'Push Me', { font: new PhetFont( 18 ) } ),
        baseColor: '#009900'
      } )
    },
    roundPushButton: {
      comboBoxName: 'Round Push Button',
      createUIComponent: () => new RoundPushButton( {
        content: new Text( 'Push Me', { font: new PhetFont( 12 ) } )
      } )
    },
    checkbox: {
      comboBoxName: 'Checkbox',
      createUIComponent: () => new Checkbox(
        new Text( 'Check Me', { font: new PhetFont( 16 ) } ),
        new Property( false )
      )
    },
    playPauseButton: {
      comboBoxName: 'Play/Pause Button',
      createUIComponent: () => new PlayPauseButton( new Property( true ) )
    }
  };

  class RemoveAndDisposeCommonUIComponentsTestPanel extends Panel {

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

      // create the combo box for selecting the type of sound generator to add
      const comboBoxItems = [];
      _.keys( UI_COMPONENT_INFO ).forEach( soundGeneratorKey => {
        comboBoxItems.push( new ComboBoxItem(
          new Text( UI_COMPONENT_INFO[ soundGeneratorKey ].comboBoxName, { font: COMBO_BOX_FONT } ),
          soundGeneratorKey
        ) );
      } );
      const selectedUIComponentGenerator = new Property( comboBoxItems[ 0 ].value );
      const componentSelectorComboBox = new ComboBox(
        comboBoxItems,
        selectedUIComponentGenerator,
        comboBoxListParent
      );

      // control the combo box enabled state
      activeUIComponentProperty.link( activeUIComponent => {
        componentSelectorComboBox.enabled = activeUIComponent === null;
      } );

      // button for adding the UI components
      const addUIComponentButton = new TextPushButton( 'Add', {
        baseColor: ADD_REMOVE_BUTTON_COLOR,
        font: ADD_REMOVE_BUTTON_FONT,
        listener: () => { addUIComponent(); }
      } );

      // button for adding the UI components
      const removeUIComponentButton = new TextPushButton( 'Remove', {
        baseColor: ADD_REMOVE_BUTTON_COLOR,
        font: ADD_REMOVE_BUTTON_FONT,
        listener: () => { removeUIComponent(); }
      } );

      // HBox with the buttons
      const addRemoveButtonsHBox = new HBox( {
        children: [ addUIComponentButton, removeUIComponentButton ],
        spacing: 20
      } );

      // control button enabled states
      activeUIComponentProperty.link( uiComponent => {
        addUIComponentButton.enabled = uiComponent === null;
        removeUIComponentButton.enabled = uiComponent !== null;
      } );

      // put the controls for adding and removing the UI components in a VBox
      const addRemoveControlsVBox = new VBox( {
        children: [ componentSelectorComboBox, addRemoveButtonsHBox ],
        align: 'left',
        spacing: 19
      } );

      // create a background node where the added controls will come and go, size empirically determined
      const uiComponentBackgroundNode = new Rectangle( 0, 0, 350, addRemoveControlsVBox.height, {
        fill: 'rgba( 200, 200, 200, 0.4 )'
      } );

      // create an HBox with the controls on the left and the space where the components go on the right
      const controlsAndComponentSpace = new HBox( {
        children: [ addRemoveControlsVBox, uiComponentBackgroundNode ],
        spacing: 20
      } );

      // function to add a UI component
      const addUIComponent = () => {
        const uiComponent = UI_COMPONENT_INFO[ selectedUIComponentGenerator.value ].createUIComponent();
        uiComponent.center = uiComponentBackgroundNode.localBounds.center;
        uiComponentBackgroundNode.addChild( uiComponent );
        activeUIComponentProperty.set( uiComponent );
      };

      // function to remove and dispose the active UI component
      const removeUIComponent = () => {
        const activeUIComponent = activeUIComponentProperty.value;
        uiComponentBackgroundNode.removeChild( activeUIComponentProperty.value );
        activeUIComponent.dispose();
        activeUIComponentProperty.set( null );
      };

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

  tambo.register( 'RemoveAndDisposeCommonUIComponentsTestPanel', RemoveAndDisposeCommonUIComponentsTestPanel );

  return RemoveAndDisposeCommonUIComponentsTestPanel;
} );