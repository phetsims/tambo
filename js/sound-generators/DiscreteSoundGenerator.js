// Copyright 2019, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const tambo = require( 'TAMBO/tambo' );

  // sounds
  const defaultSound = require( 'sound!TAMBO/bright-marimba.mp3' );

  /**
   * {NumberProperty} valueProperty - the value that is monitored to trigger sounds
   * {Range} valueRange - the range of values expected and over which sounds will be played
   * {Object} options
   * @constructor
   */
  function DiscreteSoundGenerator( valueProperty, valueRange, options ) {

    const self = this;

    options = _.extend( {

      // sound - the sound to play as the value changes
      sound: defaultSound,

      // {number} - initial level at which sounds will be produced, can be changed later
      initialOutputLevel: 1,

      // {number} - number of bins, odd numbers are generally better if slider starts in middle of range
      numBins: 7,

      // {Range} - the range over which the playback rate is varied, 1 is normal speed, 2 is double speed, et cetera
      playbackRateRange: new Range( 1, 1 ), // default is no change to the sound

      // {BooleanProperty} - when true will cause sound to be played on any change of the value property
      alwaysPlayOnChangesProperty: null,

      // {boolean} - if true, the sound will be played when the value reaches the min
      playSoundAtMin: true,

      // {boolean} - if true, the sound will be played when the value reaches the max
      playSoundAtMax: true,

      // {boolean} - a flag that indicates whether out of range values should be ignored
      outOfRangeValuesOK: false

    }, options );

    // invoke superconstructor
    SoundClip.call( this, options.sound, options );

    // create the object that will place the continuous values into bins
    const binSelector = new BinSelector( valueRange, options.numBins, options.outOfRangeValuesOK );

    // function for playing sound when the appropriate conditions are met
    function playSoundOnChanges( newValue, oldValue ) {

      const newBin = binSelector.selectBin( newValue );
      const oldBin = binSelector.selectBin( oldValue );

      if ( options.alwaysPlayOnChangesProperty && options.alwaysPlayOnChangesProperty.value ||
           ( newValue === valueRange.min && options.playSoundAtMin ) ||
           ( newValue === valueRange.max && options.playSoundAtMax ) ||
           newBin !== oldBin ) {

        const normalizedValue = ( newValue - valueRange.min ) / valueRange.getLength();
        const playbackRate = normalizedValue * ( options.playbackRateRange.max - options.playbackRateRange.min ) +
                             options.playbackRateRange.min;
        self.setPlaybackRate( playbackRate );
        self.play();
      }
    }

    // monitor the value, playing sounds when appropriate
    valueProperty.lazyLink( playSoundOnChanges );

    // @private {function}
    this.disposeDiscreteSoundGenerator = function() {
      valueProperty.unlink( playSoundOnChanges );
    };
  }

  /**
   * inner type for placing values in a bin
   * @param {Range} valueRange
   * @param {number} numBins
   * @param {boolean} tolerateOutOfRangeValues
   * @constructor
   */
  function BinSelector( valueRange, numBins, tolerateOutOfRangeValues ) {

    // parameter checking
    assert && assert( numBins > 0 );

    // @private
    this.minValue = valueRange.min;
    this.maxValue = valueRange.max;
    this.span = valueRange.getLength();
    this.numBins = numBins;
    this.tolerateOutOfRangeValues = tolerateOutOfRangeValues;
  }

  inherit( Object, BinSelector, {

    /**
     * put the provided value in a bin
     * @param value
     * @returns {number}
     */
    selectBin: function( value ) {
      if ( !this.tolerateOutOfRangeValues ) {
        assert && assert( value <= this.maxValue );
        assert && assert( value >= this.minValue );
      }

      // this calculation means that values on the boundaries will go into the higher bin except for the max value
      const proportion = ( value - this.minValue ) / ( this.span );
      return Math.min( Math.floor( proportion * this.numBins ), this.numBins - 1 );
    }
  } );

  tambo.register( 'DiscreteSoundGenerator', DiscreteSoundGenerator );

  return inherit( SoundClip, DiscreteSoundGenerator, {

    /**
     * @public
     */
    dispose: function() {
      this.disposeDiscreteSoundGenerator();
      SoundClip.prototype.dispose.call( this );
    }
  } );
} );