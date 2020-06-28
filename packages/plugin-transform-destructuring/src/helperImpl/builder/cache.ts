import { PluginCacheType } from '../types'
import HelperBuilder from '.';

export let plugin = new Map<string, PluginCacheType<HelperBuilder>>();
export let imported = new Map<string, string>();

export function clear() {
  clearPlugin();
  clearImported();
}

export function clearPlugin() {
  plugin = new Map();
}

export function clearImported() {
  imported = new Map();
}


