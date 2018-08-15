// Copyright 2018, University of Colorado Boulder

/**
 * a panel that contains controls used to exercise the addition, removal, and disposal of sound generators
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LoopingSoundClip = require( 'TAMBO/sound-generators/LoopingSoundClip' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OneShotSoundClip = require( 'TAMBO/sound-generators/OneShotSoundClip' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var soundManager = require( 'TAMBO/soundManager' );
  var tambo = require( 'TAMBO/tambo' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var BUTTON_FONT = new PhetFont( 14 );
  var COMBO_BOX_FONT = new PhetFont( 12 );

  // audio - these are defined in an object to simplify the process of adding or removing sounds to this panel
  var sounds = [

    {
      soundName: 'Bright Marimba',
      loop: false,
      encodings: [
        {
          stereo: true,
          format: 'mp3',
          rate: '128 kbps',
          audio: require( 'audio!TAMBO/20180213_Bright_Marimba-128-kbps-stereo.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: true,
          format: 'mp3',
          rate: '64 kbps',
          audio: require( 'audio!TAMBO/20180213_Bright_Marimba-64-kbps-stereo.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: true,
          format: 'mp3',
          rate: '48 kbps',
          audio: require( 'audio!TAMBO/20180213_Bright_Marimba-48-kbps-stereo.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: true,
          format: 'mp3',
          rate: '24 kbps',
          audio: require( 'audio!TAMBO/20180213_Bright_Marimba-24-kbps-stereo.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: true,
          format: 'mp3',
          rate: '16 kbps',
          audio: require( 'audio!TAMBO/20180213_Bright_Marimba-16-kbps-stereo.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: true,
          format: 'mp3',
          rate: '8 kbps',
          audio: require( 'audio!TAMBO/20180213_Bright_Marimba-8-kbps-stereo.mp3' ),
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
          audio: require( 'audio!TAMBO/07_Button_Reset_All_v3-128-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '64 kbps',
          audio: require( 'audio!TAMBO/07_Button_Reset_All_v3-64-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '48 kbps',
          audio: require( 'audio!TAMBO/07_Button_Reset_All_v3-48-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '24 kbps',
          audio: require( 'audio!TAMBO/07_Button_Reset_All_v3-24-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '16 kbps',
          audio: require( 'audio!TAMBO/07_Button_Reset_All_v3-16-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        },
        {
          stereo: false,
          format: 'mp3',
          rate: '8 kbps',
          audio: require( 'audio!TAMBO/07_Button_Reset_All_v3-8-kbps-mono.mp3' ),
          soundGenerator: null // filled in during construction
        }
      ]
    }


  ];

  /**
   * {Node} listParent - a node where the combo box lists will be placed, necessary for desired drop-down behavior
   * @param {Object} [options]
   * @constructor
   */
  function SoundEncodingComparisonPanel( listParent, options ) {

    options = _.extend( {
      fill: '#CFE2CF',
      xMargin: 10,
      yMargin: 10
    }, options );

    // informational text that goes at the top of the panel
    var infoText = new Text( 'Select sound and encoding, use button(s) to play', {
      font: new PhetFont( { size: 14, weight: 'bold' } )
    } );

    // create the combo box for selecting the sound to be played
    var soundSelectorComboBoxItems = [];
    var encodingSelectionComboBoxes = [];
    var selectedEncodingProperty = new Property( 0 ); // this is shared by all encoding selectors
    sounds.forEach( function( soundDescriptor, index ) {

      // create the combo box item for selecting this sound
      soundSelectorComboBoxItems.push( ComboBox.createItem(
        new Text( soundDescriptor.soundName, { font: COMBO_BOX_FONT } ),
        index
      ) );

      // each sound generally has several encodings, so create a combo box for selecting the encodings for this sound
      var encodingSelectorComboBoxItems = [];
      soundDescriptor.encodings.forEach( function( encoding, encodingIndex ) {
        var stereoMonoString = encoding.stereo ? '(stereo)' : '(mono)';
        encodingSelectorComboBoxItems.push( ComboBox.createItem(
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
    var selectedSoundIndexProperty = new Property( 0 );
    var soundSelectorComboBox = new ComboBox( soundSelectorComboBoxItems, selectedSoundIndexProperty, listParent );

    // the encoding selector combo boxes get changed around based on which sound is selected - this is the parent node
    var encodingSelectorParentNode = new Node();

    // create a node that will contain the combo boxes for selecting the sound and the encoding
    var soundAndEncodingSelectorNode = new HBox( {
      children: [
        new Text( 'Sound:', { font: new PhetFont( 14 ) } ),
        soundSelectorComboBox,
        new HStrut( 5 ),
        new Text( 'Encoding:', { font: new PhetFont( 14 ) } ),
        encodingSelectorParentNode
      ],
      spacing: 4
    } );

    // update the encoding selector based on the selected sound
    selectedSoundIndexProperty.link( function( selectedSoundIndex ) {
      selectedEncodingProperty.reset();
      encodingSelectorParentNode.removeAllChildren();
      encodingSelectorParentNode.addChild( encodingSelectionComboBoxes[ selectedSoundIndex ] );
    } );

    // create and register sound generators for each sound and encoding
    sounds.forEach( function( soundDescriptor ) {
      soundDescriptor.encodings.forEach( function( encoding ) {
        if ( soundDescriptor.loop ) {
          encoding.soundGenerator = new LoopingSoundClip( encoding.audio );
        }
        else {
          encoding.soundGenerator = new OneShotSoundClip( encoding.audio );
        }
        soundManager.addSoundGenerator( encoding.soundGenerator );
      } );
    } );

    // button used to play sounds
    var playButton = new TextPushButton( 'Play', {
      font: BUTTON_FONT,
      listener: function() {
        var soundGenerator =
          sounds[ selectedSoundIndexProperty.value ].encodings[ selectedEncodingProperty.value ].soundGenerator;
        console.log( 'soundManager.getSoundGeneratorId( soundGenerator) = ' + soundManager.getSoundGeneratorId( soundGenerator ) );
        soundGenerator.play();
      }
    } );

    // button used to stop sounds, only visible when looping sound clips selected
    // TODO: create this button

    // create an HBox with one button for one shot sounds and two buttons for looping sounds
    var buttonHBox = new HBox( {
      children: [ playButton ],
      spacing: 5
    } );

    // add everything to a vertical box
    var rootVBox = new VBox( {
      children: [ infoText, soundAndEncodingSelectorNode, buttonHBox ],
      spacing: 14
    } );

    Panel.call( this, rootVBox, options );
  }

  tambo.register( 'SoundEncodingComparisonPanel', SoundEncodingComparisonPanel );

  return inherit( Panel, SoundEncodingComparisonPanel );
} );