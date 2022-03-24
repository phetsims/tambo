// Copyright 2020-2022, University of Colorado Boulder

// @ts-nocheck

import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { VBox } from '../../../../../scenery/js/imports.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import brightMarimba_mp3 from '../../../../sounds/brightMarimba_mp3.js';
import SoundPlayer from '../../../SoundPlayer.js';
import SoundClipChord from '../../../sound-generators/SoundClipChord.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';

/**
 * Test and demo of the SoundClipChord.
 *
 * @author Michael Kauzamann (PhET Interactive Simulations)
 */
class SoundClipChordTestNode extends VBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // sound clips to be played
    const chordSoundClipChord = new SoundClipChord( brightMarimba_mp3 );
    const arpeggioSoundClipChord = new SoundClipChord( brightMarimba_mp3, { arpeggiate: true } );
    soundManager.addSoundGenerator( chordSoundClipChord );
    soundManager.addSoundGenerator( arpeggioSoundClipChord );

    // add a button to play a basic-mode sound
    const playBasicSoundButton = new TextPushButton( 'Play Chord', {
      baseColor: '#aad6cc',
      font: new PhetFont( 16 ),
      soundPlayer: SoundPlayer.NO_SOUND, // turn off default sound generation
      listener: () => { chordSoundClipChord.play(); }
    } );

    // add button to play enhanced-mode sound
    const playEnhancedSoundButton = new TextPushButton( 'Play Arpeggiated Chord', {
      baseColor: '#DBB1CD',
      font: new PhetFont( 16 ),
      soundPlayer: SoundPlayer.NO_SOUND, // turn off default sound generation
      listener: () => { arpeggioSoundClipChord.play(); }
    } );

    super( merge( {
      children: [ playBasicSoundButton, playEnhancedSoundButton ],
      spacing: 20
    }, options ) );

    // @private - dispose function
    this.disposeSoundClipChordTestNode = () => {
      soundManager.removeSoundGenerator( chordSoundClipChord );
      chordSoundClipChord.dispose();
      soundManager.removeSoundGenerator( arpeggioSoundClipChord );
      arpeggioSoundClipChord.dispose();
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeSoundClipChordTestNode();
    super.dispose();
  }
}

tambo.register( 'SoundClipChordTestNode', SoundClipChordTestNode );
export default SoundClipChordTestNode;