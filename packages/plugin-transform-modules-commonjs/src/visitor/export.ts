import { NodePath } from '@babel/traverse';
import { BabelTypes } from '../types';
import {
  ExportAllDeclarationTraverser,
  ExportNamedDeclarationTraverser,
  ExportDefaultDeclarationTraverser
} from '../traverser'

export default function ({ types: t }: BabelTypes) {
  return {
    visitor: {
      ExportAllDeclaration(path: NodePath) {
        this.IsESModule = true;

        const traverser = new ExportAllDeclarationTraverser(path)
        traverser.run()
      },
      ExportNamedDeclaration(path: NodePath) {
        this.IsESModule = true;

        const traverser = new ExportNamedDeclarationTraverser(path, this)
        traverser.run()
      },
      ExportDefaultDeclaration(path: NodePath) {
        this.IsESModule = true;

        const traverser = new ExportDefaultDeclarationTraverser(path, this)
        traverser.run()
      }
    },
  };
}
