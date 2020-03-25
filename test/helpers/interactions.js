import { get, writable } from 'svelte/store'
import { waitAMoment } from "./waiting";

export const locationInput = new writable(null)
export const resultingLocation = new writable(null)
export const externalValue = new writable('')

let onTestDoneCallback = Function()

export function checkTestResult() {
  const resultingLocationName = getResultingLocationName()
  onTestDoneCallback(resultingLocationName)
}

/**
 * After waiting long enough for any place_changed events to have fired, check
 * the result of the test.
 *
 * @returns {Promise<void>}
 */
export async function checkTestResultAfterAMoment() {
  return waitAMoment(1000).then(() => checkTestResult())
}

/**
 * Get the name of the resulting location (if any) selected by the user's
 * actions. If no location is currently selected, returns an empty string.
 * 
 * @returns {string}
 */
export function getResultingLocationName() {
  const resultingLocationData = get(resultingLocation) || {}
  return resultingLocationData.text || ''
}

/**
 * Pass in a value (the way a consumer of this component would).
 *
 * NOTE: Since the ability to pass in a value is to allow situations where the
 * Svelte code using this component needs to inject a location name into this,
 * calling this method also sets the value we use for storing what the consumer
 * has (aka. the "resulting value").
 *
 * @param value
 */
export async function passInValue(value) {
  resultingLocation.set({
    text: value,
  })
  externalValue.set(value)
  
  // Leave it there long enough to see during the tests (minimum: after next tick).
  return waitAMoment(500)
}

export function whenDone(callback) {
  onTestDoneCallback = callback
}
