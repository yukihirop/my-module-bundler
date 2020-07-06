import {
  UDFUsePluginType,
  UDFHelpersType
} from './types'

export let plugin = new Map<string, UDFUsePluginType>();
export let helpers = Object.create(null) as UDFHelpersType;

export function clear() {
  clearPlugin();
  clearHelpers();
}

export function clearPlugin() {
  plugin = new Map<string, UDFUsePluginType>();
}

export function clearHelpers() {
  helpers = Object.create(null) as UDFHelpersType;
}
