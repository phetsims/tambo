// Copyright 2020-2022, University of Colorado Boulder

/**
 * Test and demo of the CompositeSoundClip.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { VBox, VBoxOptions } from '../../../../../scenery/js/imports.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import brightMarimba_mp3 from '../../../../sounds/brightMarimba_mp3.js';
import loonCall_mp3 from '../../../../sounds/demo-and-test/loonCall_mp3.js';
import CompositeSoundClip from '../../../sound-generators/CompositeSoundClip.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';
import nullSoundPlayer from '../../../shared-sound-players/nullSoundPlayer.js';

class CompositeSoundClipTestNode extends VBox {

  // dispose function
  private readonly disposeCompositeSoundClipTestNode: () => void;

  public constructor( options: VBoxOptions ) {

    // sound clips to be played
    const compositeSoundClip = new CompositeSoundClip( [
      { sound: brightMarimba_mp3 },
      { sound: brightMarimba_mp3, options: { initialPlaybackRate: Math.pow( 2, 4 / 12 ) } },
      { sound: brightMarimba_mp3, options: { initialPlaybackRate: 2 } },
      { sound: loonCall_mp3 }
    ] );

    soundManager.addSoundGenerator( compositeSoundClip );

    // add a button to play a composite sound
    const playSoundClipChordButton = new TextPushButton( 'Play CompositeSoundClip', {
      baseColor: '#aad6cc',
      font: new PhetFont( 16 ),
      soundPlayer: compositeSoundClip
    } );

    // add button to stop the sound
    const stopSoundClipChordButton = new TextPushButton( 'Stop CompositeSoundClip', {
      baseColor: '#DBB1CD',
      font: new PhetFont( 16 ),
      soundPlayer: nullSoundPlayer, // turn off default sound generation
      listener: () => { compositeSoundClip.stop(); }
    } );

    super( merge( {
      children: [ playSoundClipChordButton, stopSoundClipChordButton ],
      spacing: 20
    }, options ) );

    // dispose function
    this.disposeCompositeSoundClipTestNode = () => {
      soundManager.removeSoundGenerator( compositeSoundClip );
      compositeSoundClip.dispose();
    };
  }

  /**
   * Release references to avoid memory leaks.
   */
  public override dispose(): void {
    this.disposeCompositeSoundClipTestNode();
    super.dispose();
  }
}

tambo.register( 'CompositeSoundClipTestNode', CompositeSoundClipTestNode );
export default CompositeSoundClipTestNode;