<script>
import GooglePlacesAutocomplete from '../src/GooglePlacesAutocomplete.svelte'

const options = {
  fields: ['address_components', 'geometry'],
  types: ['(cities)']
}

let displayText = 'Please enter your Google Places API Key'
let googlePlacesApiKey
let onPlaceChangeCallbacks = []
let testPasses = null

function onApiKeyProvided(event) {
  googlePlacesApiKey = event.target.value
  showText('Please wait')
}

function onPlaceChanged(event) {
  while (onPlaceChangeCallbacks.length) {
    onPlaceChangeCallbacks.pop()(event.detail)
  }
}

async function runTests() {
  const input = document.querySelector('input')
  input.focus()
  
  try {
    await waitAMoment(750);
    await type(input, 'new')
    showText('Please click on the first suggestion')
    whenPlaceChanges(() => {
      testPasses = (input.value === 'New York, NY, USA')
      clearText()
    })
  } catch (e) {
    testPasses = false
    showText(e.message)
    input.blur()
  }
}

async function waitAMoment(milliseconds = 100) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function type(input, letters) {
  for (let i = 0; i < letters.length; i++) {
    await typeLetter(input, letters[i])
  }
}

async function typeLetter(input, letter) {
  return new Promise(resolve => {
    const simulatedEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
      data: letter,
    })
    input.value += letter
    input.dispatchEvent(simulatedEvent)
    waitAMoment().then(resolve)
  })
}

function showText(text) {
  displayText = text
}

function clearText() {
  displayText = ''
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
