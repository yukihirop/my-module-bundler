import * as t from '@babel/types';
import * as catalog from '../../catalog'

export type DependencyType = { [key: string]: any }

export default class HelperBuilder {
  public helperName: string;
  public dependencies: DependencyType;
  public program: t.Program;
  public statement: t.Statement;

  constructor(helperName: string) {
    this.helperName = helperName;
    this.dependencies = [];
    this.program = catalog.default[helperName].ast();
    this.statement = null;
  }

  setDependencies(dependencies: DependencyType): void {
    this.dependencies = dependencies
  }

  setStatement(statement: t.Statement): void {
    this.statement = statement
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
