
# User Guide for the Tambo Sound Library

## Introduction

This document describes the PhET sound library that is maintained in the "phetsims/tambo" repo.  The library is used to
incorporate sound into PhET simulations with the intention of enhancing the learning experience and improving
accessibility.  The library is built on web standards - primarily Web Audio - but in most cases it should be possible to
use it without needing to dig too deeply into the specific web standards on which it is based.

This document covers the terminology, general design, philosophy, history, and usage of this library.  Its intended
audience is software developers that are endeavoring to add sound to simulations that are being built using PhET's
software infrastructure and need to understand some of the background behind this library in order to use it
effectively.  There is a [companion checklist document](https://github.com/phetsims/tambo/blob/master/doc/adding-sound-to-a-sim.md) that lists the steps for adding sound to
a PhET simulation in a compact, linear form.  That document should be used each time sound is added to, or included in,
a simulation.  This one probably only needs to be read once and referenced thereafter.  

## Overview

The general intent behind the tambo library is to enable developers to add sound to simulations quickly and easily
through the incorporation of "sound generators" into the sim code.  These sound generators monitor user actions and the
results thereof and produce sounds that are intended to convey information about what's going on in the simulation.  

One of the primary goals of the library is that a simple sound design can be implemented without the developer having to
delve very deeply into the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).
However, in cases where a unique or unusual sound design element is needed, tambo is designed such that Web Audio
components can be used directly.  It is *not* intended to be a library that sits atop Web Audio and creates a layer of
abstraction such that some other underlying audio generation could be used.  In other words, if Web Audio goes away,
tambo - and most likely the sims that use it - will require significant revision.

Development of this library started in late 2017, and since that time sound has been added to a number of simulations.
This existing code should serve as examples that can be leveraged when implementing a new sound design, whether adding
sound to an existing sim or incorporating sound during the initial development. 

## Terminology

Here are some terms that were essentially invented in the process of creating this library:

- Sound Generator: An object that extends the `SoundGenerator` base class and can be added to the sound manager in
order to make it audible.
- Sound Manager: A singleton instance that hooks sound generators to the output audio path, keeps track of them, and
mutes them if sound is disabled, if the sim becomes invisible, and in several other circumstances
- Sound Clip: A sound generator that is based on a pre-recorded bit of audio.
- Multi-Clip: A sound generator that can play one of several pre-recorded audio snippets in response to some event
- Common UI Sound: A sound that is played by default by a common user interface component, such as a checkbox or a push
button

## Background and History

PhET simulations have produced sound since before the transition to HTML5.  Java and Flash simulations used sound
primarily for feedback in games and for a smattering of other user interactions.  This basic sound generation was
carried forward into the HTML5 sims.  In 2018 an effort was initiated to use sound more consistently and frequently in
the simulations, in part to make them more accessible to users with visual disabilities, and also to make the learning
experience more multi-modal.  That's when this library was started.

When the more elaborate sound designs were started, we started prototyping them by using PhET-iO wrappers that monitored
the state of the simulation and produced sounds in response, but didn't make any changes to the primary simulation code
base.  This worked well for a while, but ran into some issues as PhET-iO evolved.  In 
https://github.com/phetsims/phet-io-wrapper-sonification/issues/84, it was decided that further sound design prototyping
would be done on master, with the sounds hidden behind a query parameter until they were finalized and ready to be
deployed.

## Core Concepts

### The Sound Manager

The sound manager is a singleton that sets up the audio signal flow and then manages the sound generators.  It does
things like mute the sounds when the sim is no longer visible, such as when the tab on which the sim resides is hidden
or when the browser window is minimized.  It also allows the management of output levels for certain "categories" of
sounds generators, such as UI sounds or sim-specific sounds.  Sound generators are registered with the sound manager,
which hooks them into the signal path so that they can be heard.

### Sound Generators

Sound generators, as the name suggests, produce sound.  There is a `SoundGenerator` base class the provides the
infrastructure needed to allow it to be wired into the sound manager.  Sound generators can also be used within
another sound generator to create more complex sound capabilities where different sounds are played in different
situations, or sounds that are mixed together, or that fade between one another.  The "root" sound generator must be
added to the sound manager for sound to be hear.

There are a number of pre-fab sound generators that are available in tambo.  For simpler sound designs, these may be
sufficient and no "custom" sound generators may be needed.

### Sound Clip

The `SoundClip` is a specific subclass out `SoundGenerator` that allows playback of pre-recorded sampled sounds, and is
the most commonly used sound generator. It can be used to play one-shot sounds that are generally fairly short, or it
can be used to create repeating sound "loops" that can be started, stopped, sped up, and slowed down.

When the development of tambo was started, there was some time invested in using Web Audio oscillators to create the
sounds, first as sound sources themselves, then in some complex combinations to produce FM synthesis sounds.  With a
few exceptions, none of these sounds proved to be very enjoyable in simulations.  As of this writing, most sounds that
are more than a few milliseconds long are generated as a sound clip.

## Adding Sim-Specific Sound Generation

Rule of thumb: If a sound can be generated purely by watching model components, much the way the view is generated,
then the sound generator should either go in the `xxxScreenView` type or, if there is a lot of sound generation, in
a separate `xxxScreenSoundView` file in the `view` subdirectory.  If, however, the sound generation also needs to know
about how the user is interacting with the controls, the sound generation can go into the view component.  An example of
this is `MassControl.js`.  In this case, the nature of the sound generation depended in part on whether the mass value
was being changed by slider dragging or buttons. 

TODO: resetInProgressProperty - when is it needed?

## Overriding Default Sound Generation in Common UI Components

TODO: Fill in.

## Using the Web Audio API to Create Unique Sound Generators

TODO: Fill in.

## Using the "Options" Dialog to Compare Candidate Sounds

It is often useful to publish dev versions of simulations where the sound designers can choose between a set of sound
options that are being considered for a given action.  To date, this has generally been implemented be adding an
"Options" dialog (or enhancing the one that is already there), setting the value of a global variable, and then
referencing that variable where the sound generation occurs.  For an example of this, please see
`SoundOperationsDialogContent` in tambo, and search for its usages in the code.  

## Some Common Patterns

+ Properties wired up to trigger sounds.

# A Word About Browser Autoplay Policies 

TODO: Fill this in.