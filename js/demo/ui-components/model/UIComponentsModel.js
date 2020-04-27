// Copyright 2018-2020, University of Colorado Boulder

/**
 * A model that exists only for the purposes of demonstrating sonification, particularly how view and model elements are
 * used together to hook up sonification elements.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import tambo from '../../../tambo.js';

class UIComponentsModel {

  /**
   * @constructor
   */
  constructor() {

    // @public {BooleanProperty} - tracks whether a reset is happening
    this.resetInProgressProperty = new BooleanProperty( false );
  }

  /**
   * restore initial state
   * @public
   */
  reset() {
    this.resetInProgressProperty.value = true;
    this.resetInProgressProperty.value = false;
  }

}

tambo.register( 'UIComponentsModel', UIComponentsModel );
export default UIComponentsModel;