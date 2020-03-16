<script>
import GooglePlacesAutocomplete from '../src/GooglePlacesAutocomplete.svelte'

const options = {
  fields: ['address_components', 'geometry'],
  types: ['(cities)']
}

let googlePlacesApiKey

function onApiKeyProvided(event) {
  googlePlacesApiKey = event.target.value
}
</script>

{#if googlePlacesApiKey}
  <GooglePlacesAutocomplete apiKey={googlePlacesApiKey} {options} />
{:else}
  <label>
    <p>Google Places API Key:</p>
    <input on:change={onApiKeyProvided} />
  </label>
{/if}
