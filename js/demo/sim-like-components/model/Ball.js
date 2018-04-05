// Copyright 2018, University of Colorado Boulder

/**
 * simple model of a ball
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SonificationManager = require( 'TAMBO/SonificationManager' );
  var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var tambo = require( 'TAMBO/tambo' );

  /**
   * @param {number} radius - in centimeters
   * @param {Color} color
   * @param {Vector2} initialPosition
   * @param {Vector2} initialVelocity
   * @constructor
   */
  function Ball( radius, color, initialPosition, initialVelocity ) {

    var self = this;

    // @public read-only {number}
    this.radius = radius;

    // @public read-only {Color}
    this.color = color;

    // @public {Property<Vector2>}
    this.positionProperty = new Property( initialPosition );

    // @public {Property<Vector2>}
    this.velocityProperty = new Property( initialVelocity );

    // add sounds

    var sonificationManager = SonificationManager.instance;

    // @public (read-only) {SoundClip}
    this.wallContactSound = new SoundClip( './audio/wall-contact.mp3' );
    this.ceilingFloorContactSound = new SoundClip( './audio/ceiling-floor-contact.mp3' );

    // add the sound generators
    sonificationManager.addSoundGenerator( this.wallContactSound );
    sonificationManager.addSoundGenerator( this.ceilingFloorContactSound );

    this.velocityProperty.lazyLink( function( newVelocity, oldVelocity ) {
      if ( newVelocity.x === -oldVelocity.x ) {
        self.wallContactSound.play();
      }
      if ( newVelocity.y === -oldVelocity.y ) {
        self.ceilingFloorContactSound.play();
      }
    } );

  }

  tambo.register( 'Ball', Ball );

  return inherit( Object, Ball );
} );