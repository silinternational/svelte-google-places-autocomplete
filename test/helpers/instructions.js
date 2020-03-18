import { writable } from 'svelte/store'

export const displayText = new writable('')

export function showText(text) {
  displayText.set(text)
}

export function clearText() {
  displayText.set('')
}
