import * as t from '@babel/types';
import { UDFPluginOptionsType } from "../../types";
import traverse, { NodePath } from "@babel/traverse";

export default function ProgramBuild(file: babel.BabelFile, options: UDFPluginOptionsType): void {
  const { opts } = file;
  const {
    iDependencies,
    iLocalBindingNames,
    iImportPaths,
    iImportBindingsReferences,
    iExportPath,
    iExportName,
    iExportBindingAssignments
  } = opts as any;
  const {
    currentId,
    currentDependencies,
    currentLocalBindingNames
  } = options

  if (currentLocalBindingNames && !currentId) throw new Error("Unexpected local bindings for module-based UDF helpers.")
  if (!currentId) return;

  // STEP1: Update dependency
  const updatedDependencies = {}
  iDependencies.forEach((name: string, id: t.Identifier) => {
    updatedDependencies[id.name] = currentDependencies[name]
  })

  const renames = {}
  const cBindingNameSet = new Set(currentLocalBindingNames || [])
  iLocalBindingNames.forEach((name: string) => {
    let newName = name;
    while (cBindingNameSet.has(newName)) newName = `_${newName}`;
    // STEP2: Identifying the name change target
    if (newName !== name) renames[name] = newName;
  })

  const visitor = {
    Program(path: NodePath) {
      const exportNode = path.get(iExportPath) as NodePath
      const importPaths = iImportPaths.map(p => path.get(p))
      const importBindingRefs = iImportBindingsReferences.map(p => path.get(p));

      const declar = exportNode.get("declaration") as NodePath;
      if (currentId.type === "Identifier") {
        if (declar.isFunctionDeclaration()) {
          // STEP 3.1: Remove export default (Function Declaration)
          exportNode.replaceWith(declar);
        } else {
          // STEP 3.2: Remove export defualt (Function Expression)
          exportNode.replaceWith(
            t.variableDeclaration("var",
              [
                t.variableDeclarator(currentId, (declar as any)['node'])
              ]
            )
          );
        }
      } else if (currentId.type === "MemberExpression") {
        if (declar.isFunctionDeclaration()) {
          iExportBindingAssignments.forEeach(assignPath => {
            const assign = path.get(assignPath);
            (assign as NodePath).replaceWith(t.assignmentExpression("=", currentId, assign['node']));
          });
          exportNode.replaceWith(declar);
          /**
           * Cannot resolve pushContainer type
           * https://github.com/DefinitelyTyped/DefinitelyTyped/commit/248de54338ef00c66f904aa06c568893d4692f16#diff-a73ef04a9efc8d29b305baa51072da24R447
           * 
           */
          // @ts-ignore
          path.pushContainer('body', t.expressionStatement(t.assignmentExpression("=", currentId, t.identifier(iExportName)))
          );
        } else {
          exportNode.replaceWith(
            t.expressionStatement(t.assignmentExpression("=", currentId, (declar as NodePath<any>)['node']))
          );
        }
      } else {
        throw new Error("Unexpected UDF helper format.");
      }

      Object.keys(renames).forEach((name: string) => {
        path.scope.rename(name, renames[name]);
      });

      // STEP 4: Remove imports from helpers
      for (const path of importPaths) path.remove();
      for (const path of importBindingRefs) {
        const id = updatedDependencies[path['node'].name];
        const node = t.cloneNode<t.Statement>(id);
        // STEP 5: Rename import binding reference
        (path as NodePath).replaceWith<t.Statement>(node);
      }

      // STEP 6: Stop traversing for helpers
      path.stop();
    }
  }

  // MEMO
  // Workaround Error: Argument of type '{ Program(path: NodePath<Node>): void; }' is not assignable to parameter of type 'TraverseOptions<Node>'.
  traverse(file.ast, visitor as any, file.scope)
}
