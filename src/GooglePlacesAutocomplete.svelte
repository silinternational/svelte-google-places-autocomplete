<script>
import { loadGooglePlacesLibrary } from './loader.js'

export let apiKey
export let options = undefined

let inputField

loadGooglePlacesLibrary(apiKey, () => {
  const autocomplete = new google.maps.places.Autocomplete(inputField, options)
})
</script>

<input bind:this={inputField} class={$$props.class} />
