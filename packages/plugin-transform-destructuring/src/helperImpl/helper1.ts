import {
  builder as baseBuilder,
  CatalogPlugin,
  HelperBuilder,
  NodePath
} from '.'
import * as catalog from './catalog'

const helper = (name: string, globalPath: NodePath): HelperBuilder => {
  const builder = baseBuilder(name, globalPath);
  return builder
    .use(CatalogPlugin, { catalog })
    .exec()
}

export default helper
