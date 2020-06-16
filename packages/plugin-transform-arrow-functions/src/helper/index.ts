import { Node, NodePath } from '@babel/traverse';

export const hasDefaultParameter = (node: Node) => {
  const nodeType = node["type"]
  return nodeType === 'AssignmentPattern' && !!node["right"] || false
}

// Leave only those parameters that do not have an initial value
export const createBodyParameters = (path: NodePath) => {
  return path.node["params"].filter((node: Node) => !hasDefaultParameter(node))
}
