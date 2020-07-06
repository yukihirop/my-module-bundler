import { NodePath } from '@babel/traverse';

// MEMO:
// generate <path> used by path.get(<path>)
export function makePath(path: NodePath): string {
  const parts = [];
  // If the parent exists, set it to path and execute it.Execution ends when there are no parents
  for (; path.parentPath; path = path.parentPath) {
    parts.push(path.key);
    if (path.inList) parts.push(path.listKey);
  }

  return parts.reverse().join(".")
}
