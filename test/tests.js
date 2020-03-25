import { showText } from "./helpers/instructions"
import { checkTestResultAfterAMoment, locationInput, passInValue } from './helpers/interactions'
import { hitKey, type } from './helpers/typing'
import { waitAMoment, waitForSuggestions } from './helpers/waiting'
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
    name: `Type something, see suggestions, don't select any, hit Enter, hit Tab`,
    setup: async () => {
      await type('atl')
      await waitForSuggestions()
      return hitKey('Enter', 0, 13)
    },
    
    // Since this test shouldn't trigger a place_changed event, explicitly check the results.
    go: () => hitKey('Tab', 0, 9).then(checkTestResultAfterAMoment),
    expected: 'Atlanta, GA, USA',
  },
  {
    name: `Type something, see suggestions, don't select any, hit Enter, hit Enter`,
    setup: async () => {
      await type('new')
      await waitForSuggestions()
      return hitKey('Enter', 0, 13)
    },
    
    // Since this test shouldn't trigger a place_changed event, explicitly check the results.
    go: () => hitKey('Enter', 0, 13).then(checkTestResultAfterAMoment),
    expected: 'New York, NY, USA',
  },
  {
    name: `Type something, see suggestions, don't select any, hit Enter, ` +
          `type something else, see no suggestions, hit Tab`,
    setup: async () => {
      await type('atl')
      await waitForSuggestions()
      await hitKey('Enter', 0, 13)
      await type('zzzzzzz')
      return waitAMoment()
    },
    go: () => hitKey('Tab', 0, 9),
    expected: '',
  },
  {
    name: `Type something, see suggestions, don't select any, hit Enter, ` +
          `type something else, see no suggestions, hit Enter`,
    setup: async () => {
      await type('new')
      await waitForSuggestions()
      await hitKey('Enter', 0, 13)
      await type('zzzzzzzz')
      return waitAMoment()
    },
    go: () => hitKey('Enter', 0, 13),
    expected: '',
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
  {
    name: `Type something, see suggestions, hit Escape`,
    setup: async () => await type('atl').then(waitForSuggestions),
    go: () => hitKey('Escape', 0, 27),
    expected: '',
  },
  {
    name: `Pass in a value`,
    setup: async () => passInValue('Atlanta, GA, USA'),
    
    // Since this test shouldn't trigger a place_changed event, explicitly check the results.
    go: () => checkTestResultAfterAMoment(),
    expected: 'Atlanta, GA, USA',
  },
  {
    name: `Pass in a value, type the same thing, hit Tab`,
    setup: async () => {
      await passInValue('New York, NY, USA')
      return type('New York, NY, USA')
    },
    go: () => hitKey('Tab', 0, 9),
    expected: 'New York, NY, USA',
  },
  {
    name: `Pass in a value, type something else, no suggestions, hit Tab`,
    setup: async () => {
      await passInValue('Atlanta, GA, USA')
      return type('zzzzzz')
    },
    go: () => hitKey('Tab', 0, 9),
    expected: '',
  },
])
