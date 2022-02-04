// Copyright 2020-2021, University of Colorado Boulder

import saturatedSineLoop220Hz_mp3 from '../../../../sounds/saturatedSineLoop220Hz_mp3.js';
import windsLoopC3Oscilloscope_mp3 from '../../../../sounds/windsLoopC3Oscilloscope_mp3.js';
import windsLoopMiddleCOscilloscope_mp3 from '../../../../sounds/windsLoopMiddleCOscilloscope_mp3.js';
import AmplitudeModulator from '../../../AmplitudeModulator.js';
import SoundClip from '../../../sound-generators/SoundClip.js';
import SoundGenerator from '../../../sound-generators/SoundGenerator.js';
import tambo from '../../../tambo.js';

/**
 * Demo and test harness for the AmplitudeModulator class.  This creates several sound loops and routes them through
 * an amplitude modulator instance.  It also provides the properties that can be manipulated in the view to change the
 * attributes of the modulation.
 */
class AmplitudeModulatorDemo extends SoundGenerator {

  /**
   * @param {NumberProperty} sourceSoundIndexProperty - index of the selected sound, 0 indicates none
   * @param {Object} [options]
   */
  constructor( sourceSoundIndexProperty, options ) {

    super( options );

    // @public {AmplitudeModulator}
    this.amplitudeModulator = new AmplitudeModulator();
    this.amplitudeModulator.connect( this.soundSourceDestination );

    // sound sources that will be modulated
    const soundLoops = [
      new SoundClip( saturatedSineLoop220Hz_mp3, { loop: true } ),
      new SoundClip( windsLoopC3Oscilloscope_mp3, { loop: true } ),
      new SoundClip( windsLoopMiddleCOscilloscope_mp3, { loop: true } )
    ];

    // hook each of the loops to the amplitude modulator
    soundLoops.forEach( soundLoop => { soundLoop.connect( this.amplitudeModulator.getConnectionPoint() ); } );

    // Play and stop the loops based on the selection property's value.  An sound source index of 0 indicates that no
    // sound should be played, values above zero are decremented by one and then used as an index into the array of
    // sound loops.
    sourceSoundIndexProperty.link( soundSourceIndex => {
      soundLoops.forEach( ( soundLoop, index ) => {
        if ( index === soundSourceIndex - 1 ) {
          soundLoop.play();
        }
        else {
          soundLoop.stop();
        }
      } );
    } );
  }

  /**
   * restore initial state
   * @public
   */
  reset() {
    this.amplitudeModulator.enabledProperty.reset();
    this.amplitudeModulator.frequencyProperty.reset();
    this.amplitudeModulator.depthProperty.reset();
    this.amplitudeModulator.waveformProperty.reset();
  }
}

tambo.register( 'AmplitudeModulatorDemo', AmplitudeModulatorDemo );
export default AmplitudeModulatorDemo;