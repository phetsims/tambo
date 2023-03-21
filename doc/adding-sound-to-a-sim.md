# Checklist for Adding Sound to a PhET Simulation

This checklist is intended to guide developers through the process of adding sound to a simulation.  It is written at
a fairly high level, and assumes certain knowledge of how the tambo library works and of PhET's development processes.
Before using this for the first time, it is highly recommended that a developer reads through the Users Guide.

- [ ] Create a sound design document and work with the sound designer(s) to get to the point where enough has been
worked out that it becomes desirable to start prototyping.  For an example, please see the [Molecules and Light Sound
Design](https://docs.google.com/document/d/1LJ6maD9QGvRRIaukKi_s019Gc1V2YHi4CPbPNULLiRc/edit?usp=sharing) document.
- [ ] Create an issue for adding sound to the simulation, use the title "Implement sound design". Here
  is [an example GitHub issue](https://github.com/phetsims/faradays-law/issues/161).
- [ ] Figure out if it's okay to turn sound on for the simulation.  This will hinge upon whether there will need to be
releases made off of master before the sound implementation is complete.  Generally you'll want to turn sound on, but in
cases where that isn't possible, skip the two sub-steps below, and the query parameters `supportsSound` and
`supportsExtraSound` can be used to turn sound on for testing during development. 
  - [ ] Turn on sound by adding the `supportsSound: true` key-value pair to the `phet` sub-object in the package.json 
file for this simulation. See https://github.com/phetsims/friction/blob/master/package.json.  This portion will look
something like this:
    ```
    {
       ...
       "phet": {
          "simFeatures": {
             "supportsSound": true,
             ...
          }
       },
       ...
    }
    ```
  - [ ] If the sound design includes extra sound, turn this on by adding the `supportsExtraSound: true` key-value
pair to the `phet` sub-object in the package.json file for this simulation. The main effect that this is has is to add
the 'Extra Sound' item to the PhET menu. See https://github.com/phetsims/friction/blob/master/package.json.
  - [ ] Run `grunt update` to get the updated configuration into the HTML file.
- [ ] Explicitly turn *off* sound for any common UI components that now produce sounds that are not needed, if there are
any.  This is done by looking at the options and setting any sound players to `SoundPlayer.NO_SOUND`.  Search through the
code base for example usages.
- [ ] Add any behavior for any common-UI sound generation that is different from the default behavior.  This is done
by creating a `SoundPlayer` (often a `SoundClip` instance) and passing it in as an option for the sound player.
- [ ] Decide whether to have a separate "sound view" or to use the existing `ScreenView` files.  Both approaches have
been used, and both are legit, and it probably depends on how much sound generation is needed and whether adding it all
to the `ScreenView` file(s) is likely to make the file too large and/or difficult to maintain.  As of this writing,
`WavesScreenSoundView` is an example of a separate class where the sounds are hooked to the model, and 
`FrictionScreenView` is an example of where sound was interwoven with the visual view code.  Note that in some cases it
is necessary to know what the user was doing that triggered the need for sound generation, and in these cases the sound
generation will need to be inside the view element so that the code has access to all the needed information.  An
example where this often comes up is if different behavior is needed when a value was changed via keyboard interaction
versus mouse or touch interaction.
- [ ] Decide whether a "Sound Options" content is needed to allow designers to compare different sound design ideas in
context.  This has been found to be very useful when iterating on a sound design.  There is more information on this in
the User Guide, and [an example in the Tambo demo]
(https://github.com/phetsims/tambo/blob/master/js/demo/AudioCustomPreferencesContent.js).
- [ ] Add sim-specific sound generation.  See previously sonified simulations for examples on how to do this, but the
general idea is to create sound generators and hook them up to the model and/or view elements that they are meant to
sonify, all based on the sound design document.  One of the most common ways to add sound is to use pre-recorded bits
of sound.  The type in tambo that supports this is called `SoundClip`, please search for usages of this type in the
tambo demo and/or other sims to see examples of how it is generally used.
- [ ] Iterate on the sound design.  Regular meetings and good note taking (generally in GitHub issues) have been found
 to be quite helpful for this.  This is basically like the implementation process for all other portions of the sim, and
 involves publishing dev versions, getting feedback, refining the sim, rinse, and repeat.  One observation: It seems to
 be more difficult for people to imagine how they will like a sound in context than a visual design element, so be
 prepared for a lot of iteration, and use the 'Options' dialog if and when it can help.
- [ ] Once all of the sounds have been finalized, do a "mix" step where the primary sound designer goes through the
 sim and sets the volume level for all sim-specific sounds.  Create a separate sub-issue for this.
- [ ] Once the sound design is thought to be complete, or nearly complete, publish a dev version and create a checklist
 of all of the sound designers and other stakeholders in the original sound design GitHub issue and ask them to either
 approve of the implementation or log their objections. Example: 
 https://github.com/phetsims/molecules-and-light/issues/233#issuecomment-610655745
- [ ] Finalize the names of all sound files that have been added and get uncompressed versions of them and add them to
 the `assets` directory.  Make sure the names match, e.g. `bonk.mp3` in the `sounds` directory and `bonk.wav` in the
 `assets` directory. Also make sure these names match the names in the sound design document.
- [ ] If a Preferences dialog was added or if content was added to an existing Preferences dialog to support comparitive
 evaluation of sounds, remove said content
- [ ] If there were individuals who were *only* involved in the sound design and thus not already on the `team` or
 other lists in the credits, add them using the `soundDesign` key.
- [ ] Once the sound design is approved, mark the issue as `ready-for-testing` and have it tested with the other
 aspects of the simulation through the publication process.
