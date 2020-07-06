import HelperBuilder from '..';

// MEMO:
// Take a namespace in globalPath.scope.globals and treat it as a vault during helper traversing.
// Please note that it is not the original usage of globalPath.scope.globals.
export default function ConfigureStore(builder: HelperBuilder, options?: { [key: string]: any }): HelperBuilder {
  const { globalPath, exportedStoreNamespace: esn, spitoutStoreNamespace: ssn } = builder

  const gpPath = globalPath.findParent(path => path.isProgram())
  const globals = gpPath.scope['globals']

  globals[esn] = {}
  globals[ssn] = {}

  return builder
}
