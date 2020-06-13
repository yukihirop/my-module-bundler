'use strict';

const bundler = require('./core')
  , input = process.argv[2]
  , output = process.argv[3];

bundler({ input, output })
