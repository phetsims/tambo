// Copyright 2020, University of Colorado Boulder

import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import brightMarimbaSound from '../../../../sounds/bright-marimba_mp3.js';
import Playable from '../../../Playable.js';
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
    const chordSoundClipChord = new SoundClipChord( brightMarimbaSound );
    const arpeggioSoundClipChord = new SoundClipChord( brightMarimbaSound, { arpeggiate: true } );
    soundManager.addSoundGenerator( chordSoundClipChord );
    soundManager.addSoundGenerator( arpeggioSoundClipChord );

    // add a button to play a basic-mode sound
    const playBasicSoundButton = new TextPushButton( 'Play Chord', {
      baseColor: '#aad6cc',
      font: new PhetFont( 16 ),
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
      listener: () => { chordSoundClipChord.play(); }
    } );

    // add button to play enhanced-mode sound
    const playEnhancedSoundButton = new TextPushButton( 'Play Arpeggiated Chord', {
      baseColor: '#DBB1CD',
      font: new PhetFont( 16 ),
      soundPlayer: Playable.NO_SOUND, // turn off default sound generation
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