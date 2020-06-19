import { NodePath } from '@babel/traverse';
import { BabelTypes } from '../types';

import { ImportDeclarationTraverser, ImportReferencedIdentifierTraverser } from '../traverser';

export default function ({ types: t }: BabelTypes) {
  return {
    // Code that doesn't need to be converted and needed to avoid getting caught in binding
    enter({ scope }) {
      scope.rename('module');
      scope.rename('exports');
      scope.rename('require');
      scope.rename('__dirname');
      scope.rename('__filename');
    },
    visitor: {
      ReferencedIdentifier(path: NodePath) {
        const traverser = new ImportReferencedIdentifierTraverser(path, this);
        const skip = traverser.run();
        if (skip) return;
      },
      ImportDeclaration(path: NodePath) {
        const traverser = new ImportDeclarationTraverser(path, this);
        traverser.run();
      },
    },
  };
}
