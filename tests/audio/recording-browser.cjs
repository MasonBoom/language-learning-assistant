const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

const baseURL = process.env.APP_TEST_URL || 'http://127.0.0.1:3000';

async function setup(browser, options = {}) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const calls = { transcription: [], chat: [], speech: [], external: [] };
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== new URL(baseURL).origin) {
      calls.external.push(request.url());
      return route.abort();
    }
    if (url.pathname === '/api/getUserData') {
      return route.fulfill({ json: { username: 'Audio Tester', learningLanguage: 'Spanish', nativeLanguage: 'English', difficulty: 'Beginner' } });
    }
    if (url.pathname === '/api/audio/transcribe') {
      calls.transcription.push(request.postDataBuffer());
      if (options.transcriptionDelay) await new Promise(resolve => setTimeout(resolve, options.transcriptionDelay));
      return route.fulfill(options.transcriptionError
        ? { status: 502, json: { error: 'Transcription failed: test provider unavailable' } }
        : { json: { text: options.transcript === undefined ? 'Hola, buenos días.' : options.transcript } });
    }
    if (url.pathname === '/api/chat') {
      calls.chat.push(request.postDataJSON());
      return route.fulfill({ json: { text: '¡Hola! ¿Cómo estás?' } });
    }
    if (url.pathname === '/api/audio/speech') {
      calls.speech.push(request.postDataJSON());
      return route.fulfill({ contentType: 'audio/mpeg', body: Buffer.from('test audio') });
    }
    if (url.pathname.startsWith('/api/')) throw new Error(`Unexpected API request: ${url.pathname}`);
    return route.continue();
  });
  await page.addInitScript(options => {
    window.recorderTest = { getUserMediaCalls: 0, recorderStarts: 0, recorderStops: 0, trackStops: 0, events: [] };
    HTMLMediaElement.prototype.play = async function () {};
    if (options.realMedia) {
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = async constraints => {
        window.recorderTest.getUserMediaCalls++;
        const media = await originalGetUserMedia(constraints);
        for (const track of media.getTracks()) {
          const stop = track.stop.bind(track);
          track.stop = () => { window.recorderTest.trackStops++; stop(); };
        }
        return media;
      };
      const OriginalMediaRecorder = window.MediaRecorder;
      window.MediaRecorder = class extends OriginalMediaRecorder {
        start(...args) { window.recorderTest.recorderStarts++; return super.start(...args); }
        stop(...args) { window.recorderTest.recorderStops++; return super.stop(...args); }
      };
      return;
    }
    const stream = { getTracks: () => [{ stop: () => window.recorderTest.trackStops++ }] };
    const getUserMedia = async () => {
      window.recorderTest.getUserMediaCalls++;
      if (options.permissionDelay) await new Promise(resolve => setTimeout(resolve, options.permissionDelay));
      if (options.permissionError) throw new DOMException('Test microphone permission denied', 'NotAllowedError');
      return stream;
    };
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: getUserMedia, configurable: true });
    class FakeMediaRecorder extends EventTarget {
      constructor(stream, recorderOptions = {}) {
        super();
        this.stream = stream;
        this.mimeType = options.mimeType || recorderOptions.mimeType || 'audio/webm';
        this.state = 'inactive';
      }
      static isTypeSupported(type) {
        return options.mimeType ? type === options.mimeType : type.includes('webm');
      }
      start() {
        if (options.startError) throw new DOMException('Test recorder failed to start', 'NotSupportedError');
        window.recorderTest.recorderStarts++;
        this.state = 'recording';
        if (this.onstart) this.onstart(new Event('start'));
      }
      emit(type, event) {
        window.recorderTest.events.push(type);
        this.dispatchEvent(event);
        if (this[`on${type}`]) this[`on${type}`](event);
      }
      requestData() {}
      stop() {
        window.recorderTest.recorderStops++;
        if (this.state === 'inactive') throw new DOMException('Already stopped', 'InvalidStateError');
        this.state = 'inactive';
        setTimeout(() => {
          const data = new Blob(options.emptyData ? [] : ['final audio chunk'], { type: this.mimeType });
          this.emit('dataavailable', new BlobEvent('dataavailable', { data }));
          this.emit('stop', new Event('stop'));
        }, 20);
      }
    }
    window.MediaRecorder = FakeMediaRecorder;
  }, options);
  await page.goto(`${baseURL}/Dashboard`);
  await page.getByRole('button', { name: 'Start recording', exact: true }).waitFor();
  return { context, page, calls };
}

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined, headless: true,
    args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
  });
  let tests = 0;
  async function test(name, options, fn) {
    const session = await setup(browser, options);
    try {
      await fn(session);
      assert.deepEqual(session.calls.external, []);
      console.log(`PASS ${name}`);
      tests++;
    } finally { await session.context.close(); }
  }
  try {
    await test('one click starts one recording, stop uploads final data and completes conversation', {}, async ({ page, calls }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).click();
      await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
      await page.getByText('¡Hola! ¿Cómo estás?', { exact: false }).waitFor();
      const state = await page.evaluate(() => window.recorderTest);
      assert.equal(state.getUserMediaCalls, 1);
      assert.equal(state.recorderStarts, 1);
      assert.equal(state.recorderStops, 1);
      assert.equal(state.trackStops, 1);
      assert.deepEqual(state.events, ['dataavailable', 'stop']);
      assert.equal(calls.transcription.length, 1);
      assert.match(calls.transcription[0].toString(), /final audio chunk/);
      assert.match(calls.transcription[0].toString(), /filename="[^"]+\.webm"/);
      assert.equal(calls.chat.length, 1);
      assert.equal(calls.speech.length, 1);
    });
    await test('rapid clicks while permission is pending do not start a second recorder', { permissionDelay: 500 }, async ({ page }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).evaluate(button => { button.click(); button.click(); });
      await page.getByRole('button', { name: 'Stop recording', exact: true }).waitFor();
      const state = await page.evaluate(() => window.recorderTest);
      assert.equal(state.getUserMediaCalls, 1);
      assert.equal(state.recorderStarts, 1);
    });
    await test('microphone permission denial is visible and can be retried', { permissionError: true }, async ({ page, calls }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).click();
      await page.locator('[role=alert]:not(#__next-route-announcer__)').waitFor();
      assert.match(await page.locator('[role=alert]:not(#__next-route-announcer__)').innerText(), /microphone|permission|denied|allow/i);
      await page.getByRole('button', { name: 'Start recording', exact: true }).waitFor({ state: 'visible' });
      assert.equal(calls.transcription.length, 0);
    });
    await test('recorder start failure releases microphone and shows error', { startError: true }, async ({ page }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).click();
      await page.locator('[role=alert]:not(#__next-route-announcer__)').waitFor();
      assert.equal(await page.evaluate(() => window.recorderTest.trackStops), 1);
    });
    await test('empty recordings do not reach transcription API', { emptyData: true }, async ({ page, calls }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).click();
      await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
      await page.locator('[role=alert]:not(#__next-route-announcer__)').waitFor();
      assert.equal(calls.transcription.length, 0);
    });
    await test('MP4 format keeps matching MIME type and filename', { mimeType: 'audio/mp4' }, async ({ page, calls }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).click();
      await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
      await page.getByText('¡Hola! ¿Cómo estás?', { exact: false }).waitFor();
      assert.match(calls.transcription[0].toString(), /filename="[^"]+\.mp4"/);
      assert.match(calls.transcription[0].toString(), /Content-Type: audio\/mp4/);
    });
    await test('transcription failure is visible after recording completes', { transcriptionError: true }, async ({ page, calls }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).click();
      await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
      await page.locator('[role=alert]:not(#__next-route-announcer__)').waitFor();
      assert.match(await page.locator('[role=alert]:not(#__next-route-announcer__)').innerText(), /Transcription failed/i);
      assert.equal(calls.chat.length, 0);
    });
    await test('new recording is locked while transcription is processing', { transcriptionDelay: 800 }, async ({ page, calls }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).click();
      await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
      await page.waitForFunction(() => window.recorderTest.trackStops === 1);
      const mic = page.locator('button[aria-pressed]');
      assert.equal(await mic.isDisabled(), true);
      await mic.evaluate(button => button.click());
      assert.equal(await page.evaluate(() => window.recorderTest.getUserMediaCalls), 1);
      await page.getByText('¡Hola! ¿Cómo estás?', { exact: false }).waitFor();
      assert.equal(calls.transcription.length, 1);
    });
    await test('leaving Dashboard stops recording and does not upload it', {}, async ({ page, calls }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).click();
      await page.getByRole('button', { name: 'Stop recording', exact: true }).waitFor();
      await page.getByRole('link', { name: 'Language Settings' }).click();
      await page.waitForURL('**/LanguageSelection');
      await page.waitForFunction(() => window.recorderTest.trackStops === 1);
      assert.equal(calls.transcription.length, 0);
    });
    await test('leaving Dashboard while permission is pending releases late stream', { permissionDelay: 1000 }, async ({ page, calls }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).click();
      await page.getByRole('link', { name: 'Language Settings' }).click();
      await page.waitForURL('**/LanguageSelection');
      await page.waitForFunction(() => window.recorderTest.trackStops === 1);
      assert.equal(await page.evaluate(() => window.recorderTest.recorderStarts), 0);
      assert.equal(calls.transcription.length, 0);
    });
    await test('real Chrome MediaRecorder captures audio from a synthetic microphone', { realMedia: true }, async ({ page, calls }) => {
      await page.getByRole('button', { name: 'Start recording', exact: true }).click();
      await page.getByRole('button', { name: 'Stop recording', exact: true }).waitFor();
      await page.waitForTimeout(700);
      await page.getByRole('button', { name: 'Stop recording', exact: true }).click();
      await page.getByText('¡Hola! ¿Cómo estás?', { exact: false }).waitFor();
      assert.equal(calls.transcription.length, 1);
      assert.ok(calls.transcription[0].length > 1000, 'Real encoded audio should contain more than multipart headers');
      const state = await page.evaluate(() => window.recorderTest);
      assert.equal(state.getUserMediaCalls, 1);
      assert.equal(state.recorderStarts, 1);
      assert.equal(state.recorderStops, 1);
      assert.equal(state.trackStops, 1);
      console.log(`Real recorded upload: ${calls.transcription[0].length} bytes`);
    });
    console.log(`${tests} browser regressions passed.`);
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });

