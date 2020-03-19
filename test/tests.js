import { showText } from "./helpers/instructions"
import { locationInput } from './helpers/interactions'
import { hitKey, type } from './helpers/typing'
import { waitForSuggestions } from './helpers/waiting'
import { get, writable } from 'svelte/store'

export default writable([
  {
    name: `Type something, see suggestions, click on one`,
    setup: async () => await type('new').then(waitForSuggestions),
    go: () => showText('Please click on the first suggestion', 'command'),
    expected: 'New York, NY, USA',
  },
  {
    name: `Type something, see suggestions, don't select any, hit Enter`,
    setup: async () => await type('atl').then(waitForSuggestions),
    go: () => hitKey('Enter', 0, 13),
    expected: 'Atlanta, GA, USA',
  },
  {
    name: `Type something, see suggestions, don't select any, hit Tab`,
    setup: async () => await type('new').then(waitForSuggestions),
    go: () => hitKey('Tab', 0, 9),
    expected: 'New York, NY, USA',
  },
  {
    name: `Type something, see suggestions, select one via Arrow keys, hit Enter`,
    setup: async () => {
      await type('atl')
      await waitForSuggestions()
      return hitKey('ArrowDown', 0, 40)
    },
    go: () => hitKey('Enter', 0, 13),
    expected: 'Atlanta, GA, USA',
  },
  {
    name: `Type something, see suggestions, select one via Arrow keys, hit Tab`,
    setup: async () => {
      await type('new')
      await waitForSuggestions()
      return hitKey('ArrowDown', 0, 40)
    },
    go: () => hitKey('Tab', 0, 9),
    expected: 'New York, NY, USA',
  },
  {
    name: `Type something, no suggestions, hit Enter`,
    setup: async () => type('zzzzz'),
    go: () => hitKey('Enter', 0, 13),
    expected: '',
  },
  {
    name: `Type something, no suggestions, hit Tab`,
    setup: async () => type('zzzzzz'),
    go: () => hitKey('Tab', 0, 9),
    expected: '',
  },
  // {
  //   name: `Type something, no suggestions, hit Enter, empty field, leave field`,
  //   setup: async () => await type('new').then(waitForSuggestions),
  //   go: () => ,
  //   passed: () => ,
  // },
  // {
  //   name: `Type something, hit Escape`,
  //   setup: async () => await type('atl').then(waitForSuggestions),
  //   go: () => ,
  //   passed: () => get(locationInput).value === '',
  // },
])
