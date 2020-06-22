import template from '@babel/template';
import * as t from '@babel/types';

export const importConstThrowAst = (localName: string): t.Expression => template.expression.ast`
(function(){
    throw new Error('"' + "${localName}" + '" is read-only.');
  })()
`;
