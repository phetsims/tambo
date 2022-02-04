// Copyright 2020-2021, University of Colorado Boulder

/**
 * Test and demo of the CompositeSoundClip.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { VBox } from '../../../../../scenery/js/imports.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import brightMarimba_mp3 from '../../../../sounds/brightMarimba_mp3.js';
import loonCall_mp3 from '../../../../sounds/loonCall_mp3.js';
import SoundPlayer from '../../../SoundPlayer.js';
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
      { sound: brightMarimba_mp3 },
      { sound: brightMarimba_mp3, options: { initialPlaybackRate: Math.pow( 2, 4 / 12 ) } },
      { sound: brightMarimba_mp3, options: { initialPlaybackRate: 2 } },
      { sound: loonCall_mp3 }
    ] );

    soundManager.addSoundGenerator( compositeSoundClip );

    // add a button to play a basic-mode sound
    const playSoundClipChordButton = new TextPushButton( 'Play CompositeSoundClip', {
      baseColor: '#aad6cc',
      font: new PhetFont( 16 ),
      soundPlayer: SoundPlayer.NO_SOUND, // turn off default sound generation
      listener: () => { compositeSoundClip.play(); }
    } );

    // add button to play enhanced-mode sound
    const stopSoundClipChordButton = new TextPushButton( 'Stop CompositeSoundClip', {
      baseColor: '#DBB1CD',
      font: new PhetFont( 16 ),
      soundPlayer: SoundPlayer.NO_SOUND, // turn off default sound generation
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