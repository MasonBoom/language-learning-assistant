const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const app = path.resolve(__dirname, '../..');
const appRequire = Module.createRequire(path.join(app, 'package.json'));
const ts = appRequire('typescript');
const jwt = appRequire('jsonwebtoken');
const { NextRequest } = appRequire('next/server');
const cache = new Map();

function loadTs(filename) {
  filename = path.resolve(filename);
  if (cache.has(filename)) return cache.get(filename).exports;
  const compiled = new Module(filename, module);
  compiled.filename = filename;
  compiled.paths = Module._nodeModulePaths(path.dirname(filename));
  const nativeRequire = compiled.require.bind(compiled);
  compiled.require = (id) => id.startsWith('@/')
    ? loadTs(path.join(app, id.slice(2) + '.ts'))
    : nativeRequire(id);
  cache.set(filename, compiled);
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  });
  compiled._compile(result.outputText, filename);
  return compiled.exports;
}

const transcribe = loadTs(path.join(app, 'app/api/audio/transcribe/route.ts')).POST;
const chat = loadTs(path.join(app, 'app/api/chat/route.ts')).POST;
const speech = loadTs(path.join(app, 'app/api/audio/speech/route.ts')).POST;
process.env.TOKEN_SECRET = 'test-secret-do-not-use';
process.env.NEXT_PUBLIC_OPENAI_KEY = 'test-placeholder';
const cookie = 'token=' + jwt.sign({ id: 'test-user' }, process.env.TOKEN_SECRET);
let fetches = [];
let provider = () => { throw new Error('Unexpected mocked provider call'); };
global.fetch = async (url, options) => {
  fetches.push({ url, options });
  return provider(url, options);
};

function request(body, { auth = cookie, json = true } = {}) {
  const headers = auth ? { Cookie: auth } : {};
  if (json) headers['Content-Type'] = 'application/json';
  return new NextRequest('http://localhost/api/test', {
    method: 'POST', headers, body: json ? JSON.stringify(body) : body,
  });
}
function audio({ bytes = 4, name = 'clip.webm', type = 'audio/webm;codecs=opus', language = 'es' } = {}) {
  const form = new FormData();
  form.append('file', new Blob([new Uint8Array(bytes)], { type }), name);
  form.append('language', language);
  return request(form, { json: false });
}
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
let checks = 0;
async function check(name, fn) {
  fetches = [];
  await fn();
  checks++;
  console.log('PASS ' + name);
}

(async () => {
  await check('all routes reject absent and invalid cookies before provider calls', async () => {
    for (const route of [transcribe, chat, speech]) {
      assert.equal((await route(request({}, { auth: '' }))).status, 401);
      assert.equal((await route(request({}, { auth: 'token=invalid' }))).status, 401);
    }
    assert.equal(fetches.length, 0);
  });
  await check('transcription forwards original MIME, filename, model and ISO language', async () => {
    provider = (url, options) => {
      assert.equal(url, 'https://api.openai.com/v1/audio/transcriptions');
      assert.equal(options.headers.get('Authorization'), 'Bearer test-placeholder');
      assert.equal(options.cache, 'no-store');
      assert.equal(options.body.get('file').name, 'clip.webm');
      // Native multipart parsing normalizes MIME parameters; preserve its result.
      assert.equal(options.body.get('file').type, 'audio/webm');
      assert.equal(options.body.get('model'), 'whisper-1');
      assert.equal(options.body.get('language'), 'es');
      return jsonResponse({ text: ' hola ' });
    };
    const response = await transcribe(audio());
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { text: 'hola' });
  });
  await check('transcription rejects empty, oversized, unsupported and invalid-language inputs', async () => {
    assert.equal((await transcribe(audio({ bytes: 0 }))).status, 400);
    assert.equal((await transcribe(audio({ bytes: 25 * 1024 * 1024 + 1 }))).status, 413);
    assert.equal((await transcribe(audio({ name: 'clip.txt', type: 'text/plain' }))).status, 415);
    assert.equal((await transcribe(audio({ language: 'bogus' }))).status, 400);
    assert.equal(fetches.length, 0);
  });
  await check('OGG and MP4 recordings remain accepted', async () => {
    provider = () => jsonResponse({ text: '' });
    assert.equal((await transcribe(audio({ name: 'clip.ogg', type: 'audio/ogg', language: 'zh' }))).status, 200);
    assert.equal((await transcribe(audio({ name: 'clip.mp4', type: 'audio/mp4' }))).status, 200);
  });
  await check('chat validates settings and preserves model with compatible generation parameters', async () => {
    assert.equal((await chat(request({ text: 'hi', language: 'invalid', difficulty: 'Beginner' }))).status, 400);
    assert.equal(fetches.length, 0);
    provider = (url, options) => {
      assert.equal(url, 'https://api.openai.com/v1/chat/completions');
      const body = JSON.parse(options.body);
      assert.equal(body.model, 'gpt-5.4-mini');
      assert.equal(body.reasoning_effort, 'none');
      assert.ok(body.max_completion_tokens >= 1024);
      assert.equal(body.max_tokens, undefined);
      assert.equal(body.temperature, undefined);
      assert.match(body.messages[0].content, /Chinese \(Mandarin\)/);
      assert.match(body.messages[0].content, /one or two sentences/);
      return jsonResponse({ choices: [{ message: { content: ' 你好。 ' } }] });
    };
    const response = await chat(request({ text: 'hello', language: 'Chinese (Mandarin)', difficulty: 'Beginner' }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { text: '你好。' });
  });
  await check('speech validates input and returns MP3 audio', async () => {
    assert.equal((await speech(request({ text: 'x'.repeat(4097) }))).status, 400);
    assert.equal(fetches.length, 0);
    provider = (url, options) => {
      assert.equal(url, 'https://api.openai.com/v1/audio/speech');
      assert.deepEqual(JSON.parse(options.body), { model: 'tts-1-hd', voice: 'alloy', input: 'hola', response_format: 'mp3' });
      return new Response(new Uint8Array([1, 2, 3]));
    };
    const response = await speech(request({ text: 'hola' }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'audio/mpeg');
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal((await response.arrayBuffer()).byteLength, 3);
  });
  await check('missing server key returns explicit configuration error without provider calls', async () => {
    delete process.env.NEXT_PUBLIC_OPENAI_KEY;
    const response = await speech(request({ text: 'hi' }));
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /NEXT_PUBLIC_OPENAI_KEY/);
    assert.equal(fetches.length, 0);
    process.env.NEXT_PUBLIC_OPENAI_KEY = 'test-placeholder';
  });
  await check('provider credential, quota, rate and network failures are stage-specific and secret-free', async () => {
    for (const [status, code, expectedStatus, pattern] of [
      [401, 'invalid_api_key', 502, /credentials/],
      [429, 'insufficient_quota', 429, /quota/],
      [429, 'rate_limit_exceeded', 429, /rate limited/],
      [404, 'model_not_found', 502, /model is unavailable/],
      [500, 'server_error', 502, /status 500/],
    ]) {
      provider = () => jsonResponse({ error: { code, message: 'secret-provider-details' } }, status);
      const response = await speech(request({ text: 'hi' }));
      assert.equal(response.status, expectedStatus);
      const error = (await response.json()).error;
      assert.match(error, pattern);
      assert.match(error, /Speech generation/);
      assert.doesNotMatch(error, /secret-provider-details|test-placeholder/);
    }
    provider = () => { throw new Error('test network failure'); };
    const response = await speech(request({ text: 'hi' }));
    assert.equal(response.status, 502);
    assert.match((await response.json()).error, /could not reach OpenAI/);
  });
  console.log(`${checks} server route checks passed; all provider calls mocked.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });


