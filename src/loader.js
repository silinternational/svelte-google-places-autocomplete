let isLoadingLibrary = false

/**
 * The list of callbacks, one from each GooglePlacesAutocomplete instance that requested the library before the library
 * had finished loading.
 */
const callbacks = []

function hasLoadedLibrary() {
  return window.google && window.google.maps && window.google.maps.places
}

/**
 * Load the Google Places library and notify the calling code (if given a callback) once the library is ready.
 *
 * This supports three scenarios:
 * 1. The library hasn't been loaded yet and isn't in the process of loading yet.
 * 2. The library hasn't been loaded yet but is already in the process of loading.
 * 3. The library has already been loaded.
 *
 * In scenarios 1 and 2, any callbacks that have been provided (which could be multiple, if multiple
 * GooglePlacesAutocomplete instances are in use) will be called when the library finishes loading.
 *
 * In scenario 3, the callback will be called immediately.
 *
 * @param apiKey Your Google Places API Key
 * @param callback A callback (if you want to be notified when the library is available for use)
 */
export function loadGooglePlacesLibrary(apiKey, callback) {
  if (hasLoadedLibrary()) {
    callback()
    return
  }

  callback && callbacks.push(callback)

  if (isLoadingLibrary) {
    return
  }

  isLoadingLibrary = true

  const element = document.createElement('script')
  element.async = true
  element.defer = true
  element.onload = onLibraryLoaded
  element.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
    apiKey
  )}&libraries=places&callback=Function.prototype`
  element.type = 'text/javascript'

  document.head.appendChild(element)
}

function onLibraryLoaded() {
  isLoadingLibrary = false
  let callback
  while ((callback = callbacks.pop())) {
    callback()
  }
}
