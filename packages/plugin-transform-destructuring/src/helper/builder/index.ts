import * as t from '@babel/types';
import * as s from '../../statement'

export default class HelperBuilder {
  public helperName: string;
  public dependencies: { [key: string]: any };
  public statement: t.Statement;

  constructor(helperName: string) {
    this.helperName = helperName;
    this.dependencies = [];
    this.statement = s[`${helperName}Statement`];
  }

  public buildStatements(): t.Statement[] {
    const { dependencies } = this
    let result = [this.statement] as t.Statement[];

    Object.entries(dependencies).map(([key, child]: [string, any]) => {
      if (child.statement) {
        result.push(...child.buildStatements())
      }
    })

    return result
  }
}
