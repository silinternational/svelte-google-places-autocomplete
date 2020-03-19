
export async function waitAMoment(milliseconds = 200) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export async function waitForSuggestions() {
  return new Promise(async (resolve, reject) => {
    const timeoutHandle = setTimeout(
      () => reject('Timed out waiting for suggestions to appear'),
      5000
    )
    let suggestion = document.querySelector('.pac-item')
    while (!suggestion) {
      await waitAMoment()
      suggestion = document.querySelector('.pac-item')
    }
    clearTimeout(timeoutHandle)
    resolve()
  })
}
