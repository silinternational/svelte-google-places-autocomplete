<script>
import { loadGooglePlacesLibrary } from './loader.js'
import { createEventDispatcher } from 'svelte'

export let apiKey
export let options = undefined
export let placeholder = undefined

const dispatch = createEventDispatcher()

let inputField

loadGooglePlacesLibrary(apiKey, () => {
  const autocomplete = new google.maps.places.Autocomplete(inputField, options)
  autocomplete.addListener('place_changed', event => {
    dispatch('place_changed', {
      place: autocomplete.getPlace(),
      text: inputField.value
    })
  })
})
</script>

<input bind:this={inputField} class={$$props.class} {placeholder} />
