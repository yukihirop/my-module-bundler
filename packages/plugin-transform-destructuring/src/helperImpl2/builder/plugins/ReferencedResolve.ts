import { UDFPluginOptionsType } from "../../types";
import traverse, { NodePath } from '@babel/traverse';
import { makePath } from './utils';

export default function ReferencedResolve(file: babel.BabelFile, options?: UDFPluginOptionsType): void {
  const { opts } = file;
  const {
    iDependencies,
    iLocalBindingNames,
    iGlobals,
    iImportBindingsReferences,
    iExportBindingAssignments,
    iExportName
  } = opts as any;

  const visitor = {
    Program(path: NodePath) {
      const bindings = path.scope.getAllBindings()
      Object.keys(bindings).forEach(name => {
        if (name === iExportName) return;
        if (iDependencies.has(bindings[name].identifier)) return;
        // STEP 1: Local binding identification
        iLocalBindingNames.add(name);
      })
    },
    ReferencedIdentifier(path: NodePath) {
      const name = path.node['name'];
      const binding = path.scope.getBinding(name /* noGlobal */);
      if (!binding) {
        // STEP2: Global binding identification
        iGlobals.add(name);
      } else if (iDependencies.has(binding.identifier)) {
        // STEP 3: Identify what was imported
        iImportBindingsReferences.push(makePath(path))
      }
    },
    AssignmentExpression(path) {
      const left = path.get("left");

      /**
       * MEMO:
       * 
       * The following example will be a return
       * 
       * helper`
       * 
       * undefined = 1;
       * str = 'hoge'
       *
       * `
       */
      if (!(iExportName in left.getBindingIdentifiers())) return;

      /**
       * MEMO:
       * 
       *　↓↓↓ I can't think of an example where processing goes below this ↓↓↓
       *　It is written in the code on the babel side, and it is written because it seems to be meaningful code
       *
       *  https://github.com/babel/babel/blob/3d498d05e737b6b497df55a177c113fd8167b744/packages/babel-helpers/src/index.js#L103-L113
       */

      
      if (!left.isIdentifier()) {
        throw left.buildCodeFrameError(
          "Only simple assignments to exports are allowed in UDF helpers",
        )
      }

      const binding = path.scope.getBinding(iExportName);
      if (binding?.scope.path.isProgram()) {
        iExportBindingAssignments.push(makePath(path))
      }
    }
  }
  traverse(file.ast, visitor as any, file.scope)
}
