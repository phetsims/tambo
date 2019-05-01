// Copyright 2018-2019, University of Colorado Boulder

/**
 * a panel that contains controls used to exercise the addition, removal, and disposal of sound generators
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const tambo = require( 'TAMBO/tambo' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const BUTTON_FONT = new PhetFont( 19 );
  const COMBO_BOX_FONT = new PhetFont( 16 );
  const PLAY_COLOR = '#66FF8C';
  const STOP_COLOR = '#FF4D4D';

  // sounds - these are defined in an object to simplify the process of adding or removing sounds to this panel
  const sounds = [

    {
      soundName: 'Bright Marimba',
      loop: false,
      encodings: [
        {
          stereo: true,
          format: 'mp3',
          rate: '128 kbps',
          sound: require( 'sound!TAMBO/20180213_Bright_Marimba-128-kbps-stereo.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: true,
          format: 'mp3',
          rate: '64 kbps',
          sound: require( 'sound!TAMBO/20180213_Bright_Marimba-64-kbps-stereo.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: true,
          format: 'mp3',
          rate: '48 kbps',
          sound: require( 'sound!TAMBO/20180213_Bright_Marimba-48-kbps-stereo.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: true,
          format: 'mp3',
          rate: '24 kbps',
          sound: require( 'sound!TAMBO/20180213_Bright_Marimba-24-kbps-stereo.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: true,
          format: 'mp3',
          rate: '16 kbps',
          sound: require( 'sound!TAMBO/20180213_Bright_Marimba-16-kbps-stereo.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: true,
          format: 'mp3',
          rate: '8 kbps',
          sound: require( 'sound!TAMBO/20180213_Bright_Marimba-8-kbps-stereo.mp3' ),
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
          sound: require( 'sound!TAMBO/07_Button_Reset_All_v3-128-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '64 kbps',
          sound: require( 'sound!TAMBO/07_Button_Reset_All_v3-64-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '48 kbps',
          sound: require( 'sound!TAMBO/07_Button_Reset_All_v3-48-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '24 kbps',
          sound: require( 'sound!TAMBO/07_Button_Reset_All_v3-24-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '16 kbps',
          sound: require( 'sound!TAMBO/07_Button_Reset_All_v3-16-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '8 kbps',
          sound: require( 'sound!TAMBO/07_Button_Reset_All_v3-8-kbps-mono.mp3' ),
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
          sound: require( 'sound!TAMBO/Charges_In_Body_Better_Loop-128-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '64 kbps',
          sound: require( 'sound!TAMBO/Charges_In_Body_Better_Loop-64-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '48 kbps',
          sound: require( 'sound!TAMBO/Charges_In_Body_Better_Loop-48-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '24 kbps',
          sound: require( 'sound!TAMBO/Charges_In_Body_Better_Loop-24-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '16 kbps',
          sound: require( 'sound!TAMBO/Charges_In_Body_Better_Loop-16-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '8 kbps',
          sound: require( 'sound!TAMBO/Charges_In_Body_Better_Loop-8-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        }
      ]
    }
  ];

  /**
   * {Node} listParent - a node where the combo box lists will be placed, necessary for desired drop-down behavior
   * @param {Node} listParent - parent node for the list from the combo box
   * @param {Object} [options]
   * @constructor
   */
  function SoundEncodingComparisonPanel( listParent, options ) {

    options = _.extend( {
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
          new Text( encoding.format + ' ' + encoding.rate + ' ' + stereoMonoString, { font: COMBO_BOX_FONT } ),
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
      listener: function() {
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

    Panel.call( this, rootVBox, options );
  }

  tambo.register( 'SoundEncodingComparisonPanel', SoundEncodingComparisonPanel );

  return inherit( Panel, SoundEncodingComparisonPanel );
} );