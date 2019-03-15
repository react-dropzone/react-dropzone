const fs = require('fs')
const path = require('path')
const fireDropEventScript = fs.readFileSync(
  path.resolve(__dirname, './utils/fire-drop-event.js'),
  'utf8'
)

describe('next.js integration', () => {
  it('should work', async () => {
    // https://webdriver.io/docs/api/browser/url.html
    await browser.url('/')
    const node = await $('.dropzone')
    const name = 'test.json'
    await browser.executeScript(fireDropEventScript, [
      node,
      [{ data: { ping: true }, name, type: 'application/json' }]
    ])
    const items = await $$('.file')
    expect(items.length).toBe(1)
    const text = await items[0].getText()
    expect(text).toEqual(name)
  })
})
