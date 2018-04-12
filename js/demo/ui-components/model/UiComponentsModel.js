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
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var tambo = require( 'TAMBO/tambo' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @constructor
   */
  function UiComponentsModel() {

    // @public {NumberProperty} - a property that is intended to be hooked up to a slider with discrete values
    this.discreteValueProperty = new NumberProperty( 0 );

    // @public {NumberProperty} - a property that is intended to be hooked up to a slider with continuous values
    this.continuousValueProperty = new NumberProperty( 0 );

    // @public {BooleanProperty} - tracks whether the sound loop should be on
    this.loopOnProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - tracks whether a reset is happening
    this.resetInProgressProperty = new BooleanProperty( false );
  }

  tambo.register( 'UiComponentsModel', UiComponentsModel );

  return inherit( Object, UiComponentsModel, {

    reset: function() {
      this.resetInProgressProperty.set( true );
      this.discreteValueProperty.reset();
      this.loopOnProperty.reset();
      this.resetInProgressProperty.set( false );
    }
  } );
} );