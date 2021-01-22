// Copyright 2018-2020, University of Colorado Boulder

/**
 * a panel that contains controls used to exercise the addition, removal, and disposal of sound generators
 *
 * @author John Blanco
 */

import createObservableArray from '../../../../../axon/js/createObservableArray.js';
import Property from '../../../../../axon/js/Property.js';
import stepTimer from '../../../../../axon/js/stepTimer.js';
import dotRandom from '../../../../../dot/js/dotRandom.js';
import merge from '../../../../../phet-core/js/merge.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import ComboBox from '../../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../../sun/js/ComboBoxItem.js';
import Panel from '../../../../../sun/js/Panel.js';
import birdCallSound from '../../../../sounds/bird-call_mp3.js';
import cricketsSound from '../../../../sounds/crickets-loop_mp3.js';
import PitchedPopGenerator from '../../../sound-generators/PitchedPopGenerator.js';
import SoundClip from '../../../sound-generators/SoundClip.js';
import soundManager from '../../../soundManager.js';
import tambo from '../../../tambo.js';

// constants
const BUTTON_FONT = new PhetFont( 18 );
const COMBO_BOX_FONT = new PhetFont( 16 );
const TOTAL_ADDED_TEMPLATE = 'Total Added: {{numSoundGenerators}}';
const ADD_BUTTON_COLOR = '#C0D890';

// info needed for selecting and using different sound generators from the combo box
const SOUND_GENERATOR_INFO = {
  recordedOneShot: {
    comboBoxName: 'Recorded one shot',
    createSoundGenerator: () => new SoundClip( birdCallSound )
  },
  recordedLoop: {
    comboBoxName: 'Recorded loop',
    createSoundGenerator: () => new SoundClip( cricketsSound, { loop: true } )
  },
  synthesizedSound: {
    comboBoxName: 'Synthesized sound',
    createSoundGenerator: () => new PitchedPopGenerator( { numPopGenerators: 2 } )
  }
};

class RemoveAndDisposeSoundGeneratorsTestPanel extends Panel {

  /**
   * @param {Object} [options]
   * @constructor
   */
  constructor( options ) {

    options = merge( {
      fill: '#f5d3b3',
      xMargin: 14,
      yMargin: 14
    }, options );

    // array of sound generators that have been added and not yet removed and disposed
    const soundGenerators = createObservableArray();

    // node where the content goes, needed so that ComboBox will have a good place to put its list
    const panelContentNode = new Node();

    // informational text that goes at the top of the panel
    const infoText = new Text( 'Test addition, removal, and disposal of sound generators', {
      font: new PhetFont( { size: 18, weight: 'bold' } )
    } );

    // create the combo box for selecting the type of sound generator to add
    const comboBoxItems = [];
    _.keys( SOUND_GENERATOR_INFO ).forEach( soundGeneratorKey => {
      comboBoxItems.push( new ComboBoxItem(
        new Text( SOUND_GENERATOR_INFO[ soundGeneratorKey ].comboBoxName, { font: COMBO_BOX_FONT } ),
        soundGeneratorKey
      ) );
    } );
    const selectedSoundGeneratorTypeProperty = new Property( comboBoxItems[ 0 ].value );
    const comboBox = new ComboBox( comboBoxItems, selectedSoundGeneratorTypeProperty, panelContentNode, {
      buttonFill: 'rgb( 218, 236, 255 )'
    } );
    const sgSelectorNode = new HBox( {
      children: [
        new Text( 'SG type to add:', { font: new PhetFont( 19 ) } ),
        comboBox
      ],
      spacing: 7
    } );

    function addSoundGenerators( numToAdd ) {
      _.times( numToAdd, () => {
        const soundGenerator = SOUND_GENERATOR_INFO[ selectedSoundGeneratorTypeProperty.value ].createSoundGenerator();
        soundManager.addSoundGenerator( soundGenerator );
        soundGenerators.push( soundGenerator );
      } );
    }

    // create a horizontal set of buttons for adding sound generators at different orders of magnitude
    const addButtonHBox = new HBox( {
      children: [
        new TextPushButton( 'Add 1', {
          baseColor: ADD_BUTTON_COLOR,
          font: BUTTON_FONT,
          listener: () => { addSoundGenerators( 1 ); }
        } ),
        new TextPushButton( 'Add 10', {
          baseColor: ADD_BUTTON_COLOR,
          font: BUTTON_FONT,
          listener: () => { addSoundGenerators( 10 ); }
        } ),
        new TextPushButton( 'Add 100', {
          baseColor: ADD_BUTTON_COLOR,
          font: BUTTON_FONT,
          listener: () => { addSoundGenerators( 100 ); }
        } )
      ],
      spacing: 14
    } );

    // create a horizontal box with an indicator for the number of sound generators added and a button to remove them all
    const totalAddedIndicator = new Text( TOTAL_ADDED_TEMPLATE, { font: new PhetFont( 19 ) } );
    const removeAllSoundGeneratorsButton = new TextPushButton( 'Remove All', {
      font: BUTTON_FONT,
      listener: () => { soundGenerators.clear(); }
    } );
    const showTotalHBox = new HBox( {
      children: [
        totalAddedIndicator,
        removeAllSoundGeneratorsButton
      ],
      spacing: 14
    } );

    // create a button that will test the most recently added sound generator
    const testLastAddedSGButton = new TextPushButton( 'Test last added SG', {
      font: BUTTON_FONT,
      baseColor: '#BABFFF',
      listener: () => {
        const mostRecentlyAddedSoundGenerator = soundGenerators.get( soundGenerators.length - 1 );

        if ( mostRecentlyAddedSoundGenerator instanceof SoundClip ) {
          if ( mostRecentlyAddedSoundGenerator.loop ) {

            // only start the loop if not already playing
            if ( !mostRecentlyAddedSoundGenerator.isPlaying ) {

              // play the loop for a fixed time and then stop, but make sure the sound generator wasn't removed in the
              // interim
              mostRecentlyAddedSoundGenerator.play();
              stepTimer.setTimeout( () => {
                if ( soundGenerators.includes( mostRecentlyAddedSoundGenerator ) ) {
                  mostRecentlyAddedSoundGenerator.stop();
                }
              }, 3000 );
            }
          }
          else {

            // play one-shot sounds whenever the button is pressed
            mostRecentlyAddedSoundGenerator.play();
          }
        }
        else if ( mostRecentlyAddedSoundGenerator instanceof PitchedPopGenerator ) {
          mostRecentlyAddedSoundGenerator.playPop( dotRandom.nextDouble() );
        }
      }
    } );

    // update the total added indicator when the total changes, also the state of the "Remove All" button
    soundGenerators.lengthProperty.link( numSGs => {
      totalAddedIndicator.text = StringUtils.fillIn( TOTAL_ADDED_TEMPLATE, {
        numSoundGenerators: numSGs
      } );
      testLastAddedSGButton.enabled = numSGs > 0;
      removeAllSoundGeneratorsButton.enabled = numSGs > 0;
    } );

    // listen for removal of sound generators from the observable array and remove them from the sound manager
    soundGenerators.addItemRemovedListener( removedSoundGenerator => {
      soundManager.removeSoundGenerator( removedSoundGenerator );
      removedSoundGenerator.dispose();
    } );

    // add everything to a vertical box
    const rootVBox = new VBox( {
      children: [ infoText, sgSelectorNode, addButtonHBox, showTotalHBox, testLastAddedSGButton ],
      spacing: 19
    } );

    panelContentNode.addChild( rootVBox );

    super( panelContentNode, options );
  }

}

tambo.register( 'RemoveAndDisposeSoundGeneratorsTestPanel', RemoveAndDisposeSoundGeneratorsTestPanel );

export default RemoveAndDisposeSoundGeneratorsTestPanel;