// Copyright 2018-2022, University of Colorado Boulder

/**
 * a singleton object with functions for analyzing and manipulating sound data
 */

import tambo from './tambo.js';

// a type that contains information about where the audible sounds begin and end within an audio buffer
type SoundBounds = {
  soundStart: number;
  soundEnd: number | null;
};

// This threshold is used for analyzing individual decoded sound samples in order to find where the actual sound
// values start and end.  Its value was determined through experimentation on a single loop (charges-in-body) at a
// number of different encodings.  It may need to be refined over time as we add new sounds.  Or it may work perfectly
// forever (one can only hope).  See https://github.com/phetsims/tambo/issues/35.
const AUDIO_DATA_THRESHOLD = 0.05;

/**
 * sound utility object definition
 */
const SoundUtils = {

  /**
   * Detect the start and end points of a sound within and AudioBuffer based on the points where the samples exceed a
   * predetermined threshold.
   */
  detectSoundBounds: ( audioBuffer: AudioBuffer ): SoundBounds => {

    const soundDataLength = audioBuffer.length;
    const soundStartIndexes = [];
    const soundEndIndexes = [];

    // analyze each channel of the sound data
    for ( let channelNumber = 0; channelNumber < audioBuffer.numberOfChannels; channelNumber++ ) {

      // initialize some variables that will be used to analyze the data
      const soundData = audioBuffer.getChannelData( channelNumber );

      // find where the sound first exceeds the threshold
      soundStartIndexes[ channelNumber ] = findSoundStartIndex(
        soundData,
        soundDataLength,
        AUDIO_DATA_THRESHOLD
      );

      // find the last point at which the sound exceeds the threshold, then go a little past
      soundEndIndexes[ channelNumber ] = findSoundEndIndex( soundData, soundDataLength, AUDIO_DATA_THRESHOLD );
    }

    // return an object with values for where the loop should start and end
    const sampleRate = audioBuffer.sampleRate;
    return {
      soundStart: _.min( soundStartIndexes )! / sampleRate,
      soundEnd: _.max( soundEndIndexes )! / sampleRate
    };
  }
};

/**
 * Find the index in the provided audio buffer where the sound begins, i.e. find the end of any leading silence.
 * @param soundData - sound data to be analyzed
 * @param length - length of the sound data
 * @param threshold - detection level for initial sound, should be between 0 and 1
 * @returns index where sound can be considered to start
 */
const findSoundStartIndex = ( soundData: Float32Array, length: number, threshold: number ): number => {

  // find the first occurrence of the threshold that is trending in the up direction
  let startThresholdIndex = 0;
  let dataIndex;
  let found = false;
  for ( dataIndex = 0; dataIndex < length - 1 && !found; dataIndex++ ) {
    if ( soundData[ dataIndex ] > threshold && soundData[ dataIndex + 1 ] > soundData[ dataIndex ] ) {
      startThresholdIndex = dataIndex;
      found = true;
    }
  }

  // work backwards from the first threshold found to find the first zero or zero crossing
  let soundStartIndex = 0;
  found = false;
  for ( dataIndex = startThresholdIndex; dataIndex > 0 && !found; dataIndex-- ) {
    const value = soundData[ dataIndex ];
    if ( value <= 0 ) {
      soundStartIndex = value === 0 ? dataIndex : dataIndex + 1;
      found = true;
    }
  }

  // detect and log the peaks in the pre-start data, useful for determining what the threshold value should be
  let maxPreStartPeak = 0;
  let minPreStartPeak = 0;
  for ( dataIndex = 0; dataIndex < soundStartIndex; dataIndex++ ) {
    maxPreStartPeak = Math.max( maxPreStartPeak, soundData[ dataIndex ] );
    minPreStartPeak = Math.min( minPreStartPeak, soundData[ dataIndex ] );
  }

  return soundStartIndex;
};

/**
 * Find the index in the provided sound data where the sound can be considered to end, meaning that there is only
 * silence or very little sound energy thereafter.
 * @param soundData - the sample values for the sound
 * @param length - length of the sound data
 * @param threshold - detection level for the presence of sound, should be between 0 and 1
 */
const findSoundEndIndex = ( soundData: Float32Array, length: number, threshold: number ): number => {

  // work backwards from the end of the data to find the first negative occurance of the threshold
  let endThresholdIndex = length - 1;
  let found = false;
  let dataIndex;
  for ( dataIndex = length - 1; dataIndex > 0 && !found; dataIndex-- ) {
    if ( soundData[ dataIndex ] <= -threshold && soundData[ dataIndex - 1 ] < soundData[ dataIndex ] ) {
      endThresholdIndex = dataIndex;
      found = true;
    }
  }

  // work forward from the end threshold to find a zero or zero crossing that can work as the end of the loop
  let soundEndIndex = endThresholdIndex;
  found = false;
  for ( dataIndex = endThresholdIndex; dataIndex < length - 1 && !found; dataIndex++ ) {
    if ( soundData[ dataIndex + 1 ] >= 0 ) {
      soundEndIndex = dataIndex;
      found = true;
    }
  }

  // detect and log the peaks in the post-end data, useful for determining what the threshold value should be
  let maxPostEndPeak = 0;
  let minPostEndPeak = 0;
  for ( dataIndex = soundEndIndex; dataIndex < length; dataIndex++ ) {
    maxPostEndPeak = Math.max( maxPostEndPeak, soundData[ dataIndex ] );
    minPostEndPeak = Math.min( minPostEndPeak, soundData[ dataIndex ] );
  }

  return soundEndIndex;
};

tambo.register( 'SoundUtils', SoundUtils );

export default SoundUtils;