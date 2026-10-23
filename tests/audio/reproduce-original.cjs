const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined,
    headless: true,
  });
  try {
    const page = await browser.newPage();
    await page.setContent(`
      <button id="outer">
        <div><input id="checkbox" type="checkbox" style="display:none" />
          <label for="checkbox" style="display:block;width:48px;height:48px">Mic</label>
        </div>
      </button>
      <script>
        window.handlerCalls = [];
        document.querySelector('#outer').addEventListener('click', event => {
          window.handlerCalls.push(event.target.tagName);
        });
      </script>
    `);
    await page.locator('label').click();
    const calls = await page.evaluate(() => window.handlerCalls);
    assert.deepEqual(calls, ['LABEL', 'INPUT']);
    console.log('Original control: one label click invoked the parent handler twice:', calls);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

