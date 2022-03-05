// Copyright 2021, University of Colorado Boulder

/**
 * SoundPlayer is a "definition" type, based off of PaintDef.js, that defines a type that is used in the tambo sound
 * library but is not actually a base class.  This is similar to the idea of an "interface" in Java.  A SoundPlayer type
 * is a sound generator that has just the most basic methods for playing a sound.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

type SoundPlayer = {
  play: () => void;
  stop: () => void;
};

export default SoundPlayer;
