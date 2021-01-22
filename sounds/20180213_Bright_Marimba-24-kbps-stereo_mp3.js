/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//M0ZAADfBtyPKGAAAMQAxpBQBACQVuaA3cDA3OBAMDA3B8PlHMKOfy4f0hgp/L4IACXa0Dy58Pl6jkHzSpExjXFUHOZA/KG//M0RAoDPI96AMacAAaBHvQBjSgAVdLbn6bf////qC43wWt4TLMY/xdCnMhSjKur8A6jMFQxv////AV/Ab4rBAlEwAOA80RQ//M0RAkDLIeFLOOIAYX4avZZyhACKfNW/84LEWNS3/////g0IKCA4BKAKB1IQXQEH83PT+RMoGj1///IiJVAB6ubBYDWokAC//M0ZAoEMI95LCgCoYOJFsQAUA7sTO75Ap6v4XQoR0flHQ81VX2/+oxwNl8fi4Bkx2v/+MR3/wIgGmJAGWu3ZQDasdQVM/rc//M0ZA0EdI1vLEkCOQPgasCoAsQG4o0lJW+eQyK5wYnoaUn80xC23//5wTjk5JQyWe6Gozf8V///iUxVQAljlwkA0oFcA4/s//M0ZAwD8ItvLCgCoQLgIrAAAh4ASEVC5qt4kjjKabZDXp7unT/oIHdQnFHQcR/E7f//6wQZIrQHQPQKKBlRVQmYitjq0f/+//M0RBQCsA9xLADNAQUwbqQgDoQELopjw66pyALeS8KEeUx+rdhjX///hdUABSOQBwD1i4Ff7uUg59/6BBiLNsQs//8JI/N0//M0ZBwDOD9nLDRoNQPwZqgABgQEBdLyYqCd//gzt3//4lXQK54ZMD3gg55cQPlVnPo2/LBdSRV//gz/dUeBd4vSgnd1f/hQ//M0ZCUDDItMAFAChARYaqAABgQER9n//60AByKSBQCYIEAhb2KqMWX6AQAM37v/yxxW9RMwsce2QPGJtl/qGf//8soACfL8//M0ZC4DFDVlLAFlAwQwapgABg4EB8DHQBdJzvKJIog8/oCWGBqEf//ajDtKGRfzruuyP/GAQ1///toBtqQC0Dqj8Crekt3Z//M0ZDcDMDtdLAIDBAQAapwABgoEl3t50sdkbP9v/qMddqrgMOehC6N/woJJ///lqpQmb0AEvOJTCYTtSKDZ0gSaqvbf+0Qj//M0ZEADLItg3DQCkwO4ZpwAA8oEQeZ//+JPyjYcaV6UqRa8/+IBo9MIy0XADYDCIINVLUR/4qIoGf//4bxagYUFPgRtKNRi//M0ZEoDkDc+AA9mBAOYapAABg4ELY6q//yQJjl///2qoDxf8LMHdO3LlWKwMTUlRDvhEJRPdA9JERAodlrOIQFTBOdn2zX///M0RFICkDdxLACnAQV4boQADlAExAJMi14gPDuaBaEFK4kxBDQzTQps9NH5esg3/84zw5KCohbwUQFk9Cf//81VDBRiXkQ6//M0RFoCrDU8AAsnBIVoangAFlAFIJJwN1eC4UVoMgMcN6aF0vbVdhYy6pabv/8GJMO1VtnHOrlS5R8hUT/B1f//0P5T0Lfh//M0ZGIDRI1IeFAChQOALnwAA8wEQsPSlQ4pRLas1hzwkdhNcSXf8h8AaTirWXH8e3//ggeQoOzMUE7EaICm8Ir5c07//+Qq//M0ZGwEaI00CFAChIQoangAC8oEBqEyxKZhkVAAPOGEoUGCAQFAhZmX5g8Q4asQ9Xq/xf9P9AxAYYUQAYo22Jr21f/geNpV//M0ZGsEjEMsAGzPNAS4PoDQDgwi4VRiqypnpjUNJewwoKokR/P+gCBAX392n/j/66ofAiJ7c69E1UlzGXP/isvOf//7aqDM//M0ZGYERDs2LAdCAwPYZnjgA84NVE7D85SwgGfjEi3OOVt8iDcJf//1oR4BugDyZl3Ws1Ef+FRY///+qtIlpqWHgPs1+uoG//M0ZGcDoDc4LAcoAwUQbmwAPhYgiIX9sEBDe9GsmYBo3gqr7f8KqvyA/xTBZhHID4UpWqhf5QFDsaAYHWXSBBVEut9V+N////M0ZGgC5DUwAAcqBASYangoA84I/rrFcrpinq6Dj/kyLsUdv1t39ygclGFAFAFGoExUZBs7Z7vR//y3/+VqjQQodFnmFDOj//M0ZHECSDU0IAciAgLQZnggA8QEE2NLXZCT+M//U7/+gEHGYSTW4QDtPkEaagMMCEtSt4QkBy8BGUjPdV/iAXOZR//6YAkA//M0ZIYCJDdAcDxqJQQYaoTwiARmBh9sND9xP/7v9XyX9VUEATaCCaFBvjRj0u6n9/HPa4cqj53/9FWIEKAFH8eV19K5aI3z//M0ZJcCkDcmAAcGAoSwHnkYAVgC/gcx1MCmHKJHIipCgbTshW5znyN1P3f6+nv+3sAgAHAGAzEyv/+v//9VZSArtVEEyBU9//M0ZKICsBE2jARPAQLwImzgAJ4CPBQQpf1zv///5LOBOAUNAHQxusER7ljyP///578FQ0oAGWApVBkVFRUUmqaam8VFutif//M0ZLMC6DUiKAcnAgP4HoJYCAwCiopxYV/+LBISGh4oLN/////4uK1MQU1FMy45OS4zVVVVVVVVVVVVVVVVVVVVVVVVVVVV//M0ZL4C5A8sjADvAQRwcjAAA9AIVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//M0ZMgDEBEk3ARvAQNIInW4AEQCVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//M0ZNUCaBsGEA8DAwVILgQACxgAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//M0ZN8DPACpGAQhAAMwATwACAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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