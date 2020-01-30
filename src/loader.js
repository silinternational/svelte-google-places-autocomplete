let isLoadingLibrary = false
const callbacks = []

function hasLoadedLibrary() {
  return window.google && window.google.maps && window.google.maps.places
}

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
  element.src = `//maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`
  element.type = 'text/javascript'

  document.head.appendChild(element)
}

function onLibraryLoaded(event) {
  isLoadingLibrary = false
  let callback
  while (callback = callbacks.pop()) {
    callback()
  }
}
