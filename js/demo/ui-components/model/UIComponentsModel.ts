// Copyright 2018-2022, University of Colorado Boulder

/**
 * UIComponentsModel is a model that exists only for the purposes of demonstrating sonification, particularly the
 * sound-related behavior of common user interface (UI) components.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import tambo from '../../../tambo.js';

class UIComponentsModel {

  // tracks whether a reset is happening
  public readonly resetInProgressProperty: BooleanProperty;

  /**
   * @constructor
   */
  constructor() {
    this.resetInProgressProperty = new BooleanProperty( false );
  }

  /**
   * restore initial state
   */
  public reset() {
    this.resetInProgressProperty.value = true;
    this.resetInProgressProperty.value = false;
  }
}

tambo.register( 'UIComponentsModel', UIComponentsModel );

export default UIComponentsModel;