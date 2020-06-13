'use strict';

const { readFile, mkdir } = require('fs').promises
  , { runInContext, createContext } = require('vm')
  , { join } = require('path')
  , bundler = require('../src/core');

const fixtureBasePath = join(__dirname, 'fixtures')
  , outputBasePath = join(__dirname, 'output')
  , ENTRY_FILE = 'entry.js'
  , BUNDLE_FILE = 'bundle.js';

async function build(fixturePath, outputPath, type) {
  await bundler({
    input: join(fixturePath, type, ENTRY_FILE),
    output: join(outputPath, type, BUNDLE_FILE)
  })
}

async function runGeneratedCodeInVM(outputPath, type) {
  const code = await readFile(join(outputPath, type, BUNDLE_FILE), 'utf-8'),
    sandbox = { console, process },
    ctx = new createContext(sandbox);

  runInContext(code, ctx);
}

async function createDir(base, type) {
  await mkdir(join(base, type), { recursive: true });
}

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation()
  jest.spyOn(console, 'warn').mockImplementation()
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('esm', () => {
  const fixturePath = join(fixtureBasePath, 'esm');
  const outputPath = join(outputBasePath, 'esm');

  beforeAll(async () => {
    await createDir(outputPath, '');
  });

  const dirs = [
    'simple'
  ]

  for (const dir of dirs) {
    test(dir, async () => {
      await createDir(outputPath, dir);
      await build(fixturePath, outputPath, dir);
      await runGeneratedCodeInVM(outputPath, dir);

      expect(console.log.mock.calls).toMatchSnapshot();
    });
  }
});
