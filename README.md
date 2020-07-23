## My module bundler

It it a module bundler with the following transform plugins.  
The module bundler is based on [minipack](https://github.com/ronami/minipack).

#### plugins

- @yukihirop/plugin-transform-arrow-functions
- @yukihirop/plugin-transform-destructuring (coverage 60%)
- @yukihirop/plugin-transform-modules-commonjs
- @yukihirop/plugin-transform-typeof-symbol

#### presets

- @yukihirop/preset-my
  - @yukihirop/plugin-transform-arrow-functions
  - @yukihirop/plugin-transform-destructuring (coverage 60%)
  - @yukihirop/plugin-transform-modules-commonjs
  - @yukihirop/plugin-transform-typeof-symbol

Since only `destructuring` is complicated to implement, the coverage (type that can be converted) is low.

## Development

```bash
yarn
lerna bootstrap
```

Tips for operating the library for each package

https://github.com/yukihirop/my-module-bundler/issues/1

## Example

```bash
yarn bundler:dev ./example/destructuring/call-expression-array-basic/entry.js ./dist/destructuring/call-expression-array-basic.js
```

## Test

```bash
yarn test
```

```
$ yarn test
yarn run v1.19.0
$ yarn build && jest --verbose
$ yarn clean && tsc -b packages/bundler packages/plugin-transform-arrow-functions packages/plugin-transform-modules-commonjs packages/plugin-transform-typeof-symbol packages/plugin-transform-destructuring packages/preset-my
$ rimraf packages/**/lib
 PASS  packages/plugin-transform-arrow-functions/__tests__/plugin-transform-arrow-functions.test.ts
  arrow-functions
    ✓ basic (91 ms)
    ✓ default-parameters (18 ms)
    ✓ expression (10 ms)
    ✓ nested (14 ms)
    ✓ paran-insertion (9 ms)
    ✓ spec-naming (9 ms)

 PASS  packages/plugin-transform-typeof-symbol/__tests__/plugin-transform-typeof-symbol.test.ts
  typeof-symbol
    ✓ basic (97 ms)
    ✓ builtin-global (204 ms)
    ✓ builtin-global-string (74 ms)
    ✓ typeof-typeof (15 ms)
    ✓ non-typeof (7 ms)
    ✓ typeof-function-declaration (16 ms)
    ✓ typeof-function-expression-var (17 ms)
    ✓ typeof-function-expression-func (16 ms)

 PASS  packages/plugin-transform-destructuring/__tests__/plugin-transform-destructuring.test.ts
  destructuring
    ✓ array-basic (66 ms)
    ✓ array-rest-basic (19 ms)
    ✓ array-rest-nested (19 ms)
    ✓ array-overflow (17 ms)
    ✓ array-self-reference (13 ms)
    ✓ array-assignment-function-block (12 ms)
    ✓ object-basic (23 ms)
    ✓ object-rest-basic (67 ms)
    ✓ object-rest-nested (58 ms)
    ✓ object-overflow (26 ms)
    ✓ object-assignment-function-block (10 ms)
    ✓ call-expression-array-basic (53 ms)
    ✓ call-expression-array-helper-rename (40 ms)
    ✓ call-expression-array-self-reference (27 ms)
  destructuring(err)
    ✓ call-expression-array-init-mix (31 ms)

 PASS  packages/plugin-transform-modules-commonjs/__tests__/plugin-transform-modules-commonjs.test.ts
  modules-commonjs
    interop
      ✓ export-default-literal (71 ms)
      ✓ export-default-oe (18 ms)
      ✓ export-default-ae (23 ms)
      ✓ export-default-fd (13 ms)
      ✓ export-default-fd-id-name (13 ms)
      ✓ export-default-ce (16 ms)
      ✓ export-default-ne (16 ms)
      ✓ export-from-all (24 ms)
      ✓ export-from-named (18 ms)
      ✓ export-from-named-multi (15 ms)
      ✓ export-from-as (11 ms)
      ✓ export-from-as-default (15 ms)
      ✓ export-from-as-mix (27 ms)
      ✓ export-from-default-as (35 ms)
      ✓ export-named (11 ms)
      ✓ export-named-multi (11 ms)
      ✓ export-named-as (12 ms)
      ✓ export-named-as-default (11 ms)
      ✓ export-named-as-mix (15 ms)
      ✓ export-named-remap (10 ms)
      ✓ export-variables (49 ms)
      ✓ import-default-literal (20 ms)
      ✓ import-default-as (17 ms)
      ✓ import-wildcard-as (53 ms)
      ✓ import-as-mix (27 ms)
      ✓ import-named (12 ms)
      ✓ import-named-multi (13 ms)
      ✓ import-named-as-mix (9 ms)
      ✓ import-basic (9 ms)
      ✓ import-hoist (17 ms)
      ✓ import-global-variable-unbind (12 ms)
      ✓ import-wildcard-as-hoist (27 ms)
      ✓ export-hoist-function-success (13 ms)
      ✓ export-rename-hoist (21 ms)
      ✓ export-rename-not-hoist (19 ms)
      ✓ export-illegal (4 ms)
      ✓ export-hoist-function-failure (16 ms)
    misc(throw error)
      ✓ import-global-variable-throw-bs (20 ms)
      ✓ import-global-variable-throw-ae (9 ms)
      ✓ import-global-variable-throw-id (11 ms)
      ✓ import-global-variable-throw-bs-ls (15 ms)
      ✓ undefined-this-computed-class-method (7 ms)
      ✓ undefined-this-root-call (5 ms)
    misc
      ✓ this-computed-class-method-wrap-func (7 ms)
      ✓ undefined-this-root-declaration (5 ms)
      ✓ undefined-this-root-reference (5 ms)
    noInterop
      ✓ import-default (8 ms)
      ✓ import-wildcard (9 ms)
      ✓ export-named-from (12 ms)
    loose
      ✓ export-default (11 ms)
    strictMode
      ✓ false (6 ms)

Test Suites: 4 passed, 4 total
Tests:       80 passed, 80 total
Snapshots:   79 passed, 79 total
Time:        3.046 s
Ran all test suites.
✨  Done in 14.97s.
```

## .mmbrc

Same as `.babelrc`.  
Write with nodejs.

```js
const path = require('path');

module.exports = {
  presets: [path.resolve(__dirname, 'packages/preset-my')],
};
```

or

```js
const path = require('path');

module.exports = {
  "plugins: [
    path.resolve(__dirname, "packages/plugin-transform-arrow-functions"),
    path.resolve(__dirname, "packages/plugin-transform-destructuring"),
    path.resolve(__dirname, "packages/plugin-transform-modules-commonjs"),
    path.resolve(__dirname, "packages/plugin-transform-typeof-symbol")
  ]
}
```
