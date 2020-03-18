import { clearText, showText } from './instructions'
import { locationInput, whenPlaceChanges } from './interactions'
import { get } from 'svelte/store'
import tests from '../tests'
import { waitAMoment } from './waiting'

export async function runTests() {
  locationInput.set(document.querySelector('input'))
  get(locationInput).focus()
  
  let copyOfTests = get(tests)
  await waitAMoment(1000)
  for (let i = 0; i < copyOfTests.length; i++) {
    let test = copyOfTests[i]
    try {
      await runTest(test)
      test.result = 'pass'
    } catch (e) {
      test.result = 'fail'
      test.details = e.message
      break
    } finally {
      copyOfTests[i] = test
      tests.set(copyOfTests)
    }
  }
  showText('(Done)')
}

async function runTest(test) {
  return new Promise(async (resolve, reject) => {
    resetForNextTest()
    await test.setup()
    
    whenPlaceChanges(() => {
      clearText()
      test.passed() ? resolve() : reject()
    })
    
    test.go()
  })
}

function resetForNextTest() {
  get(locationInput).value = ''
}