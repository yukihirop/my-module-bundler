import { PluginCacheType } from '../types'
import HelperBuilder from '.';

export let plugin = new Map<string, PluginCacheType<HelperBuilder>>();

export function clear() {
  clearPlugin();
}

export function clearPlugin() {
  plugin = new Map();
}


