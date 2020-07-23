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

## Example

```bash
yarn bundler:dev ./example/destructuring/call-expression-array-basic/entry.js ./dist/destructuring/call-expression-array-basic.js
```

## Test

```bash
yarn test
```

## .mmbrc

Same as `.babelrc`.  
Write with nodejs.

```js
const path = require('path');

module.exports =
{
  "presets": [path.resolve(__dirname, "packages/preset-my")]
}
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
