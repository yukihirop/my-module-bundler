import { ExportSpecifier } from '@babel/types';
import { ImportDefaultSpecifier } from 'babel-types';

export const functionize = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const INTEROP_REQUIRE_DEFAULT = '_interopRequireDefault';
export const judgeRequireType = (specifiers: ExportSpecifier[] | ImportDefaultSpecifier[]) => {
  let requireType = 'require';

  specifiers.forEach((specifier: any) => {
    const localName = specifier.local ? specifier.local.name : null;
    const importedName = specifier.imported ? specifier.imported.name : null;
    const condition =
      (localName === 'default') ||
      (specifier.type === 'ImportDefaultSpecifier') ||
      (importedName === 'default')

    if (condition) requireType = INTEROP_REQUIRE_DEFAULT;
  });

  return requireType;
};
