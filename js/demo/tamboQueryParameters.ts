// Copyright 2024, University of Colorado Boulder

/**
 * Query parameters for the tambo demo application.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import tambo from '../tambo.js';

const NUMBER_OF_GAME_LEVELS = 5;
export { NUMBER_OF_GAME_LEVELS };

const tamboQueryParameters = QueryStringMachine.getAll( {} );

tambo.register( 'tamboQueryParameters', tamboQueryParameters );
export default tamboQueryParameters;