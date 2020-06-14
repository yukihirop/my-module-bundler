import { NodePath } from '@babel/traverse';

export default function ({ types: t }) {
  debugger;

  return {
    name: 'transform-arrow-functions',
    visitor: {
      ArrowFunctionExpression(path: NodePath) {
        debugger;
        if (!path.isArrowFunctionExpression()) return;
      },
    },
  };
}
