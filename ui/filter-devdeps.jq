{
  name,
  version,
  dependencies: {},
  devDependencies: (.devDependencies | with_entries(select(.key == "eslint" or .key == "@eslint/js" or .key == "typescript-eslint" or .key == "globals")))
}
