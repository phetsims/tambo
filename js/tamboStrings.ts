// Copyright 2020-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import tambo from './tambo.js';

type StringsType = {
  'tambo': {
    'title': string;
    'titleProperty': TReadOnlyProperty<string>;
  }
};

const tamboStrings = getStringModule( 'TAMBO' ) as StringsType;

tambo.register( 'tamboStrings', tamboStrings );

export default tamboStrings;
