import {
  builder as baseBuilder,
  CatalogPlugin,
  HelperBuilder
} from './helperImpl'
import * as catalog from './catalog'

const helper = (name: string): HelperBuilder => {
  const builder = baseBuilder(name);
  return builder
    .use(CatalogPlugin, { catalog })
    .exec()
}

export default helper
