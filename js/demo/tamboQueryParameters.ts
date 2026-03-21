// Copyright 2024-2026, University of Colorado Boulder

/**
 * Query parameters for the tambo demo application.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';

const NUMBER_OF_GAME_LEVELS = 5;
export { NUMBER_OF_GAME_LEVELS };

const tamboQueryParameters = QueryStringMachine.getAll( {} );

export default tamboQueryParameters;
