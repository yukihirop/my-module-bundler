export type AssetType = {
  id: number;
  filename: string;
  dependencies: string[];
  code: any;
  mapping?: { [key: string]: number };
};

export type GraphType = Array<AssetType>;
export type ModulesType = Array<string>;

export type PluginsType = Array<[any, { [key: string]: any }] | [any]> | Array<any>
export type OptionsType = {
  plugins?: PluginsType
}
export type WriteParamsType = {
  input: string;
  output: string;
};
