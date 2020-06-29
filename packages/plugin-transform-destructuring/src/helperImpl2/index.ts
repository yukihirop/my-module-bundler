import template from '@babel/template';
import * as t from '@babel/types';

export * from './types';
export { default as useDangerousUDFHelpers } from './core_ext'

export const helper = tpl => ({
  ast: (): t.Program => template.program.ast(tpl)
})
