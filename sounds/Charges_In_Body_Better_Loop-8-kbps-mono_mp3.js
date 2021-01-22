/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//MUxAABMAapQUAAAiYMEHCB9umKAuUj//MUxAYD6DagAZkAATPLdpn6Hs7ne4Ll//MUxAECsCasAdIAARHNAmIDFDSSBVLK//MUxAECmDaYAA5EBKzQO/PgiK9mENXC//MUxAECmDaYAAZMBGx7w4h4pncDtSrO//MUxAECgCaMAA5wAeSUH5DRqbHHe7Vu//MUxAIC2DaMAA5GBUAm6GnwuwlDFPXO//MUxAECUCacAAZeAaG7qBNQ6CVJ1cKc//MUxAICUCagAAYyAOnRdB7LYWtVxDA///MUxAMCODasAAPEBIA7ZLuw7t3DxQNX//MUxAUCeDKcAAY0AE/hhnVXy3QBmklq//MUxAYCKDKkAA4EBF1cSt8OJoM9fLtA//MUxAgCUDaUAAZEBCoqE1dD3h5cLpB9//MUxAkCKCacoAYeAc7lc6lDyWMZpB7K//MUxAsCeCaUAA5wAeyQ8iH/qcAWyux4//MUxAwCQCKYAA4yAc2DsSM6Zxmq1Mmb//MUxA4CkDakAA4EBIgccHvJneAy3pBy//MUxA4C8DqQAAbMBIBFiioYtyKBLsqU//MUxA0CsDKgAA4GBM7nA0KfwlClNd4w//MUxA0CqDaUAAaGBdHtHDsJ7YDWZRMZ//MUxA0CoDaQAA5GBVAp5NJt1W0q1Nmk//MUxA0CSCagoAYeAYQCayzM5BeNzyiJ//MUxA4CuD6MAAaEBOYnaHA3II/S3VOI//MUxA4CqCacAA4yAVPs5+8Isbkl3V8A//MUxA4CqDaUAAZMBXYaI9tvcHj5ozVQ//MUxA4CeCqcAAvyAUQ+5m5DnQBsMUPo//MUxA8CaDaYAAaGBAwJwZ2DkAdA69hH//MUxBABsC7x4ACGBxJK5BZr5Y94l/bh//MUxBQCmDaQAA4GBB7CVm8gLmSy26Aq//MUxBQCcDaMAAaEBMsD7Awzh7coO8m6//MUxBUCYDKcAAZGBJABgNE89gDU3cNm//MUxBYCeDaUAAYKBXOoarq4AwoAwDAQ//MUxBcCQCakAAPwASvNWs7kGm3ISXTT//MUxBkCWDKgAAZEBaNq5kNnT2hIvhlg//MUxBoBoCLt4ACOA7ktyyYAA+BvSyJV//MUxB4CcCKgAA4yAc4AQsMln3KqTEFN//MUxB8CqDaMAAaMBUUzLjk5LjOqqqqq//MUxB8CICKkAAveAaqqqqqqqqqqqqqq//MUxCEByCqEAAmSAaqqqqqqqqqqqqqq';
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