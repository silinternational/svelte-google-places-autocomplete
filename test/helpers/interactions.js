import { get, writable } from 'svelte/store'
import { waitAMoment } from "./waiting";

export const locationInput = new writable(null)
export const resultingLocation = new writable(null)

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

export function whenDone(callback) {
  onTestDoneCallback = callback
}
