// Copyright 2020-2022, University of Colorado Boulder

/**
 * Test and demo of the ContinuousPropertySoundGenerator.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import merge from '../../../../../phet-core/js/merge.js';
import NumberControl from '../../../../../scenery-phet/js/NumberControl.js';
import { Text, VBox, VBoxOptions } from '../../../../../scenery/js/imports.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import Panel from '../../../../../sun/js/Panel.js';
import saturatedSineLoop220Hz_mp3 from '../../../../sounds/saturatedSineLoop220Hz_mp3.js';
import stringsLoopMiddleCOscilloscope_mp3 from '../../../../sounds/demo-and-test/stringsLoopMiddleCOscilloscope_mp3.js';
import windsLoopC3Oscilloscope_mp3 from '../../../../sounds/demo-and-test/windsLoopC3Oscilloscope_mp3.js';
import windsLoopMiddleCOscilloscope_mp3 from '../../../../sounds/demo-and-test/windsLoopMiddleCOscilloscope_mp3.js';
import ContinuousPropertySoundGenerator from '../../../sound-generators/ContinuousPropertySoundGenerator.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';
import WrappedAudioBuffer from '../../../WrappedAudioBuffer.js';
import { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import TEmitter from '../../../../../axon/js/TEmitter.js';

type SelfOptions = EmptySelfOptions;
export type ContinuousPropertySoundGeneratorTestNodeOptions = SelfOptions & VBoxOptions;

class ContinuousPropertySoundGeneratorTestNode extends VBox {

  // dispose function
  private readonly disposeContinuousPropertySoundGeneratorTestNode: () => void;

  public constructor( stepEmitter: TEmitter<[ number ]>, providedOptions?: ContinuousPropertySoundGeneratorTestNodeOptions ) {

    // keep track of listeners added to the step emitter so that they can be disposed
    const stepListeners: ( ( dt: number ) => void )[] = [];

    // creates a panel that demonstrates a ContinuousPropertySoundGenerator
    const createTester = ( sound: WrappedAudioBuffer, max: number ) => {
      const numberProperty = new NumberProperty( 5 );
      const range = new Range( 1, 10 );
      const continuousPropertySoundGenerator = new ContinuousPropertySoundGenerator(
        numberProperty,
        sound,
        range
      );
      soundManager.addSoundGenerator( continuousPropertySoundGenerator );
      const isOscillatingProperty = new BooleanProperty( false );
      let phase = 0;
      const stepListener = ( dt: number ) => {
        if ( isOscillatingProperty.value ) {
          numberProperty.value = ( max * Math.sin( Date.now() / 1000 - phase ) + 1 ) * ( range.max - range.min ) / 2 + range.min;
        }
        continuousPropertySoundGenerator.step( dt );
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
    this.disposeContinuousPropertySoundGeneratorTestNode = () => {
      stepListeners.forEach( listener => {
        stepEmitter.removeListener( listener );
      } );
    };
  }

  /**
   * Release references to avoid memory leaks.
   */
  public override dispose(): void {
    this.disposeContinuousPropertySoundGeneratorTestNode();
    super.dispose();
  }
}

tambo.register( 'ContinuousPropertySoundGeneratorTestNode', ContinuousPropertySoundGeneratorTestNode );
export default ContinuousPropertySoundGeneratorTestNode;