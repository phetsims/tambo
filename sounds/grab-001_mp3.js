/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABPABRVQBABFhFy03HrAAmYH5JpJDhYnHEHKDCz4nB8PqEYfyAPvnCgIRO9vV+sPlz///q//ictEAAQggRBwMBkBANgCjyAudzaebLxCMKWOd7AMMIKWKLAgE0dzN6IktJ3Z0n2dMz5e0wPrX9wcMC1BVGrnrZ/eaVRvHMz9z13uONVXxMoid8wPNbP9S/Fn19hIAAJEo//syxAOACGRfX7zBgAEEJGu0YI7p4BcWnxoVkARD6xKXGR0Sl0C9QFwVUyEkJq4ki4pRp7ECI6wwsHhK+ZNkr2Cx5pNKKDrHLoeuHCCTX2/1SNNggAAAAGiaDgKAUdALNnFcimgZz/3NY/6dua+u6auw05NDV13swfiKp8vv8hf/OXNb888jog7FMoQJFeBzIFOq/m1eiiTbaGDEZf/7MsQFAAi8nWOmBHRBDpXsNp4wAFIwnGAfDyOcp19y8bnR+YvrYjHeeXe3D9xckoBMXC6vacn9kEnJznf7gp4e4JiaRQoXoZ253fZaQPObN7NbRAottNLj6iHCT435TJfhWGSpISlhOEZ7CAowGubCChoU6GEiUNPfeV7fNhsrxWKX+H5fkZ2mNucBbv0SvQpr/G6agLsiqTEvC0n/+zLEBAAImIVUGMSAAQ2IZ/OSYAACCSvjWHVrHYsJiRI0kRZa8IqyjvTvI7JFJpSRy9/nH2zeemE8pfTAAA4hGlhMEHRR1n2h2GYywVAP9d2oSSrJMQvSHkAYAQAgNGlQRJrihQilCKRTpEAhITLV/6okkeDcFXA0AgagrywNOEQNPwVOluIg5wVgqCviIO/5YFQVDVUAAAiJkAAA//swxAODwawA28AEYDAAADSAAAAEAPrFRUEzSkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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