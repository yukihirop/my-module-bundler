import * as t from '@babel/types';

export const functionize = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const INTEROP_REQUIRE_DEFAULT = '_interopRequireDefault';
export const INTEROP_REQUIRE_WILDCARD = '_interopRequireWildcard';
export const REQUIRE = 'require';
export const ES_MODULE = '__esModule';
export const TYPE_DEFAULT = 'default';
export const TYPE_WILDCARD = 'wildcard';
export const TYPE_OTHER = 'other';

export const judgeImportOrExportType = <T>(specifiers: T[], type: 'import' | 'export'): string => {
  if (type === 'import') {
    return judgeImportType(specifiers);
  } else if (type === 'export') {
    return judgeExportType(specifiers);
  }
};

const judgeImportType = <
  T = t.ImportNamespaceSpecifier | t.ImportDefaultSpecifier | t.ImportSpecifier
>(
  specifiers: T[]
): string => {
  let importType = TYPE_OTHER;
  const specifierTypes = specifiers.map((s: T) => s['type']);

  // judge from specifierTypes
  if (specifierTypes.includes('ImportDefaultSpecifier') && specifiers.length > 1) {
    importType = TYPE_WILDCARD;
  } else if (specifierTypes.includes('ImportNamespaceSpecifier')) {
    importType = TYPE_WILDCARD;
  } else {
    // judge from localName or imortedName
    specifiers.forEach((specifier: T) => {
      const localName = specifier['local'] ? specifier['local'].name : null;
      const importedName = specifier['imported'] ? specifier['imported'].name : null;

      const interopRequireDefaultCondition =
        localName === 'default' ||
        importedName === 'default' ||
        specifier['type'] === 'ImportDefaultSpecifier';
      if (interopRequireDefaultCondition) importType = TYPE_DEFAULT;
    });
  }

  return importType;
};

const judgeExportType = <T = t.ExportSpecifier>(specifiers: T[]): string => {
  let exportType = TYPE_DEFAULT;

  specifiers.forEach((specifier: T) => {
    const localName = specifier['local'] ? specifier['local'].name : null;

    const interopRequireDefaultCondition = localName === 'default';
    if (interopRequireDefaultCondition) exportType = TYPE_DEFAULT;
  });

  return exportType;
};


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
  let requireType = REQUIRE;
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
  let requireType = REQUIRE;

  specifiers.forEach((specifier: T) => {
    const localName = specifier['local'] ? specifier['local'].name : null;

    const interopRequireDefaultCondition = localName === 'default';
    if (interopRequireDefaultCondition) requireType = INTEROP_REQUIRE_DEFAULT;
  });

  return requireType;
};
