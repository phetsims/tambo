// Copyright 2018, University of Colorado Boulder

/**
 * enum for the different sound level settings
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const tambo = require( 'TAMBO/tambo' );

  const SoundLevelEnum = {
    BASIC: 'BASIC',
    ENHANCED: 'ENHANCED'
  };

  SoundLevelEnum.VALUES = _.values( SoundLevelEnum );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( SoundLevelEnum ); }

  return tambo.register( 'SoundLevelEnum', SoundLevelEnum );
} );