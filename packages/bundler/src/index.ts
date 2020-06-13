'use strict';

import bundler from './core';
const input = process.argv[2],
  output = process.argv[3];

bundler({ input, output });
