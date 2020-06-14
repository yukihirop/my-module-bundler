export type Asset = {
  id: number;
  filename: string;
  dependencies: string[];
  code: any;
  mapping?: { [key: string]: number };
};

export type Graph = Array<Asset>;
export type Modules = Array<string>;
export type BundlerParams = {
  input: string;
  output: string;
};
