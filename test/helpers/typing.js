import { showText } from './instructions'
import { locationInput } from './interactions'
import { get } from 'svelte/store'
import { waitAMoment } from './waiting'

export async function type(letters) {
  showText('Please wait')
  for (let i = 0; i < letters.length; i++) {
    await typeLetter(letters[i])
  }
}

async function typeLetter(letter) {
  return new Promise(resolve => {
    const simulatedEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
      data: letter,
    })
    get(locationInput).value += letter
    get(locationInput).dispatchEvent(simulatedEvent)
    waitAMoment().then(resolve)
  })
}

export async function hitKey(key, charCode, keyCode) {
  return new Promise(resolve => {
    const simulatedEvent = new KeyboardEvent(
      'keydown',
      { key: key, charCode: charCode, keyCode: keyCode }
    );
    get(locationInput).dispatchEvent(simulatedEvent)
    waitAMoment().then(resolve)
  })
}
