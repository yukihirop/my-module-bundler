'use strict';

import Bundler from './core/bundler';
const input = process.argv[2],
  output = process.argv[3];

const bundler = new Bundler()
bundler.write({ input, output });
