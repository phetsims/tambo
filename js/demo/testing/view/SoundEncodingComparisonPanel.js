// Copyright 2018-2020, University of Colorado Boulder

/**
 * a panel that contains controls used to exercise the addition, removal, and disposal of sound generators
 *
 * @author John Blanco
 */

import Property from '../../../../../axon/js/Property.js';
import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../../scenery/js/nodes/HStrut.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../../../../sun/js/buttons/RectangularPushButton.js';
import ComboBox from '../../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../../sun/js/ComboBoxItem.js';
import Panel from '../../../../../sun/js/Panel.js';
import resetAll128Sound from '../../../../sounds/07_Button_Reset_All_v3-128-kbps-mono_mp3.js';
import resetAll16Sound from '../../../../sounds/07_Button_Reset_All_v3-16-kbps-mono_mp3.js';
import resetAll24Sound from '../../../../sounds/07_Button_Reset_All_v3-24-kbps-mono_mp3.js';
import resetAll48Sound from '../../../../sounds/07_Button_Reset_All_v3-48-kbps-mono_mp3.js';
import resetAll64Sound from '../../../../sounds/07_Button_Reset_All_v3-64-kbps-mono_mp3.js';
import resetAll8Sound from '../../../../sounds/07_Button_Reset_All_v3-8-kbps-mono_mp3.js';
import marimba128Sound from '../../../../sounds/20180213_Bright_Marimba-128-kbps-stereo_mp3.js';
import marimba16Sound from '../../../../sounds/20180213_Bright_Marimba-16-kbps-stereo_mp3.js';
import marimba24Sound from '../../../../sounds/20180213_Bright_Marimba-24-kbps-stereo_mp3.js';
import marimba48Sound from '../../../../sounds/20180213_Bright_Marimba-48-kbps-stereo_mp3.js';
import marimba64Sound from '../../../../sounds/20180213_Bright_Marimba-64-kbps-stereo_mp3.js';
import marimba8Sound from '../../../../sounds/20180213_Bright_Marimba-8-kbps-stereo_mp3.js';
import charges128Sound from '../../../../sounds/Charges_In_Body_Better_Loop-128-kbps-mono_mp3.js';
import charges16Sound from '../../../../sounds/Charges_In_Body_Better_Loop-16-kbps-mono_mp3.js';
import charges24Sound from '../../../../sounds/Charges_In_Body_Better_Loop-24-kbps-mono_mp3.js';
import charges48Sound from '../../../../sounds/Charges_In_Body_Better_Loop-48-kbps-mono_mp3.js';
import charges64Sound from '../../../../sounds/Charges_In_Body_Better_Loop-64-kbps-mono_mp3.js';
import charges8Sound from '../../../../sounds/Charges_In_Body_Better_Loop-8-kbps-mono_mp3.js';
import SoundClip from '../../../sound-generators/SoundClip.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';

// constants
const BUTTON_FONT = new PhetFont( 18 );
const COMBO_BOX_FONT = new PhetFont( 16 );
const PLAY_COLOR = '#66FF8C';
const STOP_COLOR = '#FF4D4D';

const sounds = [

  {
    soundName: 'Bright Marimba',
    loop: false,
    encodings: [
      {
        stereo: true,
        format: 'mp3',
        rate: '128 kbps',
        sound: marimba128Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: true,
        format: 'mp3',
        rate: '64 kbps',
        sound: marimba64Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: true,
        format: 'mp3',
        rate: '48 kbps',
        sound: marimba48Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: true,
        format: 'mp3',
        rate: '24 kbps',
        sound: marimba24Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: true,
        format: 'mp3',
        rate: '16 kbps',
        sound: marimba16Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: true,
        format: 'mp3',
        rate: '8 kbps',
        sound: marimba8Sound,
        soundGenerator: null // filled in during construction
      }
    ]
  },

  {
    soundName: 'Reset All',
    loop: false,
    encodings: [
      {
        stereo: false,
        format: 'mp3',
        rate: '128 kbps',
        sound: resetAll128Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: false,
        format: 'mp3',
        rate: '64 kbps',
        sound: resetAll64Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: false,
        format: 'mp3',
        rate: '48 kbps',
        sound: resetAll48Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: false,
        format: 'mp3',
        rate: '24 kbps',
        sound: resetAll24Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: false,
        format: 'mp3',
        rate: '16 kbps',
        sound: resetAll16Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: false,
        format: 'mp3',
        rate: '8 kbps',
        sound: resetAll8Sound,
        soundGenerator: null // filled in during construction
      }
    ]
  },

  {
    soundName: 'Charges Loop',
    loop: true,
    encodings: [
      {
        stereo: false,
        format: 'mp3',
        rate: '128 kbps',
        sound: charges128Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: false,
        format: 'mp3',
        rate: '64 kbps',
        sound: charges64Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: false,
        format: 'mp3',
        rate: '48 kbps',
        sound: charges48Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: false,
        format: 'mp3',
        rate: '24 kbps',
        sound: charges24Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: false,
        format: 'mp3',
        rate: '16 kbps',
        sound: charges16Sound,
        soundGenerator: null // filled in during construction
      },
      {
        stereo: false,
        format: 'mp3',
        rate: '8 kbps',
        sound: charges8Sound,
        soundGenerator: null // filled in during construction
      }
    ]
  }
];

class SoundEncodingComparisonPanel extends Panel {

  /**
   * {Node} listParent - a node where the combo box lists will be placed, necessary for desired drop-down behavior
   * @param {Node} listParent - parent node for the list from the combo box
   * @param {Object} [options]
   */
  constructor( listParent, options ) {

    options = merge( {
      fill: '#CFE2CF',
      xMargin: 14,
      yMargin: 14
    }, options );

    // informational text that goes at the top of the panel
    const infoText = new Text( 'Select sound and encoding, use button to play', {
      font: new PhetFont( { size: 19, weight: 'bold' } )
    } );

    // create the combo box for selecting the sound to be played
    const soundSelectorComboBoxItems = [];
    const encodingSelectionComboBoxes = [];
    const selectedEncodingProperty = new Property( 0 ); // this is shared by all encoding selectors
    sounds.forEach( ( soundDescriptor, index ) => {

      // create the combo box item for selecting this sound
      soundSelectorComboBoxItems.push( new ComboBoxItem(
        new Text( soundDescriptor.soundName, { font: COMBO_BOX_FONT } ),
        index
      ) );

      // each sound generally has several encodings, so create a combo box for selecting the encodings for this sound
      const encodingSelectorComboBoxItems = [];
      soundDescriptor.encodings.forEach( ( encoding, encodingIndex ) => {
        const stereoMonoString = encoding.stereo ? '(stereo)' : '(mono)';
        encodingSelectorComboBoxItems.push( new ComboBoxItem(
          new Text( `${encoding.format} ${encoding.rate} ${stereoMonoString}`, { font: COMBO_BOX_FONT } ),
          encodingIndex
        ) );
      } );
      encodingSelectionComboBoxes.push( new ComboBox(
        encodingSelectorComboBoxItems,
        selectedEncodingProperty,
        listParent
      ) );

    } );
    const selectedSoundIndexProperty = new Property( 0 );
    const soundSelectorComboBox = new ComboBox( soundSelectorComboBoxItems, selectedSoundIndexProperty, listParent );

    // the encoding selector combo boxes get changed around based on which sound is selected - this is the parent node
    const encodingSelectorParentNode = new Node();

    // create a node that will contain the combo boxes for selecting the sound and the encoding
    const soundAndEncodingSelectorNode = new HBox( {
      children: [
        new Text( 'Sound:', { font: new PhetFont( 19 ) } ),
        soundSelectorComboBox,
        new HStrut( 5 ),
        new Text( 'Encoding:', { font: new PhetFont( 19 ) } ),
        encodingSelectorParentNode
      ],
      spacing: 6
    } );

    // create and register sound generators for each sound and encoding
    sounds.forEach( soundDescriptor => {
      soundDescriptor.encodings.forEach( encoding => {
        if ( soundDescriptor.loop ) {
          encoding.soundGenerator = new SoundClip( encoding.sound, {
            loop: true,
            trimSilence: true
          } );
        }
        else {
          encoding.soundGenerator = new SoundClip( encoding.sound );
        }
        soundManager.addSoundGenerator( encoding.soundGenerator );
      } );
    } );

    // label for sound control button
    const soundControlButtonLabel = new Text( 'Play', {
      font: BUTTON_FONT
    } );

    // button used to play sounds
    const soundControlButton = new RectangularPushButton( {
      content: soundControlButtonLabel,
      baseColor: PLAY_COLOR,
      listener: () => {
        const sound = sounds[ selectedSoundIndexProperty.value ];
        const soundGenerator = sound.encodings[ selectedEncodingProperty.value ].soundGenerator;

        // play or start the sound
        if ( sound.loop ) {
          if ( soundGenerator.isPlaying ) {
            soundGenerator.stop();
            soundControlButtonLabel.text = 'Play';
            soundControlButton.baseColor = PLAY_COLOR;
          }
          else {
            soundGenerator.play();
            soundControlButtonLabel.text = 'Stop';
            soundControlButton.baseColor = STOP_COLOR;
          }
        }
        else {
          soundGenerator.play();
        }
      }
    } );

    // update the UI state based on the attributes of the selected sound
    selectedSoundIndexProperty.link( ( selectedSoundIndex, previouslySelectedSoundIndex ) => {

      // make sure the correct encoding selector is being shown
      encodingSelectorParentNode.removeAllChildren();
      encodingSelectorParentNode.addChild( encodingSelectionComboBoxes[ selectedSoundIndex ] );

      // make sure the control button is in a good state
      soundControlButtonLabel.text = 'Play';
      soundControlButton.baseColor = PLAY_COLOR;

      // make sure anything that was playing is stopped
      if ( previouslySelectedSoundIndex !== null ) {
        const sound = sounds[ previouslySelectedSoundIndex ];
        if ( sound.loop ) {
          const soundGenerator = sound.encodings[ selectedEncodingProperty.value ].soundGenerator;
          if ( soundGenerator.isPlaying ) {
            soundGenerator.stop();
            soundControlButtonLabel.text = 'Play';
            soundControlButton.baseColor = PLAY_COLOR;
          }
        }
      }

      // go to default encoding
      selectedEncodingProperty.reset();
    } );

    selectedEncodingProperty.link( ( newSelection, oldSelection ) => {

      // make sure anything that was playing is stopped
      if ( oldSelection !== null ) {
        const sound = sounds[ selectedSoundIndexProperty.value ];
        if ( sound.loop ) {
          const soundGenerator = sound.encodings[ oldSelection ].soundGenerator;
          if ( soundGenerator.isPlaying ) {
            soundGenerator.stop();
            soundControlButtonLabel.text = 'Play';
            soundControlButton.baseColor = PLAY_COLOR;
          }
        }
      }
    } );

    // add everything to a vertical box
    const rootVBox = new VBox( {
      children: [ infoText, soundAndEncodingSelectorNode, soundControlButton ],
      spacing: 19
    } );

    super( rootVBox, options );
  }

}

tambo.register( 'SoundEncodingComparisonPanel', SoundEncodingComparisonPanel );

export default SoundEncodingComparisonPanel;