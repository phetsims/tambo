/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//MkxAAG4FqxgUkAApABvhn85+aMMEiYXBMEw22oKxWjmBAwUDHieQXdLqJf82FQ//MkxAcJaHq0AZp4AJIlOttxOkaNWDNvMdIQJVwhzH5BZYEbeO6Y9nRLlkIKkAOf//MkxAQIYE7GWdAQAI/H9anW9SZiMaOcVg1QOM2PxUJOpTeiQ/l7+v/+ikBhhcZm//MkxAUIyHacKgGwCItOOp2zkQNfF3WJUCKCYF10cos0/K4E//////1dNFU17rKJ//MkxAQIIIKgIAMwDRaiJbikLSL6qMm1VHUEznGgUCnS6TogyZoJbPkVHRAEcAAI//MkxAYIQJLBuADeEpRQiNr0bGP+EtexmnjF3isJQQxAisnHDW+Jqi8e/pjk7B0D//MkxAgGwIqxQDPMwMBpnywrf7CmA/BwAMBYB8ZACScWOQq4DACTkvy6qqqq4Olf//MkxBAG6ILyWAGQErA8C00o4mhQO1//Uh4AMz0xIoVbLuVsYMCAUiEJEpda3kU5//MkxBcHCHKlgB4eZZZ8wspNVS/AXJ3TAgIjrVEpQc4jNZ3UQEnVnjkFXemkYkZx//MkxB0GQIa9oBPOZgx4MAm4AHQExDpMyB2kOg4VWQX6q0mr++cBIjPoO5Q0p5Tn//MkxCcHqIZwAB7GbK/ifZoUqAq9UiuVE35sfSvC31W2AZYAWUAB4yZDwr+VV9jG//MkxCsHcIZkADbKbPg+6QkUKVl95iNdRrl/UmoAXYACK4+ibfMacJK2AL1FpTaq//MkxDAHEG5seB5WZFNMhKKecZYvi9WOuh4hGR7ruY+4nDw2M4PaMHZkno+1mnhg//MkxDYHCG5seDaQZA5Up85LBDtAFP29tIhoIZBwumg6fFQ/3uZ9O3///9CdCgBR//MkxDwHgIJQAGaWhEACGw0rWnUxJAHgDNXNInZ64+B7Ee9qe3//////+qoDUPsD//MkxEEG2G50eASWEicxcuZ/+tIlI0jY7ZpY4cM63UQ+Jhs6rY3////93+oAXWyC//MkxEgIEGpYZkZegACokKs1wdfVDMFiYiSpY9dx1+okzY+dSnpbV3Vf7qf//pq9//MkxEoIwII8EGZGiIGyUtP8c1Jt3DJwkeobnopTWWRQVa49////+z7emcq6GlKG//MkxEoJYGpAfEByQAZ/UAzD5ZSCjFh4Z37P9PX6PA3M//uT/ZUJIALe/KhJE2yt//MkxEcIsIIgAF6UaIpo29KOMqQQ9tv/Xt+vu0Nqol2s79Z3/9H7cch0XataB7Cy//MkxEcGWEZBcghSDp5EWPvnQu42ocqCzWS2lBderI6kanp7f/2+70VfsGY1bEsQ//MkxFAGwEYkUAgUQPaRww12swqIF9DsX2Bin1bv+ynen391W2z2H768hfMM/iIC//MkxFgG2EYUAAAGDCtk/7OTp3K/R+z1lP29ViU8ZqJEKlqVgAAUXvX//vf///6f//MkxF8GwAIeUABEAOvuW5r9lQqGav/GR2/qTX7ecRDTVKVDeINTgNCEuV+HiCij//MkxGcG6AIiWABEmKqf+aZW8/1tu5Gqop9kKdOI4j4HFh8YC4gQgm4XElEsgliA//MkxG4GqAYdmAhEAtLy6q7Bezd6raava1qv/3/2IKurfahNtyQJwIBTytFT55Z0//MkxHYFUAIaQABGALe3U+RWGlhr/h3/uV/9+SVMQU1FMy45OS4zVVVVVVVVVVVV//MkxIMGkgoIAABHgVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkxIsG+hIEAABHgVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkxJIHAAIeWABEAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkxJkHIAYCWABGAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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