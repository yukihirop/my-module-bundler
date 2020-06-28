'use strict';

import { promises } from 'fs';
import { runInContext, createContext } from 'vm';
import { join } from 'path';

import { Bundler, types as t } from '@yukihirop/bundler';
import transformDestructuring from '../src';

const { readFile, mkdir } = promises;
const fixtureBasePath = join(__dirname, 'fixtures')
  , outputBasePath = join(__dirname, 'output')
  , ENTRY_FILE = 'entry.js'
  , BUNDLE_FILE = 'bundle.js'
  , defaultOpts = {
    "plugins": [
      [transformDestructuring, {}],
    ]
  } as t.OptionsType;

type TestBuildOptionsType = {
  opts?: t.OptionsType
  type?: string
}

async function build(fixturePath: string, outputPath: string, options: TestBuildOptionsType) {
  const { opts, type } = options;
  await new Bundler(opts || defaultOpts).write({
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

describe('destructuring', () => {
  const type = 'destructuring'
  const fixturePath = join(fixtureBasePath, type)
  const outputPath = join(outputBasePath, type)

  beforeAll(async () => {
    await createDir(outputPath, '');
  })

  const dirs = [
    'array-basic',
    'array-rest-basic',
    'array-rest-nested',
    'array-overflow',
    'array-self-reference',
    'array-assignment-function-block',
    'object-basic',
    'object-rest-basic',
    'object-rest-nested',
    'object-overflow',
    'object-assignment-function-block',
    'call-expression-array-basic',
    'call-expression-array-helper-rename'
  ]

  for (const dir of dirs) {
    test(dir, async () => {
      await createDir(outputPath, dir);
      await build(fixturePath, outputPath, { type: dir });
      await runGeneratedCodeInVM(outputPath, dir);

      const code = await readFile(join(outputPath, dir, BUNDLE_FILE), 'utf-8')
      expect(code).toMatchSnapshot();
    });
  }
})
