import { ExportSpecifier } from '@babel/types';

export const functionize = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const INTEROP_REQUIRE_DEFAULT = '_interopRequireDefault';
export const judgeRequireType = (specifiers: ExportSpecifier[]) => {
  let requireType = 'require';

  specifiers.forEach((specifier: ExportSpecifier) => {
    const localName = specifier.local ? specifier.local.name : null;
    if (localName === 'default') requireType = INTEROP_REQUIRE_DEFAULT;
  });

  return requireType;
};
