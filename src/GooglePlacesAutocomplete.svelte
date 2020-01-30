<script>
import { loadGooglePlacesLibrary } from './loader.js'
import { createEventDispatcher } from 'svelte'

export let apiKey
export let options = undefined

const dispatch = createEventDispatcher()

let inputField

loadGooglePlacesLibrary(apiKey, () => {
  const autocomplete = new google.maps.places.Autocomplete(inputField, options)
  autocomplete.addListener('place_changed', event => {
    dispatch('place_changed', {
      placeResult: autocomplete.getPlace()
    })
  })
})
</script>

<input bind:this={inputField} class={$$props.class} />
