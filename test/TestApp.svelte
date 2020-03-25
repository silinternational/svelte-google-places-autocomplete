<script>
import GooglePlacesAutocomplete from '../src/GooglePlacesAutocomplete.svelte'
import { displayText, displayTextCssClass, showText } from './helpers/instructions'
import { checkTestResult, locationInput, resultingLocation, externalValue } from './helpers/interactions'
import { running, runTests } from './helpers/running'
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

showText('Please enter your Google Places API Key', 'command')

function onApiKeyProvided(event) {
  googlePlacesApiKey = event.target.value
  showText('Loading Google Places API...')
}

function onPlaceChanged(event) {
  $resultingLocation = event.detail
  checkTestResult()
}
</script>

<style>
body,
html {
  height: 100%;
}

.command {
  color: blue;
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
  <p class={$displayTextCssClass}>{ $displayText || '...' }</p>
  
  {#if googlePlacesApiKey}
    <GooglePlacesAutocomplete apiKey={googlePlacesApiKey} {options}
                              on:place_changed={onPlaceChanged}
                              on:ready={runTests} value={$externalValue} />
  {:else}
    <input on:change={onApiKeyProvided} />
  {/if}
</div>

<table style="width: 100%">
  <thead>
    <tr>
      <th>Test</th>
      <th>Expected</th>
      <th>Result</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    {#each $tests as { name, expected, result, details } (name) }
      <tr>
        <td class={result}>{ name }</td>
        <td>{ JSON.stringify(expected) }</td>
        <td class="uppercase {result}">{ result || '' }</td>
        <td>{ details || '' }</td>
      </tr>
    {/each}
  </tbody>
</table>

{#if googlePlacesApiKey}
  <button on:click={runTests} disabled={$running}>Re-run tests</button>
{/if}
