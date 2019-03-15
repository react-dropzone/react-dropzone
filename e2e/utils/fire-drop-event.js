// Used to trigger drop events
// in the context of webdriver executeScript() in our integration tests
const [target, data] = arguments
const files = data.map(
  item =>
    new File([JSON.stringify(item.data)], item.name, {
      type: item.type
    })
)

// Dispatch the 'drop' event
fireDropEvent(target, files)

function fireDropEvent(target, files) {
  const event = createEvent('drop')
  event.dataTransfer = {
    files,
    items: files.map(file => ({
      kind: 'file',
      type: file.type,
      getAsFile: () => file
    })),
    types: ['Files']
  }
  target.dispatchEvent(event)
}

function createEvent(type) {
  if (typeof Event !== 'function') {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/createEvent
    const event = document.createEvent('Event')
    event.initEvent(type, true, true)
    return event
  }
  return new Event(type, {
    bubbles: true,
    cancelable: true
  })
}
