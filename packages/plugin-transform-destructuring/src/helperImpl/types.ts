export type DependencyType = { [key: string]: any };
export type PluginOptionsType = { [key: string]: any }
export type PluginType<T> = (builder: T, options: PluginOptionsType) => T;
export type CatalogType = { [key: string]: any };
export type CatalogListType = string[];
export type HelperBuilderOptions = {
  catalog: CatalogType
  catalogs: CatalogListType
}
export type PluginCacheType<T> = {
  plugin: PluginType<T>;
  options?: PluginOptionsType;
}
export type StoreType = { [key: string]: string }
