// Copyright 2018-2020, University of Colorado Boulder

/**
 * enum for the different sound level settings
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import tambo from './tambo.js';

const SoundLevelEnum = {
  BASIC: 'BASIC',
  ENHANCED: 'ENHANCED'
};

// in development mode, catch any attempted changes to the enum
if ( assert ) { Object.freeze( SoundLevelEnum ); }

tambo.register( 'SoundLevelEnum', SoundLevelEnum );
export default SoundLevelEnum;