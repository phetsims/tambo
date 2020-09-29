// Copyright 2020, University of Colorado Boulder

/**
 * Test and demo of the MultiSoundClip.
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
import MultiSoundClip from '../../../sound-generators/MultiSoundClip.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';

class MultiSoundClipTestNode extends VBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // sound clips to be played
    const multiSoundClip = new MultiSoundClip( [
      { sound: brightMarimbaSound },
      { sound: brightMarimbaSound, options: { initialPlaybackRate: Math.pow( 2, 4 / 12 ) } },
      { sound: brightMarimbaSound, options: { initialPlaybackRate: 2 } },
      { sound: loonCallSound }
    ] );

    soundManager.addSoundGenerator( multiSoundClip );

    // add a button to play a basic-mode sound
    const playSoundClipChordButton = new TextPushButton( 'Play MultiSoundClip', {
      baseColor: '#aad6cc',
      font: new PhetFont( 16 ),
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
      listener: () => { multiSoundClip.play(); }
    } );

    // add button to play enhanced-mode sound
    const stopSoundClipChordButton = new TextPushButton( 'Stop MultiSoundClip', {
      baseColor: '#DBB1CD',
      font: new PhetFont( 16 ),
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
      listener: () => { multiSoundClip.stop(); }
    } );

    super( merge( {
      children: [ playSoundClipChordButton, stopSoundClipChordButton ],
      spacing: 20
    }, options ) );

    // @private - dispose function
    this.disposeMultiSoundClipTestNode = () => {
      soundManager.removeSoundGenerator( multiSoundClip );
      multiSoundClip.dispose();
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeMultiSoundClipTestNode();
    super.dispose();
  }
}

tambo.register( 'MultiSoundClipTestNode', MultiSoundClipTestNode );
export default MultiSoundClipTestNode;