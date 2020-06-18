'use strict';

import { promises } from 'fs';
import { runInContext, createContext } from 'vm';
import { join } from 'path';
import bundler from '../src/core';

const { readFile, mkdir } = promises;
const fixtureBasePath = join(__dirname, 'fixtures')
  , outputBasePath = join(__dirname, 'output')
  , ENTRY_FILE = 'entry.js'
  , BUNDLE_FILE = 'bundle.js';

async function build(fixturePath: string, outputPath: string, type?: string) {
  await bundler({
    input: join(fixturePath, type || "", ENTRY_FILE),
    output: join(outputPath, type || "", BUNDLE_FILE)
  })
}

async function runGeneratedCodeInVM(outputPath: string, type?: string) {
  const code = await readFile(join(outputPath, type || "", BUNDLE_FILE), 'utf-8'),
    sandbox = { console, process },
    ctx = createContext({ sandbox });

  runInContext(code, ctx);
}

async function createDir(base: string, dir?: string) {
  await mkdir(join(base, dir || ""), { recursive: true });
}

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation()
  jest.spyOn(console, 'warn').mockImplementation()
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('arrow-functions', () => {
  const type = 'arrow-functions'
  const fixturePath = join(fixtureBasePath, type)
  const outputPath = join(outputBasePath, type)

  beforeAll(async () => {
    await createDir(outputPath, '');
  })

  const dirs = [
    'basic',
    'default-parameters',
    'expression',
    'nested',
    'paran-insertion',
    'spec-naming'
  ]

  for (const dir of dirs) {
    test(dir, async () => {
      await createDir(outputPath, dir);
      await build(fixturePath, outputPath, dir);
      await runGeneratedCodeInVM(outputPath, dir);

      // https://stackoverflow.com/questions/52457575/jest-typescript-property-mock-does-not-exist-on-type
      // I don't know why, but console.log executed in `vm` is not mocked
      expect((console.log as jest.Mock).mock.calls).toMatchSnapshot();
    });
  }
})

describe('modules-commonjs', () => {
  describe('interop', () => {
    const type = 'modules-commonjs'
    const subType = 'interop'
    const fixturePath = join(fixtureBasePath, type, subType)
    const outputPath = join(outputBasePath, type, subType)

    beforeAll(async () => {
      await createDir(outputPath, '');
    })

    const dirs = [
      'export-default-literal',
      'export-default-oe',
      'export-default-ae',
      'export-default-fd',
      'export-default-fd-id-name',
      'export-default-ce',
      'export-default-ne',
      'export-from-all',
      'export-from-named',
      'export-from-named-multi',
      'export-from-as',
      'export-from-as-default',
      'export-from-as-mix',
      'export-from-default-as',
      'export-named',
      'export-named-multi',
      'export-named-as',
      'export-named-as-default',
      'export-named-as-mix',
      'export-variables',
      'import-default-literal',
      'import-default-as'
    ]

    for (const dir of dirs) {
      test(dir, async () => {
        await createDir(outputPath, dir);
        await build(fixturePath, outputPath, dir);

        // Actually execute the bundled file with vm
        // OK if no error occurs
        await runGeneratedCodeInVM(outputPath, dir);

        const code = await readFile(join(outputPath, dir, BUNDLE_FILE), 'utf-8')
        expect(code).toMatchSnapshot();
      });
    }
  })
})
