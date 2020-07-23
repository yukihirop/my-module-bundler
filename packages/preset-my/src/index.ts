import * as p from './availablePlugin';
import { BabelTypes } from './types';

export default function ({ types: t }: BabelTypes) {
  return {
    plugins: [
      p.transformArrowFunctions,
      p.transformDestructuring,
      p.transformModuleCommonjs,
      p.transformTypeofSymbol,
    ].filter(Boolean),
  };
}
