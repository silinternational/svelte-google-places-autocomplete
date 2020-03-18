<script>
import GooglePlacesAutocomplete from '../src/GooglePlacesAutocomplete.svelte'

const options = {
  fields: ['address_components', 'geometry'],
  types: ['(cities)']
}

let displayText = 'Please enter your Google Places API Key'
let error
let googlePlacesApiKey
let locationInput
let onPlaceChangeCallbacks = []
let testPasses = null
const tests = [
  {
    name: `Type something, see suggestions, click on one`,
    setup: async () => await type('new').then(waitForSuggestions),
    go: () => showText('Please click on the first suggestion'),
    passed: () => locationInput.value === 'New York, NY, USA',
  },
]

window.addEventListener("unhandledrejection", event => {
  event.preventDefault();
  
  error = event.reason
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
  
  await waitAMoment(1000)
  for (let i = 0; i < tests.length; i++) {
    let test = tests[i]
    try {
      await runTest(test)
      test.result = 'pass'
    } catch (e) {
      test.result = 'fail'
      test.details = e.message
      break
    } finally {
      tests[i] = test
    }
  }
}

async function runTest(test) {
  return new Promise(async (resolve, reject) => {
    await test.setup()
    
    whenPlaceChanges(() => {
      clearText()
      test.passed() ? resolve() : reject()
    })
    
    test.go()
  })
}

async function runTest2() {
  return new Promise(async resolve => {
    resetForNextTest()
    
    showText('Please wait')
    await type('new')
    await waitForSuggestions()
    
    whenPlaceChanges(() => {
      testPasses = (locationInput.value === 'New York, NY, USA')
      clearText()
      resolve()
    })
    
    await hitKey('Enter', 0, 13)
  })
}

async function runTest3() {
  return new Promise(async resolve => {
    resetForNextTest()
    
    showText('Please wait')
    await type('new')
    await waitForSuggestions()
    
    whenPlaceChanges(() => {
      testPasses = (locationInput.value === 'New York, NY, USA')
      clearText()
      resolve()
    })
    
    await hitKey('Tab', 0, 9) 
  })
}

function resetForNextTest() {
  locationInput.value = ''
  testPasses = null
}

async function waitAMoment(milliseconds = 100) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function type(letters) {
  showText('Please wait')
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

async function hitKey(key, charCode, keyCode) {
  return new Promise(resolve => {
    const simulatedEvent = new KeyboardEvent(
      'keydown',
      { key: key, charCode: charCode, keyCode: keyCode }
    );
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
      5000
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

<style>
body,
html {
  height: 100%;
}

.error,
.fail {
  color: red;
}
.pass {
  color: green;
}

th {
  text-align: left;
}

.uppercase {
  text-transform: uppercase;
}

.ui {
  height: 100px;
  margin-bottom: 20px;
}
</style>

{#if error }
  <h2 class="error">{ error }</h2>
{/if}

<div class="ui">
  <p>{ displayText }</p>
  
  {#if googlePlacesApiKey}
    <GooglePlacesAutocomplete apiKey={googlePlacesApiKey} {options}
                              on:place_changed={onPlaceChanged}
                              on:ready={runTests} />
  {:else}
    <input on:change={onApiKeyProvided} />
  {/if}
</div>

<table style="width: 100%">
  <thead>
    <tr>
      <th>Test</th>
      <th>Result</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      {#each tests as test (test.name) }
        <td style="width: 45%">{ test.name }</td>
        <td style="width: 10%" class="uppercase {test.result || ''}">{ test.result || '' }</td>
        <td style="width: 45%">{ test.details || '' }</td>
      {/each}
    </tr>
  </tbody>
</table>
