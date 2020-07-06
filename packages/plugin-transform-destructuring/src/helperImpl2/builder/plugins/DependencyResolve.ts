import { UDFPluginOptionsType } from "../../types";
import traverse from '@babel/traverse';
import { makePath } from './utils'
import { helpers as helpersStore } from '../../store';

export default function DependencyResolve(file: babel.BabelFile, options?: UDFPluginOptionsType): void {
  const { opts } = file;
  const {
    iDependencies,
    iImportPaths
  } = opts as any;

  const visitor = {
    ImportDeclaration(path) {
      const name = path.node.source.value;

      if (!helpersStore[name]) {
        throw path.buildCodeFrameError(`Unknown UDF helper ${name}`);
      }

      if (
        path.get("specifiers").length !== 1 ||
        !path.get("specifiers.0").isImportDefaultSpecifier()
      ) {
        throw path.buildCodeFrameError(
          "UDF Helpers can only import a default value"
        );
      }

      const bindingIdentifier = path.node.specifiers[0].local;
      // STEP 1: Specify dependencies
      iDependencies.set(bindingIdentifier, name);
      // STEP 2: Specify import path
      iImportPaths.push(makePath(path))

    },
    ExportDefaultDeclaration(path) {
      const declar = path.get("declaration");

      // MEMO:
      // Error if not a named function declaration
      if (declar.isFunctionDeclaration()) {
        if (!declar.node.id) {
          throw declar.buildCodeFrameError(
            "UDF Helpers should give names to their exported func declaration",
          );
        }

        // STEP 3: Each helper has only one export default name. keep its name
        opts['iExportName'] = declar.node.id.name;
      }

      // STEP 4: Each helper has only one export default path. keep its name
      opts['iExportPath'] = makePath(path);
    },
    ExportAllDeclaration(path) {
      throw path.buildCodeFrameError("UDF Helpers can only export default");
    },
    ExportNamedDeclaration(path) {
      throw path.buildCodeFrameError("UDF Helpers can only export default");
    },
    Statement(path) {
      if (path.isModuleDeclaration()) return;

      path.skip();
    },
  }

  traverse(file.ast, visitor, file.scope);
}
