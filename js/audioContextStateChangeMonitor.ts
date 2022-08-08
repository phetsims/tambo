// Copyright 2019-2022, University of Colorado Boulder

/**
 * A singleton instance that allows clients to register listeners that get fired on state changes for an audio context.
 * This exists because an audio context has a single "onstatechange" property, and we had the need to register multiple
 * listeners.
 */

import tambo from './tambo.js';

// type definition for audio context state change listeners
type AudioContextStateChangeListener = ( ( state: AudioContextState ) => void );

// A list of the audio contexts being monitored. In the code below, contexts should only be added, never deleted, and
// this array should never be reordered.
const monitoredAudioContexts: AudioContext[] = [];

// a two-dimensional list of listeners, indexed by the position of the corresponding audio context in the array above
const stateChangeListenerArrays: AudioContextStateChangeListener[][] = [];

// the definition of the singleton instance
const audioContextStateChangeMonitor = {

  /**
   * add a listener that will be fired on state changes for the provided audio context
   */
  addStateChangeListener( audioContext: AudioContext, listener: AudioContextStateChangeListener ): void {

    // Find the audio context in the list of those being monitored, or add it if not found.
    let audioContextIndex = monitoredAudioContexts.indexOf( audioContext );
    let listenerArray: AudioContextStateChangeListener[];
    if ( audioContextIndex === -1 ) {
      monitoredAudioContexts.push( audioContext );
      audioContextIndex = monitoredAudioContexts.length - 1;
      listenerArray = []; // create a new listener array
      stateChangeListenerArrays.push( listenerArray );

      // make sure there isn't something already listening to this context's state change
      assert && assert( !audioContext.onstatechange, 'a listener function is already registered for this context' );

      // hook up a function that will fire all listeners on a state change
      audioContext.onstatechange = () => {
        _.clone( listenerArray ).forEach( listener => {
          listener( audioContext.state );
        } );
      };
    }
    else {
      listenerArray = stateChangeListenerArrays[ audioContextIndex ];
    }

    listenerArray.push( listener );
  },

  /**
   * remove the state change listener for the specified audio context
   */
  removeStateChangeListener( audioContext: AudioContext, listener: AudioContextStateChangeListener ): void {

    // remove the listener for the listener array, checking for various problems along the way
    const audioContextIndex = monitoredAudioContexts.indexOf( audioContext );
    assert && assert( audioContextIndex >= 0, 'audio context not found' );
    const listenerArray = stateChangeListenerArrays[ audioContextIndex ];
    const listenerIndex = listenerArray.indexOf( listener );
    assert && assert( listenerIndex >= 0, 'listener not found for specified audio context' );
    listenerArray.splice( listenerIndex, 1 );
  },

  /**
   * test if the provided listener is present for the specified audio context
   */
  hasListener( audioContext: AudioContext, listener: AudioContextStateChangeListener ): boolean {
    let found = false;
    const audioContextIndex = monitoredAudioContexts.indexOf( audioContext );
    if ( audioContextIndex >= 0 ) {
      const listenerArray = stateChangeListenerArrays[ audioContextIndex ];
      if ( listenerArray ) {
        found = listenerArray.includes( listener );
      }
    }
    return found;
  }
};

tambo.register( 'audioContextStateChangeMonitor', audioContextStateChangeMonitor );

export default audioContextStateChangeMonitor;