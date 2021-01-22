/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//MUZAAAAAGIAKAAAABIAtwBQAAA9KrJ//MURAEAOAOcAMAAAABwBzQBgBAApyaa//MURAAAJAOYAOAAAABIBygBwAAAymUq//MUZAAAJAOWAAAAAABIBvgAAAAAyuVq//MUZAAAGA+SAAACAABIBuwAAEQAHyPE//MUZAEALAOIAAAiAABIBuwAAEQA2TUM//MURAEAHA+CAAAGAABAHvAAABIAOsVG//MUZAIAKAOCAAAAAAAwHvQAAAQADxXK//MURAMAIA96AAAHAAA4HvQAAAQABhI1//MUZAQAJAOCAAAiAAA4HuAAAAQA05fL//MUZAUAHA98AAACAAA4HtgAAAwACslo//MUZAYAHAN+AAAiAABIBtwAAAAAyvIq//MUZAcAJAOAAAAAAAA4HswAAAQAHGrE//MUZAgAJAN8AAAiAAA4BtQAAEQAmJLI//MUZAkAJAN8AAAAAABQArQAAAAASA0P//MUZAkAGA9yAAACAAAwHqwAAAQAolUE//MURAoALANqAAAAAABYBtgAAEQAAAHK//MURAoANA9mAAAiAABAHtAAAAQAVR7K//MUZAoALBFoAAAGAAA4HrwAAAQAqtQ9//MURAoAHA9iAAACAABAHrwAAAQAyuLK//MUZAsAIA9gAAACAABIBsAAAAAAHCYY//MUZAsAIA9aAAAJAABIBsQAAAAAPsvr//MUZAsAHANiAAAAAAAwHrQAAAQAAslV//MUZAwAJANUAAACAABQBqQAAAAAyvSq//MUZAwAHA9KAAAGAAA4HpgAAAQAUdNM//MUZA0AHA9IAAAGAAA4HoAAAAwAQU1F//MUZA4AJANKAAAAAAA4ApQAAAAAMy45//MUZA8AIA8+AAACAABIBoQAAEQAOS4z//MUZA8AJAM2AAAAAABAAlAAAAAAVVVV//MUZA8AFAKwAAAAAABQBUwACAABVVVV';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;