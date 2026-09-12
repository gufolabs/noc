## FRG requirement files must use kebab-case names

### Scope

FRG requirement files.

### Requirement

FRG requirement file names **MUST** be written in lowercase and **MUST** use kebab-case.

File names **MUST** use hyphens (`-`) as word separators.

Underscores (`_`) and uppercase letters **MUST NOT** be used in FRG requirement file names.

Example:
```
file-names.md
```

Invalid examples:
```
file_names.md
FileNames.md
fileNames.md
```

## Why?

Consistent file naming improves readability, portability, and interoperability between different tools and environments.

Lowercase kebab-case names provide a predictable naming scheme for automated processing and avoid ambiguity caused by case-sensitive file systems.