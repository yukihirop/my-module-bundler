import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import {
  DependencyType,
  PluginType,
  CatalogType,
  CatalogListType,
  HelperBuilderOptions,
  PluginCacheType,
  StoreType
} from '../types'
import { plugin as pluginCache } from './cache'

const CATALOG_PLUGIN_NAME = 'Catalog'
const EXPORTED_STORE_NAMESPACE = '__babel-udf-helpers_exported'
const SPITOUT_STORE_NAMESPACE = '__babel-udf-helpers_spitout'

export default class HelperBuilder {
  public helperName: string;
  public globalPath: NodePath;
  public dependencies: DependencyType;
  public statement: t.Statement;
  public path: NodePath;
  public catalog: CatalogType
  public catalogs: CatalogListType
  public _file: t.File
  public exportedStoreNamespace: string
  public spitoutStoreNamespace: string

  constructor(helperName: string, globalPath: NodePath, options?: HelperBuilderOptions) {
    this.helperName = helperName;
    this.globalPath = globalPath
    this.dependencies = [];
    this.statement = null;
    this.path = null;
    this.catalog = options && options["catalog"] || []
    this.catalogs = options && options["catalogs"] || []
    this.exportedStoreNamespace = EXPORTED_STORE_NAMESPACE
    this.spitoutStoreNamespace = SPITOUT_STORE_NAMESPACE
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

  public updateCatalogAll(beforeName: string, afterName: string): void {
    this.updateCatalog(beforeName, afterName)
    this.updateCatalogs()
  }

  public updateHelperName(name: string): void {
    this.helperName = name
  }

  public file(): t.File {
    return this._file || t.file(this.program())
  }

  public setFile(file: t.File): void {
    this._file = file
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

  public setPath(path: NodePath): void {
    this.path = path
  }

  public setStatement(statement: t.Statement): void {
    this.statement = statement
  }

  public buildStatements(): t.Statement[] {
    const { dependencies, globalPath, spitoutStoreNamespace: ssn } = this
    let result = [this.statement] as t.Statement[];

    // MEMO:
    // Not methodized so that store (globals) is not bound to this
    // It doesn't make sense to not reference the same thing in all HelperBuilder instances
    const gpPath = globalPath.findParent(path => path.isProgram())
    const globals = gpPath.scope['globals']
    const splitoutStore = globals[ssn]

    Object.entries(dependencies).map(([key, child]: [string, any]) => {
      if (child.statement) {
        child.buildStatements().forEach((statement: t.Statement) => {
          // Once spit outed, do not spit out separately
          const name = statement['id']['name']
          if (!splitoutStore[name]) {
            result.push(statement)
            splitoutStore[name] = name
          }
        })
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

  private updateCatalog(beforeName: string, afterName: string): void {
    const { catalog } = this
    const before = catalog[beforeName]
    catalog[afterName] = before
  }

  private updateCatalogs(): void {
    this.setCatalogs(Object.keys(this.catalog))
  }

  private program(): t.Program {
    const { catalog, helperName } = this
    return catalog[helperName].ast();
  }

  private getGlobals(): any {
    const { globalPath } = this
    const gpPath = globalPath.findParent(path => path.isProgram())
    return gpPath.scope['globals']
  }
}
