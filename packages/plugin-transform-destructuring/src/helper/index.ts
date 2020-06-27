import HelperBuilder from './builder'
import { useDependencyResolve } from './hooks';

export default function helper(name: string): HelperBuilder {
  let builder = new HelperBuilder(name);
  builder = useDependencyResolve(builder)
  return builder
}
