// Copyright 2020-2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/LocalizedStringProperty.js';
import tambo from './tambo.js';

type StringsType = {
  'tambo': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'simLikeComponentsStringProperty': LocalizedStringProperty;
    'uiComponentsStringProperty': LocalizedStringProperty;
    'testingStringProperty': LocalizedStringProperty;
  }
};

const TamboStrings = getStringModule( 'TAMBO' ) as StringsType;

tambo.register( 'TamboStrings', TamboStrings );

export default TamboStrings;
