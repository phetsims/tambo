// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */

/**
 * Decode a base-64 encoded sound into a Uint8Array.  This does *not* do audio decompression, such as that needed for
 * interpreting MP3 files.
 */
const base64SoundToByteArray = ( audioContext: AudioContext, base64Sound: string ): Uint8Array => {
  const soundData = base64Sound.replace( new RegExp( '^.*,' ), '' ); // remove the mime header
  const byteChars = atob( soundData );
  const byteArray = new Uint8Array( byteChars.length );
  for ( let j = 0; j < byteArray.length; j++ ) {

    // A note to future maintainers of this code: The line below, strictly speaking, seems to disregard the highest 8
    // bits of the character code, since strings in JavaScript are UTF-16.  This seems a little odd, but testing showed
    // that the decoded base64 data never had values above 255, so it worked.  This code was leveraged from examples
    // found on the web, and has worked through all our testing, so perhaps the upper bits are simply never used in this
    // decoding process.  That seems like the best explanation.  However, if we one day run into issues with sound
    // decoding, this might warrant further scrutiny.
    byteArray[ j ] = byteChars.charCodeAt( j );
  }
  return byteArray;
};

export default base64SoundToByteArray;