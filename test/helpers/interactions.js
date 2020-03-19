import { writable } from 'svelte/store'

export const locationInput = new writable(null)

const onPlaceChangeCallbacks = []

export function onPlaceChanged(event) {
  while (onPlaceChangeCallbacks.length) {
    onPlaceChangeCallbacks.pop()(event.detail)
  }
}

export function whenPlaceChanges(callback) {
  onPlaceChangeCallbacks.push(callback)
}
