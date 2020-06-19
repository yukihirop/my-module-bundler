import * as t from '@babel/types';

export const functionize = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const INTEROP_REQUIRE_DEFAULT = '_interopRequireDefault';
export const INTEROP_REQUIRE_WILDCARD = '_interopRequireWildcard';
export const REQUIRE = 'require';
export const ES_MODULE = '__esModule';

export const judgeRequireType = <T>(specifiers: T[], type: 'import' | 'export'): string => {
  if (type === 'import') {
    return judgeRequireTypeAtImport(specifiers);
  } else if (type === 'export') {
    return judgeRequireTypeAtExport(specifiers);
  }
};

const judgeRequireTypeAtImport = <
  T = t.ImportNamespaceSpecifier | t.ImportDefaultSpecifier | t.ImportSpecifier
>(
  specifiers: T[]
): string => {
  let requireType = 'require';
  const specifierTypes = specifiers.map((s: T) => s['type']);

  // judge from specifierTypes
  if (specifierTypes.includes('ImportDefaultSpecifier') && specifiers.length > 1) {
    requireType = INTEROP_REQUIRE_WILDCARD;
  } else if (specifierTypes.includes('ImportNamespaceSpecifier')) {
    requireType = INTEROP_REQUIRE_WILDCARD;
  } else {
    // judge from localName or imortedName
    specifiers.forEach((specifier: T) => {
      const localName = specifier['local'] ? specifier['local'].name : null;
      const importedName = specifier['imported'] ? specifier['imported'].name : null;

      const interopRequireDefaultCondition =
        localName === 'default' ||
        importedName === 'default' ||
        specifier['type'] === 'ImportDefaultSpecifier';
      if (interopRequireDefaultCondition) requireType = INTEROP_REQUIRE_DEFAULT;
    });
  }

  return requireType;
};

const judgeRequireTypeAtExport = <T = t.ExportSpecifier>(specifiers: T[]): string => {
  let requireType = 'require';

  specifiers.forEach((specifier: T) => {
    const localName = specifier['local'] ? specifier['local'].name : null;

    const interopRequireDefaultCondition = localName === 'default';
    if (interopRequireDefaultCondition) requireType = INTEROP_REQUIRE_DEFAULT;
  });

  return requireType;
};

export const createImportedMap = (
  localName: string,
  specifiers: t.ImportNamespaceSpecifier[] | t.ImportDefaultSpecifier[] | t.ImportSpecifier[]
): Map<string, any> => {
  const mapData = (specifiers as any[]).map(
    (s: t.ImportNamespaceSpecifier | t.ImportDefaultSpecifier | t.ImportSpecifier) => {
      const specLocalName = s['local'].name;
      const specImportedName = s['imported'] ? s['imported'].name : null;
      const specType = s['type'];

      if (!specImportedName) {
        if (specType === 'ImportDefaultSpecifier') {
          return [specLocalName, { localName, key: 'default' }];
        } else if (specType === 'ImportNamespaceSpecifier') {
          return [specLocalName, { localName, key: null }];
        }
      } else if (specType === 'ImportSpecifier') {
        if (specImportedName) {
          return [specLocalName, { localName, key: specImportedName }];
        } else {
          return [specLocalName, { localName, key: specLocalName }];
        }
      }
    }
  ) as Array<[string, any]>;
  return new Map<string, any>(mapData);
};
