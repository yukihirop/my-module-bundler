import * as babel from '@babel/core';
import {
  UDFUsePluginOptionsType,
  UDFPluginOptionsType,
  UDFPluginType
} from '../types';
import * as _file from './file';
import {
  plugin as pluginStore,
  helpers as helpersStore
} from '../store'
import {
  AlreadyImplementedError,
  NotFoundError
} from '../errors'

export default function useDangerousUDFHelpers(pass: babel.PluginPass, opts: UDFUsePluginOptionsType) {
  // addUDFHelper Function existence check
  if (
    typeof pass.file['addUDFHelper'] === 'function' ||
    typeof pass['addUDFHelper'] === 'function'
  ) throw new AlreadyImplementedError(`
This tool cannot be used. officially supported.
Please see the official documentation.

https://babeljs.io/docs/en/babel-helpers
`)

  Object.defineProperty(pass.file, 'addUDFHelper', {
    enumerable: true,
    get: function addUDFHelper() {
      return _file.addUDFHelper.bind(pass.file);
    }
  })

  Object.defineProperty(pass, 'addUDFHelper', {
    enumerable: true,
    get: function addUDFHelper() {
      return _file.addUDFHelper.bind(pass.file);
    }
  })

  const helpers = opts["helpers"];
  if (helpers) {
    /**
     * Support import default and named
     *
     * import * as helpers from './helpers'
     * import helpers from './helpers'
     */
    Object.assign(helpersStore, helpers.default ? helpers.default : helpers)
  } else {
    throw new NotFoundError('Not found "UDF helpers"')
  }

  const usePlugin = opts["usePlugin"] || [];
  if (usePlugin) {
    usePlugin.forEach(([plugin, options]: [UDFPluginType, UDFPluginOptionsType]) => {
      pluginStore.set(plugin.name, { plugin, options })
    })
  }
}
