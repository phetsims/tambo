// Copyright 2022, University of Colorado Boulder

/**
 * TSoundPlayer defines a simple interface that can be used to support polymorphism when defining options and other
 * API interfaces that include sound generation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

type TSoundPlayer = {
  play: () => void;
  stop: () => void;
};

export default TSoundPlayer;
