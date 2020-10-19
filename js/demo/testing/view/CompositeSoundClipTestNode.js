// Copyright 2020, University of Colorado Boulder

/**
 * Test and demo of the CompositeSoundClip.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import brightMarimbaSound from '../../../../sounds/bright-marimba_mp3.js';
import loonCallSound from '../../../../sounds/loon-call_mp3.js';
import Playable from '../../../Playable.js';
import CompositeSoundClip from '../../../sound-generators/CompositeSoundClip.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';

class CompositeSoundClipTestNode extends VBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // sound clips to be played
    const compositeSoundClip = new CompositeSoundClip( [
      { sound: brightMarimbaSound },
      { sound: brightMarimbaSound, options: { initialPlaybackRate: Math.pow( 2, 4 / 12 ) } },
      { sound: brightMarimbaSound, options: { initialPlaybackRate: 2 } },
      { sound: loonCallSound }
    ] );

    soundManager.addSoundGenerator( compositeSoundClip );

    // add a button to play a basic-mode sound
    const playSoundClipChordButton = new TextPushButton( 'Play CompositeSoundClip', {
      baseColor: '#aad6cc',
      font: new PhetFont( 16 ),
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
      listener: () => { compositeSoundClip.play(); }
    } );

    // add button to play enhanced-mode sound
    const stopSoundClipChordButton = new TextPushButton( 'Stop CompositeSoundClip', {
      baseColor: '#DBB1CD',
      font: new PhetFont( 16 ),
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
      listener: () => { compositeSoundClip.stop(); }
    } );

    super( merge( {
      children: [ playSoundClipChordButton, stopSoundClipChordButton ],
      spacing: 20
    }, options ) );

    // @private - dispose function
    this.disposeCompositeSoundClipTestNode = () => {
      soundManager.removeSoundGenerator( compositeSoundClip );
      compositeSoundClip.dispose();
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeCompositeSoundClipTestNode();
    super.dispose();
  }
}

tambo.register( 'CompositeSoundClipTestNode', CompositeSoundClipTestNode );
export default CompositeSoundClipTestNode;