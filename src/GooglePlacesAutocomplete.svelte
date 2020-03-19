<script>
import { loadGooglePlacesLibrary } from './loader.js'
import { createEventDispatcher, onMount } from 'svelte'

export let apiKey
export let options = undefined
export let placeholder = undefined

const dispatch = createEventDispatcher()

let inputField

onMount(() => {
  loadGooglePlacesLibrary(apiKey, () => {
    const autocomplete = new google.maps.places.Autocomplete(inputField, options)
    
    autocomplete.addListener('place_changed', () => {
      dispatch('place_changed', {
        place: autocomplete.getPlace(),
        text: inputField.value
      })
    })
    
    dispatch('ready')
  })
})

function onChange() {
  if (inputField.value === '') {
    dispatch('place_changed', null)
  }
}
</script>

<input bind:this={inputField} class={$$props.class} on:change={onChange}
       {placeholder} />
