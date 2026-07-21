# Common FRG Requirement Document Structure

## Scope

All requirement documents inside the `requirements/`
directory.

## Requirements

Requirement documents **MUST**:

- be written in Markdown format compatible with `mkdocs`;
- use the canonical language defined by FRG configuration.

For NOC projects, the canonical language is English.

Each requirement document **MUST** follow this structure:

```markdown
---
<front matter>
---
# Title

## Scope

<applicable area>

## Requirements

<normative statements>

## Why?

<rationale>
```

## Front Matter

Requirement files MUST start with YAML front matter.
Example:
```
---
checks:
- ...
---
```

## Title

Each requirement document MUST start with a title.

```
# Requirement Title
```

## Scope Section

Each requirement document MUST define its scope.

Scope defines the area where the requirement applies.

## Requirements Section

A requirement document defining normative behavior
**MUST** contain at least one normative statement.

A requirement document used only for grouping through
requires **MAY** omit normative statements.

Normative keywords **MUST** always be written in bold format.

The following normative keywords are used:

- **MUST** — defines a mandatory condition that **MUST** be satisfied.
- **MUST NOT** — defines a prohibited condition that **MUST NOT** occur.
- **SHOULD** — defines a recommended condition that is expected to be followed unless there is a justified reason not to.
- **SHOULD NOT** — defines a discouraged condition that should be avoided unless there is a justified reason.
- **MAY** — defines an optional condition that is permitted but not required.


## Why?

Requirement documents **SHOULD** explain the motivation and expected benefits of the requirement.