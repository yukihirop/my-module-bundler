import { ExportSpecifier, ImportNamespaceSpecifier, ImportDefaultSpecifier } from '@babel/types';

export const functionize = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const INTEROP_REQUIRE_DEFAULT = '_interopRequireDefault';
export const INTEROP_REQUIRE_WILDCARD = '_interopRequireWildcard';
export const judgeRequireType = (specifiers: ExportSpecifier[] | ImportDefaultSpecifier[] | ImportNamespaceSpecifier[]) => {
  let requireType = 'require';

  specifiers.forEach((specifier: any) => {
    const localName = specifier.local ? specifier.local.name : null;
    const importedName = specifier.imported ? specifier.imported.name : null;

    const interopRequireDefaultCondition =
      (localName === 'default') ||
      (specifier.type === 'ImportDefaultSpecifier') ||
      (importedName === 'default')
    if (interopRequireDefaultCondition) requireType = INTEROP_REQUIRE_DEFAULT;

    const interopRequireWildcardCondition =
      (specifier.type === 'ImportNamespaceSpecifier')
    if (interopRequireWildcardCondition) requireType = INTEROP_REQUIRE_WILDCARD;
  });

  return requireType;
};
