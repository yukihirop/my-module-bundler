import { BabelTypes } from './types';
import { exportVisitor } from './visitor';

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-modules-commonjs',
    visitor: {
      ...exportVisitor({ types: t }).visitor
    }
  }
}
