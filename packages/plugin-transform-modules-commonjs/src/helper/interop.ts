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