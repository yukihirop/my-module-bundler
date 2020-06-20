import * as t from '@babel/types';
import template from '@babel/template'

export default class ExportsVoid0Statement {
  public data: string[]

  constructor() {
    this.data = [] as string[];
  }

  public push(exportedName: string) {
    this.data.push(exportedName)
  }

  // e.g.)
  // exports.a = exports.b = void 0
  public build(): t.Statement | null {
    const { data } = this

    if (data.length >= 1) {
      const statementStr = data.reduce((acc: string, exportedName: string) => {
        const str = `exports.${exportedName} =`
        acc = acc.concat(str)
        return acc
      }, '').concat(`void 0`)

      return template.statement`${statementStr}`()
    } else {
      return null
    }
  }
}
