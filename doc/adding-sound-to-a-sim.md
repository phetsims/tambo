This checklist is intended to guide developers through the process of adding sound to a simulation.  It is written at
a fairly high level, and assumes certain knowledge of how the tambo library works and of PhET's development processes.
Before using this for the first time, it is highly recommended that a developer reads through the Users Guide.

- [ ] Create a sound design document and work with the sound designer(s) to get to the point where enough has been
worked out that it becomes desirable to start prototyping.  TODO: Add example.
- [ ] Create an issue for adding sound to the simulation.  TODO: Add example.
- [ ] Turn on sound by adding the `soundSupported: true` key-value pair to the `phet` sub-object in the package.json file
for this simulation. TODO: add example.
- [ ] If the sound design includes enhanced sound, turn this on by adding the `enhancedSoundSupported: true` key-value
pair to the `phet` sub-object in the package.json file for this simulation. The main effect that this is has is to add
the 'Enhanced Sound' item to the PhET menu. TODO: add example.
- [ ] Explicitly turn *off* sound for any common UI components that now produce sound but that are unwanted.
- [ ] Add any behavior for common-UI sound generation that is different from the default behavior.  TODO: example or
reference
- [ ] Decide whether or not to have a separate "sound view" or to use the existing `ScreenView` files.  Both approaches
have been used, and both are legit, and it probably depends on how much sound generation is needed and whether adding it
all to the `ScreenView` file(s) is likely to make the file too large and/or difficult to maintain.
- [ ] Decide whether a "Sound Options" dialog is needed to allow designers to compare different sound design ideas in
context.  This has been found to be very useful when iterating on a sound design.  There is more information on this in
the User Guide, and an example in the Tambo demo.
- [ ] Add sim-specific sound generation.  Use previously sonified simulations for examples on how to do this, but the
general idea is to create sound generators and hook them up the the model and/or view elements that they are meant to
sonify.
 - [ ] Iterate on the sound design.  Regular meetings have been found to be quite helpful for this.  This is basically
 like the implementation process for all other portions of the sim, and involves publishing dev versions, getting
 feedback, refining the sim, rinse, and repeat.
 - [ ] Once all of the sounds have been finalized, do a "mix" step where the primary sound designer goes through the
 sim and sets the volume level for all sim-specific sounds.
 - [ ] Once the sound design is thought to be complete, or nearly complete, publish a dev version and create a checklist
 of all of the sound designers and other stakeholders in the original sound design GitHub issue and ask them to either
 approve of the implementation or log their objections. 
 - [ ] Finalize the names of all sound files that have been added and get uncompressed versions of them and add them to
 the `assets` directory.  Make sure the names match, e.g. `bonk.mp3` in the `sounds` directory and `bonk.wav` in the
 `assets` directory. 
 - [ ] Once the sound design is approved, mark the issue as `ready-for-testing` and have it tested with the other
 aspects of the simulation through the publication process.