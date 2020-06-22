'use strict';

import fs from 'fs';
import transformArrowFunctions from '@yukihirop/plugin-transform-arrow-functions';
import transformModulesCommonjs from '@yukihirop/plugin-transform-modules-commonjs';

import Bundler from './core/bundler';
import { OptionsType } from './core/types'

const isExistFile = (file) => {
  try {
    fs.statSync(file)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') return false;
  }
}

const currentPath = fs.realpathSync('./');
const settingPath = process.env.MMBRC_PATH ? process.env.MMBRC_PATH : `${currentPath}/.mmbrc`;
const options: OptionsType | undefined = isExistFile(settingPath) ? require(settingPath) : undefined

const input = process.argv[2],
  output = process.argv[3],
  defaultOptions = {
    "plugins": [
      [transformArrowFunctions, {}],
      [transformModulesCommonjs, {}]
    ]
  } as OptionsType
const bundler = new Bundler(options || defaultOptions);
bundler.write({ input, output });
