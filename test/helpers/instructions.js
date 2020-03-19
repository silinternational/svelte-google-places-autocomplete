import { writable } from 'svelte/store'

export const displayText = new writable('')
export const displayTextCssClass = new writable('')

export function showText(text, cssClass = '') {
  displayText.set(text)
  displayTextCssClass.set(cssClass)
}

export function clearText() {
  displayText.set('')
  displayTextCssClass.set('')
}
