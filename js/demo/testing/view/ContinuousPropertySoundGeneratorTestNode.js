// Copyright 2020, University of Colorado Boulder

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
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import Panel from '../../../../../sun/js/Panel.js';
import sineSound from '../../../../sounds/220hz-saturated-sine-loop_mp3.js';
import stringSound1 from '../../../../sounds/strings-loop-middle-c-oscilloscope_mp3.js';
import windSound2 from '../../../../sounds/winds-loop-c3-oscilloscope_mp3.js';
import windSound1 from '../../../../sounds/winds-loop-middle-c-oscilloscope_mp3.js';
import ContinuousPropertySoundGenerator from '../../../sound-generators/ContinuousPropertySoundGenerator.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';

class ContinuousPropertySoundGeneratorTestNode extends VBox {

  /**
   * @param {Emitter} stepEmitter
   * @param {Object} [options]
   */
  constructor( stepEmitter, options ) {

    // keep track of listeners added to the step emitter so that they can be disposed
    const stepListeners = [];

    // creates a panel that demonstrates a ContinuousPropertySoundGenerator
    const createTester = ( sound, max ) => {
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
      const stepListener = dt => {
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
          new Checkbox( new Text( 'Oscillate' ), isOscillatingProperty ),
          new NumberControl( 'Value', numberProperty, range, {
            delta: 0.1,
            numberDisplayOptions: { decimalPlaces: 1 }
          } )
        ]
      } ) );
    };

    super( merge( {
      children: [
        createTester( stringSound1, 1 ),
        createTester( windSound1, 0.5 ),
        createTester( windSound2, 0.25 ),
        createTester( sineSound, 1 )
      ],
      spacing: 15,
      align: 'left'
    }, options ) );

    // @private - for memory cleanup
    this.disposeContinuousPropertySoundGeneratorTestNode = () => {
      stepListeners.forEach( listener => {
        stepEmitter.removeListener( listener );
      } );
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeContinuousPropertySoundGeneratorTestNode();
    super.dispose();
  }
}

tambo.register( 'ContinuousPropertySoundGeneratorTestNode', ContinuousPropertySoundGeneratorTestNode );
export default ContinuousPropertySoundGeneratorTestNode;