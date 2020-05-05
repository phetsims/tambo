
# User Guide for the Tambo Sound Library

## Introduction

This document describes the PhET sound library that is maintained in the "tambo" repo.  The library is used to add
sound to PhET simulations with the intention of enhancing the learning experience and improving accessibility.  The
library is built on web standards such as Web Audio, though it should be possible to use it without needing to dig too
deeply into the specific web standards on which it is based.

This document covers the terminology, general design, philosophy, and history of this library.  Its intended audience is
software developers that are endeavoring to add sound to simulations that are being built using PhET's software
infrastructure and need to understand some of the background behind this library in order to use it effectively.  There
is a companion checklist document that lists the steps in a compact and linear form.  That document may well be the only
one needed by developers who are already experienced in adding sound to simulations and just need a clear and compact
reference. 

## Overview

The general idea behind PhET's tambo library is to enable developers to add sound to simulations quickly and easily by
adding "sound generators" to the simulation.  There are numerous examples of common patterns that emerged during the
initial work on adding sound to simulations, and developers should be able to leverage these through direct reuse and/or
the following of similar examples.  One of the goals of the library is that a simple sound design can be implemented
without the developer having to delve very deeply into the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).
However, in cases where a unique or unusual sound design element is needed, tambo is designed such that Web Audio
components can be used directly.  It is *not* intended to be a library that sits atop Web Audio and creates a layer of
abstraction such that some other underlying audio generation could be used.  In other words, if Web Audio goes away,
tambo - and most likely the sims that use it - will require significant revision. 

## Terminology

Here are some terms that were essentially invented in the process of creating this library:

- Sound Generator: An object that extends the `SoundGenerator` base class and can be added to the sound manager in
order to make it audible.
- Sound Manager: A singleton instance that hooks sound generators to the output audio path, keeps track of them, and
mutes them if sound is disabled, if the sim becomes invisible, and in several other circumstances
- Sound Clip: A sound generator that is based on a pre-recorded bit of audio.
- 

## Background and History

In the days when PhET first started adding more elaborate sound designs (i.e. sound beyond game feedback and occasional
custom sound) to our sims, we started prototype the sound designs by using PhET-iO wrappers.  This worked well for a
while, but ran into some issues as PhET-iO evolved.  In 
https://github.com/phetsims/phet-io-wrapper-sonification/issues/84, it was decided that further sound design prototyping
would be done on master, with the sounds hidden behind a query parameter until they were finalized and ready to be
deployed.

## Core Concepts

### The Sound Manager

### Sound Classes

## Overriding Default Sound Generation in Common UI Components

## Using the Web Audio API to Create Unique Sound Generators

## Adding Sim-Specific Sound Generation

Rule of thumb: If a sound can be generated purely by watching model components, much the way the view is generated,
then the sound generator should either go in the `xxxScreenView` type or, if there is a lot of sound generation, in
a separate `xxxScreenSoundView` file in the `view` subdirectory.  If, however, the sound generation also needs to know
about how the user is interacting with the controls, the sound generation can go into the view component.  An example of
this is `MassControl.js`.  In this case, the nature of the sound generation depended in part on whether the mass value
was being changed by slider dragging or buttons. 

Integrate: resetInProgressProperty - when is it needed?

## Using the "Options" Dialog to Compare Candidate Sounds

It is often useful to publish dev versions of simulations where the sound designers can choose between a set of sound
options that are being considered for a given action.  To date, this has generally been implemented be adding an
"Options" dialog (or enhancing the one that is already there), setting the value of a global variable, and then
referencing that variable where the sound generation occurs.  For an example of this, please see
`SoundOperationsDialogContent` in tambo, and search for its usages in the code.   
