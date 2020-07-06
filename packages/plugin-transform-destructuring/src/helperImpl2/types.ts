import * as t from '@babel/types'

export type UDFPluginOptionsType = { [key: string]: any }
export type UDFPluginType<T = babel.BabelFile> = (builder: T, options: UDFPluginOptionsType) => T;

export type UDFUsePluginOptionsType<T = babel.BabelFile> = {
  helpers: any,
  usePlugin?: [UDFPluginType<T>, UDFPluginOptionsType]
}
export type UDFUsePluginType<T = babel.BabelFile> = {
  plugin: UDFPluginType<T>,
  options?: UDFPluginOptionsType
}
export type UDFHelperType = {
  ast: () => t.Program;
}
export type UDFHelpersType = {
  [key: string]: UDFHelperType
}
export type UDFHelperListType = {
  available: string[],
  unavailable: string[]
}
