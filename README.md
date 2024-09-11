# WARNING: This repo is no longer maintained

# svelte-google-places-autocomplete

A minimal port of the
[Google Places Autocomplete API](https://developers.google.com/maps/documentation/javascript/places-autocomplete)
as a Svelte component.

Inspired largely by [beyonk-adventures/svelte-googlemaps](https://github.com/beyonk-adventures/svelte-googlemaps).

## Google API Restrictions

If you restrict the Google API key you use for this (recommended), ensure you allow at least the following two APIs, since this component needs them in order to fully function:

* Maps JavaScript API
* Places API

## Example usage

```svelte
<script>
const options = {
  fields: ['address_components', 'geometry'],
  types: ['(cities)']
}
const placeholder = 'Destination city'

let locationName = localStorage.get('locationName') || ''
</script>

<GooglePlacesAutocomplete apiKey={googlePlacesApiKey} class="form-control"
                          on:place_changed={onPlaceChanged} {options}
                          on:ready={onReady} {placeholder}
                          value={locationName}
                          required
                          pattern="[a-zA-Z ]+" />
```

## Parameters

### apiKey
Your Google Places API Key.

### class
Any HTML class string to apply to the input element.

### options
The `options` that you want to pass to the Google Places Autocomplete code.

Details:
<https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions>

### placeholder
Any placeholder text to use. Defaults to an automatically-localized placedholder
string.

### value
The text to show in the input.

**WARNING**: You cannot bind to this. To receive data out of this component,
listen for the `place_changed` event.

### required
Require a value to be entered.

### pattern
Specifies a regular expression that is used for validation upon form submission.


## Events

### place_changed
When a location is selected, 

### ready
Fired when the component has initialized, the Google Places API has been loaded,
and this component is therefore ready for user interaction.

## Tests

### Running the tests
(Mostly) automated tests are available:

1. Run `make test`
2. Open `localhost:8086` in a browser
3. Paste in your Google Places API Key and hit `Enter`
4. Follow any instructions shown (e.g. "Please click on the first suggestion")

### Modifying the tests

The tests are defined in `test/tests.js`. See that file for examples.

## Install with [npm](https://www.npmjs.com/package/@silintl/svelte-google-places-autocomplete)

    $ npm install @silintl/svelte-google-places-autocomplete

## Contributing

Please use the included prettier config for formatting. You can also run `make format` to format all files with prettier.
