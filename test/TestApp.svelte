<script>
import GooglePlacesAutocomplete from '../src/GooglePlacesAutocomplete.svelte'
import { displayText, showText } from './helpers/instructions'
import { locationInput, onPlaceChanged } from './helpers/interactions'
import { runTests } from './helpers/running'
import tests from './tests'

const options = {
  fields: ['address_components', 'geometry'],
  types: ['(cities)']
}

let error
let googlePlacesApiKey

window.addEventListener("unhandledrejection", event => {
  event.preventDefault();
  
  error = event.reason
  $locationInput.blur()
}, false);

showText('Please enter your Google Places API Key')

function onApiKeyProvided(event) {
  googlePlacesApiKey = event.target.value
  showText('Loading Google Places API...')
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
  <p>{ $displayText }</p>
  
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
    {#each $tests as test (test.name) }
      <tr>
        <td style="width: 45%">{ test.name }</td>
        <td style="width: 10%" class="uppercase {test.result || ''}">{ test.result || '' }</td>
        <td style="width: 45%">{ test.details || '' }</td>
      </tr>
    {/each}
  </tbody>
</table>

<button on:click={runTests}>Re-run tests</button>
