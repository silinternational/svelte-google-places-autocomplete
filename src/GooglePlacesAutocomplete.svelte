<script>
import { loadGooglePlacesLibrary } from './loader.js'

export let apiKey

let inputField

loadGooglePlacesLibrary(apiKey, () => {
  const autocomplete = new window.google.maps.places.Autocomplete(inputField)
})
</script>

<input bind:this={inputField} class={$$props.class} />
