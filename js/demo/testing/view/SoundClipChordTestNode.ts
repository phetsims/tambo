// Copyright 2020-2022, University of Colorado Boulder

/**
 * Test and demo of the SoundClipChord.
 *
 * @author Michael Kauzamann (PhET Interactive Simulations)
 */

import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { VBox, VBoxOptions } from '../../../../../scenery/js/imports.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import brightMarimba_mp3 from '../../../../sounds/brightMarimba_mp3.js';
import SoundClipChord from '../../../sound-generators/SoundClipChord.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;
export type SoundClipChordTestNodeOptions = SelfOptions & VBoxOptions;

class SoundClipChordTestNode extends VBox {

  private readonly disposeSoundClipChordTestNode: () => void;

  public constructor( providedOptions?: SoundClipChordTestNodeOptions ) {

    // sound clips to be played
    const chordSoundClipChord = new SoundClipChord( brightMarimba_mp3 );
    const arpeggioSoundClipChord = new SoundClipChord( brightMarimba_mp3, { arpeggiate: true } );
    soundManager.addSoundGenerator( chordSoundClipChord );
    soundManager.addSoundGenerator( arpeggioSoundClipChord );

    // add a button to play a chord
    const playChordButton = new TextPushButton( 'Play Chord', {
      baseColor: '#aad6cc',
      font: new PhetFont( 16 ),
      soundPlayer: chordSoundClipChord
    } );

    // add button to play an arpeggio
    const playArpeggioButton = new TextPushButton( 'Play Arpeggiated Chord', {
      baseColor: '#DBB1CD',
      font: new PhetFont( 16 ),
      soundPlayer: arpeggioSoundClipChord
    } );

    super( optionize<SoundClipChordTestNodeOptions, SelfOptions, VBoxOptions>()( {
      children: [ playChordButton, playArpeggioButton ],
      spacing: 20
    }, providedOptions ) );

    // dispose function
    this.disposeSoundClipChordTestNode = () => {
      soundManager.removeSoundGenerator( chordSoundClipChord );
      chordSoundClipChord.dispose();
      soundManager.removeSoundGenerator( arpeggioSoundClipChord );
      arpeggioSoundClipChord.dispose();
    };
  }

  /**
   * Release references to avoid memory leaks.
   */
  public override dispose(): void {
    this.disposeSoundClipChordTestNode();
    super.dispose();
  }
}

tambo.register( 'SoundClipChordTestNode', SoundClipChordTestNode );

export default SoundClipChordTestNode;