// Copyright 2018-2020, University of Colorado Boulder

/**
 * A model that exists only for the purposes of demonstrating sonification, particularly how view and model elements are
 * used together to hook up sonification elements.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import tambo from '../../../tambo.js';

// constants
const LIGHTNING_SHOWN_TIME = 0.750; // in seconds

class UIComponentsModel {

  /**
   * @constructor
   */
  constructor() {

    // @public {NumberProperty} - a Property that is intended to be hooked up to a slider with discrete values
    this.discreteValueProperty = new NumberProperty( 0 );

    // @public {NumberProperty} - a Property that is intended to be hooked up to a slider with continuous values
    this.continuousValueProperty = new NumberProperty( 0 );

    // @public {BooleanProperty} - tracks whether the sound loop should be on
    this.loopOnProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - tracks whether the lightning bolt is visible
    this.lightningBoltVisibleProperty = new BooleanProperty( false );

    // @private {Number} - countdown timer used to hide the lightning bolt, in seconds
    this.lightningBoltVisibleTimer = 0;

    // reload the countdown timer when the lightning bolt is set to be shown
    this.lightningBoltVisibleProperty.link( visible => {
      if ( visible ) {
        this.lightningBoltVisibleTimer = LIGHTNING_SHOWN_TIME;
      }
    } );

    // @public {BooleanProperty} - tracks whether a reset is happening
    this.resetInProgressProperty = new BooleanProperty( false );
  }

  /**
   * step the model forward in time, generally called by the framework
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {

    // manage the lightning visibility timer
    if ( this.lightningBoltVisibleTimer > 0 ) {
      this.lightningBoltVisibleTimer -= dt;
      if ( this.lightningBoltVisibleTimer <= 0 ) {

        // countdown complete, set visibility to false
        this.lightningBoltVisibleProperty.value = false;
      }
    }
  }

  /**
   * restore initial state
   * @public
   */
  reset() {
    this.resetInProgressProperty.value = true;
    this.discreteValueProperty.reset();
    this.continuousValueProperty.reset();
    this.loopOnProperty.reset();
    this.lightningBoltVisibleProperty.reset();
    this.resetInProgressProperty.value = false;
  }

}

tambo.register( 'UIComponentsModel', UIComponentsModel );

export default UIComponentsModel;