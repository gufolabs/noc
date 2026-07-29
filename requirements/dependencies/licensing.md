# Dependency Licensing Requirements

## Scope

All external libraries, packages, modules and third-party components used by the NOC project.

## Requirements

All dependencies **MUST** have a clearly identified license.

The license of each dependency **MUST** be documented in the corresponding dependency requirement document.

Dependency licenses **MUST** allow:

- inclusion into NOC distributions;
- modification when required;
- redistribution as part of NOC;
- creation and distribution of derivative products based on NOC.

Dependencies with unknown, missing or unclear licensing conditions **MUST NOT** be included into the project.

Dependency licenses **MUST** be compatible with the NOC project license and distribution model.

Transitive dependencies **MUST** satisfy the same licensing requirements as direct dependencies.

The project **MUST** maintain a list of approved dependency licenses.

The project **MUST** define additional restrictions for licenses that require special handling.

## License Evaluation

Before adopting a dependency, its license **MUST** be evaluated.

License evaluation **SHOULD** consider:

- distribution model;
- modification requirements;
- attribution requirements;
- source disclosure obligations;
- compatibility with commercial derivatives;
- compatibility with other project dependencies.

## Why?

Dependencies become part of the software distributed by NOC and may affect the rights and obligations of users, contributors and derivative product vendors.

Explicit license requirements reduce legal risks and ensure that dependencies remain suitable for both open-source development and derivative products.