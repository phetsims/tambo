// Copyright 2018-2019, University of Colorado Boulder

/**
 * a singleton object with functions for analyzing and manipulated sound data
 */
define( function( require ) {
  'use strict';

  // modules
  const tambo = require( 'TAMBO/tambo' );
  const TamboQueryParameters = require( 'TAMBO/TamboQueryParameters' );

  // This threshold is used for analyzing individual decoded sound samples in order to find where a loop that is
  // intended to continuously generate sound should start and end.  Its value was determined through experimentation on
  // a single loop (charges-in-body) at a number of different encodings.  It may need to be refined over time as we add
  // new loops.  Or it may work perfectly forever (one can only hope).  See https://github.com/phetsims/tambo/issues/35.
  const AUDIO_DATA_THRESHOLD = 0.05;

  /**
   * sound utility object definition
   */
  const SoundUtil = {

    /**
     * helper function that sets the start and end points for looping based on where the sound data starts and ends
     * {AudioBuffer} soundClip
     * @returns {Object} - an object with values for loopStart and loopEnd
     */
    detectLoopBounds: function( audioBuffer ) {
      logLoopAnalysisInfo( '------------- entered detectLoopBounds --------------------' );

      const soundDataLength = audioBuffer.length;
      const loopStartIndexes = [];
      const loopEndIndexes = [];

      // analyze each channel of the sound data
      for ( let channelNumber = 0; channelNumber < audioBuffer.numberOfChannels; channelNumber++ ) {

        // initialize some variables that will be used to analyze the data
        const soundData = audioBuffer.getChannelData( channelNumber );

        // find a good point for the loop to start
        loopStartIndexes[ channelNumber ] = findSoundStartIndex(
          soundData,
          soundDataLength,
          AUDIO_DATA_THRESHOLD
        );

        // find a good point for the loop to end
        loopEndIndexes[ channelNumber ] = findSoundEndIndex( soundData, soundDataLength, AUDIO_DATA_THRESHOLD );
      }

      // return an object with values for where the loop should start and end
      const sampleRate = audioBuffer.sampleRate;
      return {
        loopStart: _.min( loopStartIndexes ) / sampleRate,
        loopEnd: _.max( loopEndIndexes ) / sampleRate
      };
    }
  };

  /**
   * find the index in the provided buffer where the sound begins, i.e. the end of any leading silence
   * @param {Float32Array} soundData - sound data to be analyzed
   * @param {number} length - length of the sound data
   * @param {number} threshold - detection level for initial sound, should be between 0 and 1
   * @returns {number} - index where sound can be considered to start
   */
  function findSoundStartIndex( soundData, length, threshold ) {

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
    logLoopAnalysisInfo( 'startThresholdIndex = ' + startThresholdIndex );

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
    logLoopAnalysisInfo( 'soundStartIndex = ' + soundStartIndex );

    // detect and log the peaks in the pre-start data, useful for determining what the threshold value should be
    let maxPreStartPeak = 0;
    let minPreStartPeak = 0;
    for ( dataIndex = 0; dataIndex < soundStartIndex; dataIndex++ ) {
      maxPreStartPeak = Math.max( maxPreStartPeak, soundData[ dataIndex ] );
      minPreStartPeak = Math.min( minPreStartPeak, soundData[ dataIndex ] );
    }
    logLoopAnalysisInfo( 'maxPreStartPeak = ' + maxPreStartPeak );
    logLoopAnalysisInfo( 'minPreStartPeak = ' + minPreStartPeak );

    return soundStartIndex;
  }

  /**
   * Find the index in the provided sound data where the sound can be considered to end, i.e. only data below the
   * threshold afterwards.
   * @param {Float32Array} soundData
   * @param {number} length - length of the sound data
   * @param {number} threshold - detection level for the presence of sound, should be between 0 and 1
   * @returns {number} - index where sound ends
   */
  function findSoundEndIndex( soundData, length, threshold ) {

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

    logLoopAnalysisInfo( 'endThresholdIndex = ' + endThresholdIndex );

    // work forward from the end threshold to find a zero or zero crossing that can work as the end of the loop
    let soundEndIndex = endThresholdIndex;
    found = false;
    for ( dataIndex = endThresholdIndex; dataIndex < length - 1 && !found; dataIndex++ ) {
      if ( soundData[ dataIndex + 1 ] >= 0 ) {
        soundEndIndex = dataIndex;
        found = true;
      }
    }
    logLoopAnalysisInfo( 'soundEndIndex = ' + soundEndIndex );

    // detect and log the peaks in the post-end data, useful for determining what the threshold value should be
    let maxPostEndPeak = 0;
    let minPostEndPeak = 0;
    for ( dataIndex = soundEndIndex; dataIndex < length; dataIndex++ ) {
      maxPostEndPeak = Math.max( maxPostEndPeak, soundData[ dataIndex ] );
      minPostEndPeak = Math.min( minPostEndPeak, soundData[ dataIndex ] );
    }
    logLoopAnalysisInfo( 'maxPostEndPeak = ' + maxPostEndPeak );
    logLoopAnalysisInfo( 'minPostEndPeak = ' + minPostEndPeak );

    return soundEndIndex;
  }

  /**
   * helper function for logging sound analysis information if said logging is enabled, useful for debugging
   * @param {String} string
   */
  function logLoopAnalysisInfo( string ) {
    if ( TamboQueryParameters.logLoopAnalysisInfo ) {
      console.log( string );
    }
  }

  tambo.register( 'SoundUtil', SoundUtil );

  return SoundUtil;
} );