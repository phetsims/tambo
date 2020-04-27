Eventually this document will offer guidelines on how to add sound to a simulation.  As of this writing, it's a place
to capture thoughts that will be organized once the process is more worked out.

Overview
========

The general idea behind PhET's tambo library is to enable developers to add sound to simulations quickly and easily by
adding "sound generators" to the simulation.  There are numerous examples of common patterns that emerged during the
initial work on adding sound to simulations, and developers should be able to leverage these through direct reuse and/or
the following of similar examples.  One of the goals of the library is that a simple sound design can be implemented
without the developer having to delve very deeply into the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).
However, in cases where a unique or unusual sound design element is needed, tambo is designed such that Web Audio
components can be used directly.  It is *not* intended to be a library that sits atop Web Audio and creates a layer of
abstraction such that some other underlying audio generation could be used.  In other words, if Web Audio goes away,
tambo - and most likely the sims that use it - will require significant revision. 

Terminology
-----------

Here are some terms that were essentially invented in the process of creating this library:

- Sound Generator: An object that extends the `SoundGenerator` base class and can be added to the sound manager in
order to make it audible.
- Sound Manager: A singleton instance that hooks sound generators to the output audio path, keeps track of them, and
mutes them if sound is disabled, if the sim becomes invisible, and in several other circumstances
- Sound Clip: A sound generator that is based on a pre-recorded bit of audio.
- 

Background and History
======================

In the days when PhET first started adding more elaborate sound designs (i.e. sound beyond game feedback and occasional
custom sound) to our sims, we started prototype the sound designs by using PhET-iO wrappers.  This worked well for a
while, but ran into some issues as PhET-iO evolved.  In 
https://github.com/phetsims/phet-io-wrapper-sonification/issues/84, it was decided that further sound design prototyping
would be done on master, with the sounds hidden behind a query parameter until they were finalized and ready to be
deployed.

Adding Sound to a PhET Simulation
=================================

Adding Issues to GitHub
-----------------------

At the start, a GitHub issue should be created called "implement the sound design" or something along those lines.  See
https://github.com/phetsims/molecules-and-light/issues/216 for an example.  Under this issue, progress towards
finalizing the sound design should be tracked, including both commits and decisions based on feedback from the design
team.  Once the sound design has been finalized and agreed upon by the design team, all prototyping code that is
specific to the sound design implementation should be removed and this issue closed.  Subsequent issues related to
sound should be tracked in other issues.

In some cases, it may be necessary to create sub-issues to focus on a specific aspect of the sound design.  See
https://github.com/phetsims/molecules-and-light/issues/284 for an example of this.

Turning On Sound
----------------

Generally, the first thing to do is to turn on sound for the simulation (assuming it isn't already on).  This is done
by adding `"supportsSound": true` to the `phet` object in the `package.json` file for the sim.  If the sound design
intends to include enhanced sound, the key-value pair `"supportsEnhancedSound": true` should also be added.  The
`supportsSound` flag will turn on common UI component sound generation, such as default sounds for checkboxes, radio
button groups, push buttons, and so forth.  The `supportsEnhanceSound` flag will cause the "Enhanced Sound" item to be
added to the PhET menu.  This can then be used in conjunction with features of the sound manager to add sounds that are
only produced when the "Enhanced Sound" option is checked (turned on) in the menu.  It is off by default.

The Options dialog can be used to allow sound design evaluators to choose between different sound options while running
the sim. (TODO: add an example to tambo that can be easily leveraged for other sims)

TODO: I (jbphet) should convert this to a checklist.

item: enhanced vs basic sound
item: Final mix
item: Make sure .wav and any supporting files for sound generation are in the assets folder

Overriding Default Sound Generation in Common UI Components
-----------------------------------------------------------

TBD

Adding Sim-Specific Sound Generation
------------------------------------

Rule of thumb: If a sound can be generated purely by watching model components, much the way the view is generated,
then the sound generator should either go in the `xxxScreenView` type or, if there is a lot of sound generation, in
a separate `xxxScreenSoundView` file in the `view` subdirectory.  If, however, the sound generation also needs to know
about how the user is interacting with the controls, the sound generation can go into the view component.  An example of
this is `MassControl.js`.  In this case, the nature of the sound generation depended in part on whether the mass value
was being changed by slider dragging or buttons. 

Integrate: resetInProgressProperty - when is it needed?

Using the "Options" Dialog to Compare Candidate Sounds
------------------------------------------------------

It is often useful to publish dev versions of simulations where the sound designers can choose between a set of sound
options that are being considered for a given action.  To date, this has generally been implemented be adding an
"Options" dialog (or enhancing the one that is already there), setting the value of a global variable, and then
referencing that variable where the sound generation occurs.  For an example of this, please see
`SoundOperationsDialogContent` in tambo, and search for its usages in the code.   


