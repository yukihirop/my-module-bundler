import template from '@babel/template';
import * as t from '@babel/types';
import HelperBuilder from './builder';
import { useDependencyResolve } from './hooks';

const helper = () => tpl => ({
  ast: (): t.Program => template.program.ast(tpl)
})

const helperBuilder = (name: string): HelperBuilder => {
  let builder = new HelperBuilder(name);
  builder = useDependencyResolve(builder)
  return builder
}

export {
  helperBuilder,
  helper
}
