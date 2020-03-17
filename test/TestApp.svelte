<script>
import GooglePlacesAutocomplete from '../src/GooglePlacesAutocomplete.svelte'

const options = {
  fields: ['address_components', 'geometry'],
  types: ['(cities)']
}

let displayText = 'Please enter your Google Places API Key'
let googlePlacesApiKey
let locationInput
let onPlaceChangeCallbacks = []
let testPasses = null

window.addEventListener("unhandledrejection", event => {
  event.preventDefault();
  
  testPasses = false
  showText(event.reason)
  locationInput.blur()
}, false);

function onApiKeyProvided(event) {
  googlePlacesApiKey = event.target.value
}

function onPlaceChanged(event) {
  while (onPlaceChangeCallbacks.length) {
    onPlaceChangeCallbacks.pop()(event.detail)
  }
}

async function runTests() {
  locationInput = document.querySelector('input')
  locationInput.focus()
  
  await waitAMoment();
  await runTest1()
}

async function runTest1() {
  return new Promise(async resolve => {
    showText('Please wait')
    await type('new')
    await waitForSuggestions()
    showText('Please click on the first suggestion')
    whenPlaceChanges(() => {
      testPasses = (locationInput.value === 'New York, NY, USA')
      clearText()
      resolve()
    })
  })
}

async function waitAMoment(milliseconds = 100) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function type(letters) {
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
    locationInput.value += letter
    locationInput.dispatchEvent(simulatedEvent)
    waitAMoment().then(resolve)
  })
}

function showText(text) {
  displayText = text
}

function clearText() {
  displayText = ''
}

async function waitForSuggestions() {
  return new Promise(async (resolve, reject) => {
    const timeoutHandle = setTimeout(
      () => reject('Timed out waiting for suggestions to appear'),
      2500
    )
    let suggestion = document.querySelector('.pac-item')
    while (!suggestion) {
      await waitAMoment()
      suggestion = document.querySelector('.pac-item')
    }
    clearTimeout(timeoutHandle)
    resolve()
  })
}

function whenPlaceChanges(callback) {
  onPlaceChangeCallbacks.push(callback)
}
</script>

<p>{ displayText }</p>

{#if testPasses !== null}
  <p>Test result: { testPasses ? 'PASS' : 'FAIL' }</p>
{/if}

{#if googlePlacesApiKey}
  <GooglePlacesAutocomplete apiKey={googlePlacesApiKey} {options}
                            on:place_changed={onPlaceChanged}
                            on:ready={runTests} />
{:else}
  <input on:change={onApiKeyProvided} />
{/if}
