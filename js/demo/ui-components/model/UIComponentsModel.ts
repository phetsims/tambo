// Copyright 2018-2023, University of Colorado Boulder

/**
 * UIComponentsModel is a model that exists only for the purposes of demonstrating sonification, particularly the
 * sound-related behavior of common user interface (UI) components.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import TModel from '../../../../../joist/js/TModel.js';
import tambo from '../../../tambo.js';

class UIComponentsModel implements TModel {

  // property used by the AB switches in the demo
  public readonly abSwitch1Property: BooleanProperty = new BooleanProperty( false );
  public readonly abSwitch2Property: BooleanProperty = new BooleanProperty( false );
  public readonly abSwitch3Property: BooleanProperty = new BooleanProperty( false );
  public readonly onOffSwitchProperty: BooleanProperty = new BooleanProperty( false );

  // tracks whether a reset is happening
  public readonly resetInProgressProperty: BooleanProperty;

  public constructor() {
    this.resetInProgressProperty = new BooleanProperty( false );
  }

  /**
   * restore initial state
   */
  public reset(): void {
    this.resetInProgressProperty.value = true;
    this.abSwitch1Property.reset();
    this.abSwitch2Property.reset();
    this.abSwitch3Property.reset();
    this.onOffSwitchProperty.reset();
    this.resetInProgressProperty.value = false;
  }
}

tambo.register( 'UIComponentsModel', UIComponentsModel );

export default UIComponentsModel;