# Notes for adding Sound to a common code component

* Please follow the guide for [encoding audio](./encoding-audio.md) for any committed audio resources.
* Any new sound needs to be mixed, and for common code it is best to do this in multiple sims to make sure we have good
  coverage. In general, mixing is done by @Ashton-Morris or @jbphet, and is done by qualitatively comparing to other in
  the sim, using the reset all button as a central reference. Assign the issue for them to review.
* In general, mixing and leveling cannot be done fully to just the committed resources. Perceived volume level varies a
  lot based on the frequency content, the speakers being used, and the duration of a sound. This is why your new sound
  most likely needs an `initialOutputLevel` option tweaked during mixing.
