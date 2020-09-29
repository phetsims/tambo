Encoding Audio
==============

A fair amount of testing was done to determine the optimum tradeoff between audio file size and quality.  The
current recommendations are:

+ Always keep the full .wav file around in the `assets` direction so that we can re-encode if needed.
+ Audio files used in the sim code should be in .mp3 format in almost all cases, encoded at 48 kbps unless a higher
resolution is needed.  The one exception to this is if a loop is needed with continuous sound playing.  Due to the short
silence that generally exists at the beginning of an .mp3 file, a .wav file is sometimes required. 
+ Mono sounds should be used unless there is a specific sound-design need for stereo sounds.

See https://github.com/phetsims/tambo/issues/28 for more information about the history of and thought process behind
these recommendations.
 
