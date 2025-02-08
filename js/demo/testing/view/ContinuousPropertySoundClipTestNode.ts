// Copyright 2020-2025, University of Colorado Boulder

/**
 * Test and demo of the ContinuousPropertySoundClip.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import { TReadOnlyEmitter } from '../../../../../axon/js/TEmitter.js';
import Range from '../../../../../dot/js/Range.js';
import merge from '../../../../../phet-core/js/merge.js';
import { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import NumberControl from '../../../../../scenery-phet/js/NumberControl.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import Panel from '../../../../../sun/js/Panel.js';
import stringsLoopMiddleCOscilloscope_mp3 from '../../../../sounds/demo-and-test/stringsLoopMiddleCOscilloscope_mp3.js';
import windsLoopC3Oscilloscope_mp3 from '../../../../sounds/demo-and-test/windsLoopC3Oscilloscope_mp3.js';
import windsLoopMiddleCOscilloscope_mp3 from '../../../../sounds/demo-and-test/windsLoopMiddleCOscilloscope_mp3.js';
import saturatedSineLoop220Hz_mp3 from '../../../../sounds/saturatedSineLoop220Hz_mp3.js';
import ContinuousPropertySoundClip from '../../../sound-generators/ContinuousPropertySoundClip.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';
import WrappedAudioBuffer from '../../../WrappedAudioBuffer.js';

type SelfOptions = EmptySelfOptions;
export type ContinuousPropertySoundClipTestNodeOptions = SelfOptions & VBoxOptions;

class ContinuousPropertySoundClipTestNode extends VBox {

  // dispose function
  private readonly disposeContinuousPropertySoundClipTestNode: () => void;

  public constructor( stepEmitter: TReadOnlyEmitter<[ number ]>, providedOptions?: ContinuousPropertySoundClipTestNodeOptions ) {

    // keep track of listeners added to the step emitter so that they can be disposed
    const stepListeners: ( ( dt: number ) => void )[] = [];

    // creates a panel that demonstrates a ContinuousPropertySoundClip
    const createTester = ( sound: WrappedAudioBuffer, max: number ) => {
      const numberProperty = new NumberProperty( 5 );
      const range = new Range( 1, 10 );
      const continuousPropertySoundClip = new ContinuousPropertySoundClip( numberProperty, range, sound );
      soundManager.addSoundGenerator( continuousPropertySoundClip );
      const isOscillatingProperty = new BooleanProperty( false );
      let phase = 0;
      const stepListener = () => {
        if ( isOscillatingProperty.value ) {
          numberProperty.value = ( max * Math.sin( Date.now() / 1000 - phase ) + 1 ) * ( range.max - range.min ) / 2 + range.min;
        }
      };
      stepEmitter.addListener( stepListener );
      stepListeners.push( stepListener );
      isOscillatingProperty.link( () => {
        phase = Date.now() / 1000;
      } );

      return new Panel( new VBox( {
        children: [
          new Checkbox( isOscillatingProperty, new Text( 'Oscillate' ) ),
          new NumberControl( 'Value', numberProperty, range, {
            delta: 0.1,
            numberDisplayOptions: { decimalPlaces: 1 }
          } )
        ]
      } ) );
    };

    super( merge( {
      children: [
        createTester( stringsLoopMiddleCOscilloscope_mp3, 1 ),
        createTester( windsLoopMiddleCOscilloscope_mp3, 0.5 ),
        createTester( windsLoopC3Oscilloscope_mp3, 0.25 ),
        createTester( saturatedSineLoop220Hz_mp3, 1 )
      ],
      spacing: 15,
      align: 'left'
    }, providedOptions ) );

    // define dispose function for memory cleanup
    this.disposeContinuousPropertySoundClipTestNode = () => {
      stepListeners.forEach( listener => {
        stepEmitter.removeListener( listener );
      } );
    };
  }

  /**
   * Release references to avoid memory leaks.
   */
  public override dispose(): void {
    this.disposeContinuousPropertySoundClipTestNode();
    super.dispose();
  }
}

tambo.register( 'ContinuousPropertySoundClipTestNode', ContinuousPropertySoundClipTestNode );
export default ContinuousPropertySoundClipTestNode;