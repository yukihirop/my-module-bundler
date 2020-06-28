import * as t from '@babel/types';
import {
  DependencyType,
  PluginType,
  CatalogType,
  CatalogListType,
  HelperBuilderOptions,
  PluginCacheType
} from '../types'
import { plugin as pluginCache } from './cache'

const CATALOG_PLUGIN_NAME = 'Catalog'

export default class HelperBuilder {
  public helperName: string;
  public dependencies: DependencyType;
  public statement: t.Statement;
  public catalog: CatalogType
  public catalogs: CatalogListType

  constructor(helperName: string, options?: HelperBuilderOptions) {
    this.helperName = helperName;
    this.dependencies = [];
    this.statement = null;
    this.catalog = options && options["catalog"] || []
    this.catalogs = options && options["catalogs"] || []
  }

  public exec(): HelperBuilder {
    // Must be run first
    this.execCatalog();

    pluginCache.forEach(({ plugin, options }: PluginCacheType<HelperBuilder>) => plugin(this, options))
    return this
  }

  public use(plugin: PluginType<HelperBuilder>, options?: { [key: string]: any }): HelperBuilder {
    pluginCache.set(plugin.name, { plugin, options })
    return this
  }

  public setCatalog(catalog: CatalogType): void {
    this.catalog = catalog
  }

  public setCatalogs(catalogs: CatalogListType): void {
    this.catalogs = catalogs
  }

  public setDependencies(dependencies: DependencyType): void {
    this.dependencies = dependencies
  }

  public setStatement(statement: t.Statement): void {
    this.statement = statement
  }

  public program(): t.Program {
    const { catalog, helperName } = this
    return catalog[helperName].ast();
  }

  public buildStatements(): t.Statement[] {
    const { dependencies } = this
    let result = [this.statement] as t.Statement[];

    Object.entries(dependencies).map(([key, child]: [string, any]) => {
      if (child.statement) {
        result.push(...child.buildStatements())
      }
    })

    return result
  }

  private execCatalog(): HelperBuilder {
    const catalog = pluginCache.get(CATALOG_PLUGIN_NAME)
    pluginCache.delete(CATALOG_PLUGIN_NAME)
    const { plugin, options } = catalog

    return plugin(this, options)
  }
}
