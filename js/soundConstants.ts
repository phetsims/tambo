// Copyright 2019-2022, University of Colorado Boulder

/**
 * a singleton instance that contains constants shared amongst the sound generation code modules
 *
 * @author John Blanco
 */

import tambo from './tambo.js';

// instance definition
const soundConstants = {

  // A time constant value, in seconds, that is used in Web Audio calls that have an exponential change, such as
  // setTargetAtTime.  The value was empirically determined to work well for fast gain changes, and may be appropriate
  // for other parameter changes.
  DEFAULT_PARAM_CHANGE_TIME_CONSTANT: 0.015,

  // Time, in seconds, for linear gain changes.  This is generally used in calls to linearRampToValueAtTime.  The
  // value was empirically determined to be reasonably fast, but not so fast that it causes audible transients
  // (generally heard as clicks) when turning sounds on and off.
  DEFAULT_LINEAR_GAIN_CHANGE_TIME: 0.1,

  // The twelfth root of 2 is useful when doing math that is creating tones that relate to an even-tempered 12-tone
  // musical scale.
  TWELFTH_ROOT_OF_TWO: Math.pow( 2, 1 / 12 )
};

// register for phet-io
tambo.register( 'soundConstants', soundConstants );

export default soundConstants;