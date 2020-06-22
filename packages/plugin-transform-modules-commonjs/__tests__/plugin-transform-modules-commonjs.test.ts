'use strict';

import { promises } from 'fs';
import { runInContext, createContext } from 'vm';
import { join } from 'path';

import { Bundler, types as t } from '@yukihirop/bundler';
import transformModulesCommonjs from '../src';

const { readFile, mkdir } = promises;
const fixtureBasePath = join(__dirname, 'fixtures')
  , outputBasePath = join(__dirname, 'output')
  , ENTRY_FILE = 'entry.js'
  , BUNDLE_FILE = 'bundle.js'
  , defaultOpts = {
    "plugins": [
      [transformModulesCommonjs, {}]
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

describe('modules-commonjs', () => {
  describe('interop', () => {
    const type = 'modules-commonjs'
    const subType = 'interop'
    const fixturePath = join(fixtureBasePath, type, subType)
    const outputPath = join(outputBasePath, type, subType)

    beforeAll(async () => {
      await createDir(outputPath, '');
    })

    const opts = {
      "plugins": [
        transformModulesCommonjs
      ]
    }

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
      'export-named-remap',
      'export-variables',
      'import-default-literal',
      'import-default-as',
      'import-wildcard-as',
      'import-as-mix',
      'import-named',
      'import-named-multi',
      'import-named-as-mix',
      'import-basic',
      'import-hoist',
      'import-global-variable-unbind',
      'import-wildcard-as-hoist',
      'export-hoist-function-success',
      'export-rename-hoist',
      'export-rename-not-hoist'
    ]

    for (const dir of dirs) {
      test(dir, async () => {
        await createDir(outputPath, dir);
        await build(fixturePath, outputPath, { opts, type: dir });

        // Actually execute the bundled file with vm
        // OK if no error occurs
        await runGeneratedCodeInVM(outputPath, dir);

        const code = await readFile(join(outputPath, dir, BUNDLE_FILE), 'utf-8')
        expect(code).toMatchSnapshot();
      });
    }

    test('export-illegal', async () => {
      const opts = {
        "plugins": [
          transformModulesCommonjs
        ]
      }

      const dir = 'export-illegal'
      await createDir(outputPath, dir);
      await expect(build(fixturePath, outputPath, { opts, type: dir })).rejects.toThrow(new Error('unknown: Illegal export "__esModule"'))
    })

    test('export-hoist-function-failure', async () => {
      const opts = {
        "plugins": [
          transformModulesCommonjs
        ]
      }

      const dir = 'export-hoist-function-failure'
      await createDir(outputPath, dir);
      await build(fixturePath, outputPath, { opts, type: dir });

      const code = await readFile(join(outputPath, dir, BUNDLE_FILE), 'utf-8')
      expect(code).toMatchSnapshot();

      await expect(runGeneratedCodeInVM(outputPath, dir)).rejects.toThrow(new Error("not_hoist_2 is not a function"))
    })
  })
})

describe('modules-commonjs', () => {
  describe('misc(throw error)', () => {
    const type = 'modules-commonjs'
    const subType = 'misc'
    const fixturePath = join(fixtureBasePath, type, subType)
    const outputPath = join(outputBasePath, type, subType)

    beforeAll(async () => {
      await createDir(outputPath, '');
    })

    const opts = {
      "plugins": [
        transformModulesCommonjs
      ]
    }

    const dirs = [
      'import-global-variable-throw-bs',
      'import-global-variable-throw-ae',
      'import-global-variable-throw-id',
      'import-global-variable-throw-bs-ls'
    ]

    for (const dir of dirs) {
      test(dir, async () => {
        await createDir(outputPath, dir);
        await build(fixturePath, outputPath, { opts, type: dir });

        // Actually execute the bundled file with vm
        // OK if no error occurs
        await expect(runGeneratedCodeInVM(outputPath, dir)).rejects.toThrow(new Error('"b" is read-only.'))

        const code = await readFile(join(outputPath, dir, BUNDLE_FILE), 'utf-8')
        expect(code).toMatchSnapshot();
      });
    }
  })
})

describe('modules-commonjs', () => {
  describe('misc(throw error)', () => {
    const type = 'modules-commonjs'
    const subType = 'misc'
    const fixturePath = join(fixtureBasePath, type, subType)
    const outputPath = join(outputBasePath, type, subType)

    beforeAll(async () => {
      await createDir(outputPath, '');
    })

    const opts = {
      "plugins": [
        transformModulesCommonjs
      ]
    }

    const dirs = [
      'undefined-this-computed-class-method',
      'undefined-this-root-call'
    ]

    for (const dir of dirs) {
      test(dir, async () => {
        await createDir(outputPath, dir);
        await build(fixturePath, outputPath, { opts, type: dir });

        await expect(runGeneratedCodeInVM(outputPath, dir)).rejects.toThrow()

        const code = await readFile(join(outputPath, dir, BUNDLE_FILE), 'utf-8')
        expect(code).toMatchSnapshot();
      });
    }
  })
})

describe('modules-commonjs', () => {
  describe('misc', () => {
    const type = 'modules-commonjs'
    const subType = 'misc'
    const fixturePath = join(fixtureBasePath, type, subType)
    const outputPath = join(outputBasePath, type, subType)

    beforeAll(async () => {
      await createDir(outputPath, '');
    })

    const opts = {
      "plugins": [
        transformModulesCommonjs
      ]
    }

    const dirs = [
      'this-computed-class-method-wrap-func',
      'undefined-this-root-declaration',
      'undefined-this-root-reference'
    ]

    for (const dir of dirs) {
      test(dir, async () => {
        await createDir(outputPath, dir);
        await build(fixturePath, outputPath, { opts, type: dir });

        // Actually execute the bundled file with vm
        // OK if no error occurs
        await runGeneratedCodeInVM(outputPath, dir)

        const code = await readFile(join(outputPath, dir, BUNDLE_FILE), 'utf-8')
        expect(code).toMatchSnapshot();
      });
    }
  })
})

describe('modules-commonjs', () => {
  describe('noInterop', () => {
    const type = 'modules-commonjs'
    const subType = 'noInterop'
    const fixturePath = join(fixtureBasePath, type, subType)
    const outputPath = join(outputBasePath, type, subType)

    beforeAll(async () => {
      await createDir(outputPath, '');
    })

    const opts = {
      "plugins": [
        [transformModulesCommonjs, { "noInterop": true }]
      ]
    } as t.OptionsType

    const dirs = [
      'import-default',
      'import-wildcard',
      'export-named-from'
    ]

    for (const dir of dirs) {
      test(dir, async () => {
        await createDir(outputPath, dir);
        await build(fixturePath, outputPath, { opts, type: dir });

        // Actually execute the bundled file with vm
        // OK if no error occurs
        await runGeneratedCodeInVM(outputPath, dir)

        const code = await readFile(join(outputPath, dir, BUNDLE_FILE), 'utf-8')
        expect(code).toMatchSnapshot();
      });
    }
  })
})

describe('modules-commonjs', () => {
  describe('loose', () => {
    const type = 'modules-commonjs'
    const subType = 'loose'
    const fixturePath = join(fixtureBasePath, type, subType)
    const outputPath = join(outputBasePath, type, subType)

    beforeAll(async () => {
      await createDir(outputPath, '');
    })

    const opts = {
      "plugins": [
        [transformModulesCommonjs, { "loose": true }]
      ]
    } as t.OptionsType

    const dirs = [
      'export-default',
    ]

    for (const dir of dirs) {
      test(dir, async () => {
        await createDir(outputPath, dir);
        await build(fixturePath, outputPath, { opts, type: dir });

        // Actually execute the bundled file with vm
        // OK if no error occurs
        await runGeneratedCodeInVM(outputPath, dir)

        const code = await readFile(join(outputPath, dir, BUNDLE_FILE), 'utf-8')
        expect(code).toMatchSnapshot();
      });
    }
  })
})

describe('modules-commonjs', () => {
  describe('strictMode', () => {
    const type = 'modules-commonjs'
    const subType = 'strictMode'
    const fixturePath = join(fixtureBasePath, type, subType)
    const outputPath = join(outputBasePath, type, subType)

    beforeAll(async () => {
      await createDir(outputPath, '');
    })

    const opts = {
      "plugins": [
        [transformModulesCommonjs, { "strictMode": false }]
      ]
    } as t.OptionsType

    const dirs = [
      'false',
    ]

    for (const dir of dirs) {
      test(dir, async () => {
        await createDir(outputPath, dir);
        await build(fixturePath, outputPath, { opts, type: dir });

        // Actually execute the bundled file with vm
        // OK if no error occurs
        await runGeneratedCodeInVM(outputPath, dir)

        const code = await readFile(join(outputPath, dir, BUNDLE_FILE), 'utf-8')
        expect(code).toMatchSnapshot();
      });
    }
  })
})

