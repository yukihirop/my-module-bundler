import HelperBuilder from '..';

// MEMO:
// Plugin for setting catalog in HelperBuilder
// Be sure to return a HelperBuilder instance
export default function Catalog(builder: HelperBuilder, options: { [key: string]: any }): HelperBuilder {
  const maybeCatalog = options["catalog"]

  if (!maybeCatalog) {
    throw new Error('Not found "Catalog"');
  }

  if (!maybeCatalog.default) {
    throw new Error('Catalog must have "default"')
  }

  const catalog = maybeCatalog.default
  const catalogs = Object.keys(catalog);

  builder.setCatalog(catalog)
  builder.setCatalogs(catalogs)

  return builder
}
