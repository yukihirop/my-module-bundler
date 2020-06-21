export * from './interop'

import * as t from '@babel/types';
import { MapValueType } from '../types'
import { NodePath } from '@babel/traverse';

export const createImportedMapData = (
  localName: string,
  specifiers: t.ImportNamespaceSpecifier[] | t.ImportDefaultSpecifier[] | t.ImportSpecifier[]
): Array<[string, MapValueType]> => {
  const mapData = (specifiers as any[]).map(
    (s: t.ImportNamespaceSpecifier | t.ImportDefaultSpecifier | t.ImportSpecifier) => {
      const specLocalName = s['local'].name;
      const specImportedName = s['imported'] ? s['imported'].name : null;
      const specType = s['type'];

      if (!specImportedName) {
        if (specType === 'ImportDefaultSpecifier') {
          return [specLocalName, { localName, key: 'default' }];
        } else if (specType === 'ImportNamespaceSpecifier') {
          return [specLocalName, { localName, key: null }];
        }
      } else if (specType === 'ImportSpecifier') {
        if (specImportedName) {
          return [specLocalName, { localName, key: specImportedName }];
        } else {
          return [specLocalName, { localName, key: specLocalName }];
        }
      }
    }
  ) as Array<[string, MapValueType]>;

  return mapData;
};

export const isInStrictMode = (path: NodePath) => !!path.find(({ node }) => {
  for (const directive of node['directives']) {
    if (directive.value.value === "use strict") {
      return true;
    }
  }
})
