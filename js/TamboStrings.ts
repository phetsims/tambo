// Copyright 2020-2024, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
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
