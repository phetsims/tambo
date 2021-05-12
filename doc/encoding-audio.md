Encoding Audio
==============

A fair amount of testing was done to determine the optimum tradeoff between audio file size and quality.  The
current recommendations are:

+ Always keep the full .wav file around in the `assets` direction so that we can re-encode if needed.
+ The .wav file should use a sample rate of 44.1 kHz, since it is the most commonly supported frequency for audio
  contexts, so re-sampling will not be required in most cases.
+ Audio files used in the sim code should be in .mp3 format in almost all cases, encoded at a variable bit rate of
  65-105 kbps unless a higher resolution is needed.  One exception to this is if a loop is needed with continuous sound
  playing.  Due to the short silence that generally exists at the beginning of an .mp3 file, a .wav file is sometimes
  required. 
+ Mono sounds should be used unless there is a specific sound-design need for stereo sounds.
+ Sounds should be encoded such that their peak output is at -1 dBFS.  For amplitude (but not power), this is a
  numerical value of about 0.891.

See https://github.com/phetsims/tambo/issues/28 and https://github.com/phetsims/tambo/issues/5 for more information
about the history of and thought processes behind these recommendations.
 
