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
      test.details = (typeof error === 'string') ? error : JSON.stringify(error)
      break
    } finally {
      copyOfTests[i] = test
      tests.set(copyOfTests) // Force a re-evaluation of `$tests` elsewhere
    }
  }
  
  const failedTests = copyOfTests.filter(test => test.result === 'fail')
  if (failedTests.length > 0) {
    const testOrTests = failedTests.length === 1 ? 'test' : 'tests'
    showText(`${failedTests.length} ${testOrTests} failed`, 'fail')
  } else {
    showText('All tests passed', 'pass')
  }
}

async function runTest(test) {
  return new Promise(async (resolve, reject) => {
    const timeoutHandle = setTimeout(
      () => reject('Timed out waiting for test to finish running'),
      10000
    )
    resetForNextTest()
    await test.setup()
    
    whenPlaceChanges(() => {
      clearText()
      clearTimeout(timeoutHandle)
      const actualResult = get(locationInput).value
      if (actualResult === test.expected) {
        resolve()
      } else {
        reject(
          `Expected ${JSON.stringify(test.expected)} ` +
          `but found ${JSON.stringify(actualResult)}`
        )
      }
    })
    
    await waitAMoment()
    test.go()
  })
}

function resetForNextTest() {
  get(locationInput).value = ''
}
