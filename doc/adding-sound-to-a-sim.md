Eventually this document will offer guidelines on how to add sound to a simulation.  As of this writing, it's a place
to capture initial thoughts that will be organized once the process is more worked out.

In the days when PhET first started adding more elaborate sound designs (i.e. sound beyond game feedback and occasional
custom sound) to our sims, we started prototype the sound designs by using PhET-iO wrappers.  This worked well for a
while, but ran into some issues as PhET-iO evolved.  In 
https://github.com/phetsims/phet-io-wrapper-sonification/issues/84, it was decided that further sound design prototyping
would be done on master, with the sounds hidden behind a query parameter until they were finalized and ready to be
deployed.

Steps
=====

At the start, a GitHub issue should be created called "prototype the sound design".

The Option dialog can be used to allow sound design evaluators to choose between different sound options while running
the sim.

Implementation Approach
=======================

Rule of thumb: If a sound can be generated purely by watching model components, much the way the view is generated,
then the sound generator should either go in the `xxxScreenView` type or, if there is a lot of sound generation, in
a separate `xxxScreenSoundView` file in the `view` subdirectory.  If, however, the sound generation also needs to know about how
the user is interacting with the controls, the sound generation can go into the view component.  An example of this is
`MassControl.js`.  In this case, the nature of the sound generation depended in part on whether the mass value was
being changed by slider dragging. 

Integrate: resetInProgressProperty - when is it needed?