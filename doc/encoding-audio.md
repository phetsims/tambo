Encoding Audio
==============

A fair amount of testing was done to determine the optimum tradeoff between audio file size and quality.  The
recommendations at the time of this writing are:

+ Always keep the full .wav file around so that we can re-encode if needed
+ Audio files used in the sims should be in .mp3 format, encoded at 48 kbps unless a higher resolution is needed
+ Audio file should be mono, not stereo
 