module.exports = {
  src: ["./src"],
  mode: "file",
  includeDeclarations: true,
  tsconfig: "tsconfig.json",
  out: "./dist/pages",
  excludePrivate: true,
  excludeProtected: true,
  excludeExternals: true,
  readme: "README.md",
  name: "ArkhamOdds",
  ignoreCompilerErrors: true,
  plugin: "none",
  listInvalidSymbolLinks: true
};
