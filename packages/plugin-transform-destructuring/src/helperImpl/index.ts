// TODO:
// helperImpl will be cut out as another package later

import template from '@babel/template';
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import HelperBuilder from './builder';
import {
  CatalogPlugin,
  ConfigureStorePlugin,
  DependencyResolvePlugin,
  ReferencedResolvePlugin
} from './builder/plugins';

const helper = tpl => ({
  ast: (): t.Program => template.program.ast(tpl)
})

const builder = (name: string, globalPath: NodePath): HelperBuilder => {
  const builder = new HelperBuilder(name, globalPath);
  return builder
    .use(ConfigureStorePlugin)
    .use(DependencyResolvePlugin)
    .use(ReferencedResolvePlugin)
}

export {
  builder,
  helper,
  CatalogPlugin,
  HelperBuilder,
  NodePath
}
