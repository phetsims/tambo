// Copyright 2018, University of Colorado Boulder

/**
 * A model that exists only for the purposes of demonstrating sonification, particularly how view and model elements are
 * used together to hook up sonification elements.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const tambo = require( 'TAMBO/tambo' );

  // constants
  const LIGHTNING_SHOWN_TIME = 0.750; // in seconds

  /**
   * @constructor
   */
  function UIComponentsModel() {

    const self = this;

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
        self.lightningBoltVisibleTimer = LIGHTNING_SHOWN_TIME;
      }
    } );

    // @public {BooleanProperty} - tracks whether a reset is happening
    this.resetInProgressProperty = new BooleanProperty( false );
  }

  tambo.register( 'UIComponentsModel', UIComponentsModel );

  return inherit( Object, UIComponentsModel, {

    /**
     * step the model forward in time, generally called by the framework
     * @param {number} dt - time step, in seconds
     * @public
     */
    step: function( dt ) {

      // manage the lightning visibility timer
      if ( this.lightningBoltVisibleTimer > 0 ) {
        this.lightningBoltVisibleTimer -= dt;
        if ( this.lightningBoltVisibleTimer <= 0 ) {

          // countdown complete, set visibility to false
          this.lightningBoltVisibleProperty.set( false );
        }
      }
    },

    /**
     * restore initial state
     * @public
     */
    reset: function() {
      this.resetInProgressProperty.set( true );
      this.discreteValueProperty.reset();
      this.continuousValueProperty.reset();
      this.loopOnProperty.reset();
      this.lightningBoltVisibleProperty.reset();
      this.resetInProgressProperty.set( false );
    }
  } );
} );