import { writable } from 'svelte/store'

export const locationInput = new writable(null)

let onPlaceChangeCallback = Function()

export function onPlaceChanged(event) {
  onPlaceChangeCallback(event.detail)
}

export function whenPlaceChanges(callback) {
  onPlaceChangeCallback = callback
}
