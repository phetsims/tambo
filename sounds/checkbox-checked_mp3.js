/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../chipper/js/grunt/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../chipper/js/grunt/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//twxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAARAAAWCgAPDw8PDx4eHh4eHi0tLS0tLTw8PDw8PEtLS0tLS1paWlpaWmlpaWlpaXh4eHh4eIeHh4eHlpaWlpaWpaWlpaWltLS0tLS0w8PDw8PD0tLS0tLS4eHh4eHh8PDw8PDw//////8AAAA3TEFNRTMuOThyAc0AAAAAAAAAABRgJAZTQgAAYAAAFgoMxGP1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7cMQAAA7gbOxVvYACW5Fntz3AA5QAAyAQIBEys3MtCTFFg5TGPm8D3KgDTJuEccMxAZkMFHzKy0ykhAROIho0JQOFfTbU8iRzFi4zYwMgBiUFMRDxoHLdpJtwSEMGBAMAKWRFL8swriCVA0i2X2oxYpIxKJZScr2+g+8oCBQ5//5cP////y4P/y4fgEAoFAoFArLYAAAAAAMDYCMx+k2DAeA6MFEIcGgkCIdk1vDGDNcO0Mt0zUwRA+DC3HiMGkE03THtDaEMoMFkBAwKgmzBaBoMAgB8+fQzksxMVigyANDAggAQJN9mcHA4kFpgsEJllrRoCrC05kkQjR0MTisME7eQcphFoRHX7nUoy4CvF0UrhPiwWUy2x/P/PDDn/jLuqAGAAwDcEMMCHBhjCbwtwwKoHpMM+Ev/+3LECwNSzIkWXf2ACj+QoEXu5SkzE0he0zdxYLM8SH/zF7hbcxLcKaMHFCGjA5wQ0wSoE1MK+B4zAZAMwwDwDJMATAJjAxgRc1J/MpODbWY3W8MeEjJxMAAiO5iZUAhUFAIqBAUiEh4OCQSGGHArEVNUyE8wYKmTDJZl8pVXx5IYtUr673fO8xs0t7Ptb8bKV8UnuCIwTR2DLDFMMHUaMyDhPDIsI8M4ME00OMfT/wfHOBoKcxZUYjP9nDXBIzYicDQuIjXdjAyITWM0DiVnjL4Gza8sjHUVTPsCDQw/wMRJhEBZiGHIYMQkLaKoVCMsAmkcYk5vHm0AIAwSGW2TdCGTMcMMCMLyVipZcplALqSm/DURt95nlTdZjvOYyWrK46xN9WogBoCswawJDJACtMW4KExLSlDBsP/7cMQKABFIgQI17gASa5Mjaz3QAE3NLvnQ3agRDJ+DSMbgYExaABTE4EHMFIM4wwBnzAWAVMBYMAwgwkjBjDYNAKwyiLzEKxPMXsGB80aSkKDAQoMWgYtinyYmCYwER4ElzUrDHIBWSrc/T4pDAoBCwVZK7mOFNL3Wh2NUzOn6m+548/kht9JTqojAAAAEgMQKAAAAAAMA8A4wNw8DAgA9MMUIcQhtmGeEGYMAu5gnAomMSHcYCYNBkVBSmS+F8YBgAgGBJMHEU0xtw/zDiLVMxpn4xFAlAGbDnGZJgUfrl2aOjomK8jJwUMhgGABhAFRgKCwUAAu8k437py0SDRp6lj8Bgoski0Ff+++iWkItSgfwrAOkgGWY5f//9ne//7luZoyn9dUFRgAAwIBIw5CYxaOMxUGsxfH/+3LECQNQPJcafd4AGmmS38XvaShMaMQ29Y4HAKZcCMZWigIzAMzxoCgAmHoLiMUTLISzNunD5V0TlJYNXoQzCHBY5jACC4TFgiporE9rpO005iSiseWg60bdWG2ove12Uw7EwqDm/fmUQfYtQ1TWX9eWHZbQWm53a2WrVWZlFN+rfqa0QwzxGjEDGKMJIO8x+AJDCjO1MnMPU5+nqzFkYHM2I20x3iHDBzC1MLsZsxoAeTD9CsMMos8zVDZTN7EePxtJIxYgyDGTB+MPIHowBgGTADBbMMwC8wdAHQgAQwVwPlFxQBAwLQIhICgSXHCUCJKDiKuU7VAVVa7EVuui/6eCOSJLoN/GpSyzj/3aWls7w7EMufvur0t//tfyepULAAMFIm0wPA7iZsMxzQnjI4CXMkIcc3s5sP/7cMQNA1L0jPxPeylKLhGfRe7lKDdTH5GhojDABOMIkYUwNAuTGYGZMKEnMw5RgzDsMvEZsZsuJMGB0IUYbAIphfgdGA+DCYBQfxg1gImBWBMEAOBYBwwDQDk+ESQCASVEjLWMJA2YUAyFiirR2rNnEhGJxRfAMVSYa/K2uxFLZyY9ALryyBa31mHYXsse6+il0QwGAzDEVK6Mc4xQ1IgzDF9B6Npko4yElYDF9IGMnoGwzaSlzxAXzJ51TMYUjdJ8DBIajEz7j4TjDtTFTBaNDKoJjJgVzEJnjFgLzHoWzDQMkaw4TjCgBWmR1ahgHmUObQZ8uBw7/U0NqvX+pi6cMMwCwctZS8lLVXbAUvfaFYaw18B8s95/3a1C+7SqDQADDyGiMrE1QybhITRuVZMKYroyWRTTQ3b/+3LEDQNTCH74T3tJQjOQHwXu5Si1MVYJYyuCnTBmGJMjAKYxKBBjIpHGMVQW4wSBIzHZFRMfdJYzSWXjBrIzMVMOowVQNDBMBfMGAIgGgSmB+AQYB4BKSpgOgCl60STAJAMSVLUGTUnWAwajZPLzVYFySQT3UkGQ6NCofaHDjAkvl+bVW7N37Eb21jAJBdgiffpIYRJMhhFhymNmUUYqY/ZjKjymScW8Y71jZoaoamSqPyY/g7ZnyZZqs8ZmwAx0bSJoXG5vMPJqs3p0j/Jw9JBnWLZq8XZiURphEEQADswVAYwFAQOBwFCwVgaYCAmFADBzYWVPRM3HVLKFzKN0gqUzemZ08y1KNesWma1u3LoakFNh3fx+zpihGmJDu/TVMLUYcyLB+zDTE/M1MgwxgQCTATHNNNW0U//7cMQMg9AYfPgPdylB/o+fQe7hKIkx/DKxKGMy0GoxzTkzcQUzPL00cgQxnZE2mVszgdQzBtM+2AUoKExLAIw9BowtB4w1AQwBBdwQCAxgcCaM4YBCYYkcYQhmxEb0NsmWO6CQ7cnlzmGVwfbmMrP37m5XO///yImYwX+swEB1zFWAWMc8awx9hSzC7C6MewRQ0GiZTadBbMQIRAwOwDTKlXTF1CTLoWjNlbjABMDFJpTCYtT8PIjhwBjDoOAcWhhEEBiCHBhKAwCBAKgqYCgQEAE10MAWSgU5QMG7DnqBsEbG9bNYam3/ksqrXI7d3nQ473nqxvWM8fyYgQolAAMEiHMj0fMTBTM7hoMvhYM9yoMQfQONUNMoiqMESlMJ8AIwfgbzBJBwMMUUUwjAUysDkwNhdDQWDAP/+3LEHgNPbHz+TvsJQeIP30nu4SgDEBEgBhMCgFkwEwEgMBaYAwBCsZWAQzoeAFh9oDBosWZZ0LTk0NOtK5evtb8vns4frSrDV6rhn3mX/zKODLkHIYMQCZgYhqmFwEcYzALBhAg4mG8CAYlrfxg7BhGKuICYF4LBiUM5g8BQMJEzID40bL0xKLYwMmw4t98yiHgzdD8CDkYIBekWYFgqVQAAoAMrCArac7zC5UWADFYMl8ifyiVpZWwyXwywCVyOzey1PX9V/z//1H/TAAAI4AAETSCErTTotzbsTzLs7TNkMzIS0D/pmDHkmTGkczAbByMI0DcwRwAjCZGUMH4AYwoAJjAVFvNh8TgwgASQIAgYHQMpgFgSIIjAXACFgCYeVgMAQBqILBBYAFpTPXTJwz0sdqHWvJOiSP/7cMQ2g0+4fPsu+wlB2Y+eye7hKIdobk7bu6z+13Udv///8x+mpDCjDRMUgCYwUwpDANDLMGcOowyg2jOzJmN+IQoxdAhzDyCdMICkARmmCgImaagmVALmeBoGE+hn+zWGW4/GFgpGG4qFA7jIXiwhLbXYyUKAfF0BSwCg46JXxma6jiKft27aeM5Fnpj1q9Pd/LDOknsP/907tSpADB2CLMPQNoxExQTBCD0MLUPlQwxUOHTr4OtMWsSQwjwjzEJI+AgbpgECSmL0IiYPIIphSAIjxVJu+FmmIeDMYRYOJhPgJGCMBmYB4EpgSAIgoBNEhpw4Ak7jJYAjTP0bAkOG4Dzjj+kISMEUfaki+/1hnhVxgrX//fsv+iBgajjmG8RwZrYgRjCClGBKOgYxwnZii/hmhECgY3z/+3LETgNPqHzuL3spQe2PnYXvYSgNZheg4GK8BOYSgNJhJCIGCQUAYCYMpgyBvmFccYamYOZgDBbhA8RMD4YKYFxgfgWkQDqJCMsFmAUAWrC2VlqYMsCswKppandmgl6WiSMtrfH8prP+5f2anP5//TUwVAaDD0CMMJweQwjQ9jAPBtMvkZk1ysPTdxSzMVkN4xXBYjFLFDHhJTC/BeMYkdUweAJTDKDOMWMc020wDDGGBYMJ8NgweQSUEBgTAamA6AqWRDACBYC0OAebm7ZaFbzgraK/MkcnCWwIl8pvUlUkoMovLcua7lE6L9/rGzQgwLhcTGACZMPoSwEAXmNoDKY/QtJpKfGH4mMuYdw4piNgkGMMBmsa8mOQmmd0OmT6tmD7PASyzt60jOIOzEgHjGAnzKYTTBEOwP/7cMRkA0/EfOgPewlJ4Y4che7hKaAxg2AZECwqApaCgaQLAE8CM5bM3BjTW4arsXJTj45+WRmmvYyigzx3qryX6TVVMAZAtjBIATMwaQB5MB7CmzBlwMgwVcG0MIsQsjIeQ9QwpA7zFxFcMJcBgw8QODBTBGMGoi4w5wlzDcDdMNgHQ06iITGJC2MCcAowBgYDBBAkMe3O4bQOeswgMSROo+8Rd52mMDQuRvhHbcWbq+dqhxm+WrEsAq7n7PIBgBhcmCsB8YaRRphEgWGMiEuYCojRn886GkoJEZ8l4ZoCQa8EmZokiYXg4ZrmwFx5MBQpMvnYP9XXMFCJMVQjMDCRDhKB4o/AEVAwQEGjoC+0AJZ9Whn4OGBTTfNq/EYmmFvf8vuV+3QKIrtLdaoABVmL0GMYzAsRkaD/+3LEeoJPGGLmD/tHCb2MHNnu5ODaGIuDSY9As5uSpwH1AV+BmHjCfE2M2ZQgyTyBgADSYxJWJiCCQmNgEEYgY6hjqo8GEoD2YAYNRg4BtGA4BKdKeCuwsPZ8ieX/WBLiIPqfGQCyVPWoTCI7C4S92FBjSfjcv48++FWulxdwaYAgAdGBYA0Bg+QY+YPOEsGBOAxpggAd6YPSpJmSmAyRgUoBYYH6ATmIKAeYeQmBhABYmVMFaYfQDJiiAxmLsPIZoiwZj+hhiEAwwIASxgA9WQwHgGFBEbEQCsAxhiKy5VXNhEKUAbzyCVU0AxqeszFypzeV+1lUxp/t1eoAQGKQAAwLgljEMBsMhsagwog9DDKAXBAThoRXkmn2R+YLwbhiKDKGPmKUYbAsZgeBOGLuPAYH4JZgdClGJv/7cMSYg87UbNwPe0cJ7o4bAf9hKeN4bVoJ5gtARGA+BwYAYGRg2gYGA2B4VAGwMA4UAByVWFyXtL+xAOqqsAlPplTVneeFaleIT1bDDLDWe/ufoMFUFgwDwxTAlClMAcW8xICNzCmCZM3pz86SyWjJYgzJQNjRiDTAoADJ0kzRIwTIIsTSAdzETNTQ7cjJADDNwLzDUJjAcIFTgLraA5zbN+2zTmVJjNTVmguE/uNS6XNBnPx3YuXbOG96rEXWOs//1f3p///7v0P6qgC4AFgSzBcDvMO8TIeJiBwPBgXhhGCO5QbAYRxi0J5ngVxhyaJkMDhh2HBieeIWGQzlCgwaOM/SmMz1A8xgDMAhMYWBSNZLRLxsK9a64KlrDKr0srbaUz+FmWtJbXH9739l1bm1ffH7f3JV3fv/+3LEsQBPmHDbL3sJQd4N2oHu4OD///X///fpIBBgLAWGCIHaYZgK5g5ATmCSC0YeIZBjkq5GU6LUZykMTGUYWjMYijEYIhcYFhIYNgSZDhKZBPMcfjuNBEUEEAhFUZJwSdMl9JaOKz5DjqhvcvHsVxjMbjCAqV6+9lyLbLv3a0X6ESHnjmkrTgX6ewW628bWpy6aAAAEIBKAAYVGgQJzEA7MHBAeERhQBG6YsEF4lDMeEoCAUYKgI6ZVAYEguZjC2ZGtMcWpghOAQLKNr1LwVPu2Wuurc61Zm1tOXWe/o1tDZJ5cXoLq47k/vbkMSqQ57UHqbUISVThclJqqsAa1V3dqUsXjENcTVSBUCQHmLDZKQCFtO+lwC+DVGKFZhA8Ck5ACX2THBAR54Dl4c+jQuNtZdZ7rPuOGX//7cMTJAk6AYtSvdwcB3graIe684Jd3Kc5TLcMqa1j+V2z++ZfljKYdvVqa/VlNNTWpkJR7VjzOVVd5NBQlGc8z5NIkUcNIozLbzkcqq84/8kUcf1PnK74dLEkq30DAFGtNIonJMclvNIy5wMFJGkUZk4lppFE4ldVr+qreaiclZEjO/scSJEtxTEFNRTMuOTguM6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqCQACQKKEgQswmgpKTiyiyizTjSizDzDy2eLzc/ypo0osoCEihIoDEA5BDcqWco0FBgUUBgQsQLAzjSizDzDy2drzcqpo0ov/+3LE5QJOoF7PjnWHApQz1oW8mbkoso404so8w+GdnZ4tv//+7VNSUWUWUKEihIELECxAoSBFmHxcNebNGlFmnCRQkCFiBYkUJFAYgWIFgZRZRZh5h9VVVUUJppI1VUxBTUUzLjk4LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7cMS2A9IFejpDGM3IAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBuffer = decodedAudio;
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBuffer = phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate );
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;