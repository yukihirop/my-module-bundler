import { NodePath } from '@babel/traverse';

import * as bt from '@babel/types';
import createBasic from './basic';
import createDefaultParameters from './default-parameters'

export default (t: typeof bt, path: NodePath, type: string) => {
  const basicBody = createBasic(t, path, type)
  const beforeInsertBodies = createDefaultParameters(t, path)

  return [...beforeInsertBodies, basicBody].filter(Boolean)
}
