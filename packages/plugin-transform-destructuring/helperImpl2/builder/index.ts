import * as t from '@babel/types'
import {
  plugin as pluginStore,
  helpers as helpersStore
} from '../store';
import {
  DependencyResolvePlugin as execDependencyResolvePlugin,
  ReferencedResolvePlugin as execReferencedResolvePlugin,
  ProgramBuildPlugin as execProgramBuildPlugin
} from './plugins';
import {
  UDFUsePluginType,
  UDFHelperType
} from '../types';

type GetType = {
  name: string;
  currentId?: t.Identifier;
  currentDependencies?: { [key: string]: t.Identifier };
  currentLocalBindingNames?: string[]
}

let fileClass = undefined

function createBuilderFile(helper: UDFHelperType): babel.BabelFile {
  if (fileClass) {
    const options = {
      iGlobals: new Set<string>(),
      iLocalBindingNames: new Set<string>(),
      iDependencies: new Map<t.Identifier, string>(),
      iImportBindingsReferences: new Array<string>(),
      iImportPaths: new Array<string>(),
      iExportBindingAssignments: new Array<string>(),
      iExportName: undefined,
      iExportPath: undefined
    }
    const params = { ast: t.file(helper.ast()), code: "" }
    const file = new fileClass(options, params)
    return file
  }
}

// Execute User Define Plugin
function execUserDefinePlugin(file: babel.BabelFile) {
  pluginStore.forEach(({ plugin, options }: UDFUsePluginType<babel.BabelFile>) => plugin(file, options))
}

// MEMO:
// The helperDataCache cannot be hoisted, so the valid objects below are
const helperDataCache = Object.create(null);
function loadHelper(name: string) {

  if (!helperDataCache[name]) {
    const helper = helpersStore[name]
    if (!helper) {
      throw Object.assign(new ReferenceError(`Unknown helper ${name}`), {
        code: "BABEL_UDF_HELPER_UNKNOWN",
        helper: name,
      });
    }

    const builderFile = createBuilderFile(helper)

    // Traverse import statements and build global variable dependencies
    execDependencyResolvePlugin(builderFile)
    execReferencedResolvePlugin(builderFile)


    helperDataCache[name] = {
      build: ({ currentId, currentDependencies, currentLocalBindingNames }) => {
        /**
         * Remove helper export default.
         * ・Remove helper import.
         * ・Resolve Referenced Identifier. (rename)
         * ・Global variable traversal (globals)
         * ・Helper code to actually write (nodes)
         */
        execProgramBuildPlugin(builderFile, { currentId, currentDependencies, currentLocalBindingNames })
        execUserDefinePlugin(builderFile)

        return {
          nodes: builderFile.ast.program.body,
          globals: builderFile.opts['iGlobals']
        }
      },
      dependencies: () => builderFile.opts['iDependencies']
    }
  }
  return helperDataCache[name]
}

export function getDependencies(name: string): string[] {
  return loadHelper(name).dependencies().values()
}

export function buildProgram({
  name,
  currentId,
  currentDependencies,
  currentLocalBindingNames
}: GetType) {
  return loadHelper(name).build({ currentId, currentDependencies, currentLocalBindingNames })
}


/**
 * MEMO:
 * Initialize
 *  ・Setting the builder class to build the helper.
 *  ・Setting dependencies (global) when renaming etc. are not considered.
 */
export function ensure(name: string, builderFileClass: babel.BabelFile) {
  if (!fileClass) fileClass = builderFileClass
  loadHelper(name)
}

