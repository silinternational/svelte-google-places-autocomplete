import { clearText, showText } from './instructions'
import { locationInput, whenPlaceChanges } from './interactions'
import { get } from 'svelte/store'
import tests from '../tests'
import { waitAMoment } from './waiting'

export function resetTestResults() {
  const copyOfTests = get(tests)
  copyOfTests.forEach(test => {
    delete test.result
    delete test.details
  })
  tests.set(copyOfTests)
}

export async function runTests() {
  locationInput.set(document.querySelector('input'))
  get(locationInput).focus()
  
  resetTestResults()
  
  let copyOfTests = get(tests)
  await waitAMoment(1000)
  for (let i = 0; i < copyOfTests.length; i++) {
    let test = copyOfTests[i]
    try {
      await runTest(test)
      test.result = 'pass'
    } catch (error) {
      test.result = 'fail'
      test.details = JSON.stringify(error)
      break
    } finally {
      copyOfTests[i] = test
      tests.set(copyOfTests) // Force a re-evaluation of `$tests` elsewhere
    }
  }
  showText('(Done)')
}

async function runTest(test) {
  return new Promise(async (resolve, reject) => {
    const timeoutHandle = setTimeout(
      () => reject('Timed out waiting for test to finish running'),
      5000
    )
    resetForNextTest()
    await test.setup()
    
    whenPlaceChanges(() => {
      clearText()
      if (test.passed()) {
        clearTimeout(timeoutHandle)
        resolve()
      } else {
        reject()
      }
    })
    
    test.go()
  })
}

function resetForNextTest() {
  get(locationInput).value = ''
}
