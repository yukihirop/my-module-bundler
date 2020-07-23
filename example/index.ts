import fs from 'fs';
import { Bundler, types as t } from '@yukihirop/bundler';

const isExistFile = (file) => {
  try {
    fs.statSync(file);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
  }
};
const currentPath = fs.realpathSync('./');
const settingPath = process.env.MMBRC_PATH ? process.env.MMBRC_PATH : `${currentPath}/.mmbrc`;
const options: t.OptionsType | undefined = isExistFile(settingPath)
  ? require(settingPath)
  : undefined;
if (options === undefined) {
  throw new Error('".mmbrc" file is not found.')
} else {
  if (options && !(options["plugins"] || options["presets"])) {
    throw new Error("Plugin is not set.")
  }
}
const input = process.argv[2],
  output = process.argv[3];
const bundler = new Bundler(options);
bundler.write({ input, output });
