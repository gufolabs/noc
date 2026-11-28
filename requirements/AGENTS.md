# NOC Requirements Authoring Guidelines

This document defines the methodology for creating, maintaining, reviewing, and organizing NOC requirements using FRG (Federated Requirements Graph).

It applies to all contributors, including human authors and AI agents.

The goal is to maintain a coherent, unambiguous, verifiable, and continuously evolving specification of NOC.

## 1. Fundamental Principles

### 1.1. Requirements describe intent

A requirement describes what the system MUST be, do, or guarantee.

A requirement MUST NOT describe an implementation merely because that implementation is currently used.

Requirements should express desired properties and observable outcomes rather than prescribe internal implementation details.

Implementation choices belong in architecture documents, design documents, or source code unless a particular implementation is itself an intentional architectural constraint.

### 1.2. Requirements are independent of implementation

Requirements MUST remain meaningful regardless of changes to programming languages, frameworks, libraries, infrastructure, and internal architecture.

A requirement should survive a complete rewrite of the subsystem if its intended behavior and constraints remain unchanged.

### 1.3. Requirements are not evidence

A requirement describes an expected state.

Evidence describes an observed state or provides proof that the expected state has been achieved.

These concepts MUST remain separate.

A requirement MUST NOT claim to be satisfied merely because:
- Its implementation exists.
- A developer considers it complete.
- A corresponding issue has been closed.
- A document claims compliance without supporting evidence.

Requirement satisfaction is determined by evaluating associated evidence.

### 1.4. Requirements form a graph

Requirements are not an isolated collection of documents or a hierarchical checklist.

They form a graph of related specifications.

Authors SHOULD identify meaningful dependencies between requirements and maintain explicit relationships where supported by the FRG model.

Do not duplicate requirements simply to make them appear in multiple sections. Reference the original requirement instead.

## 2. Document Structure

Each requirement document MUST be written in Markdown with YAML front matter.

The canonical language is English.

The standard document structure is:

    ---
    <metadata>
    ---

    # Title

    ## Scope

    ## Requirements

    ## Why?

The sections have the following purposes.

### 2.1. Title

A short, descriptive title identifying the subject of the document.

Titles SHOULD describe the responsibility or capability being specified.

Avoid generic titles such as:
- General
- Miscellaneous
- Other Requirements
- Technical Details

### 2.2. Scope

Explain what is covered by the document and, where useful, what is explicitly outside its scope.

Scope MUST be sufficiently precise to prevent overlapping or ambiguous responsibilities between documents.

Keep it concise.

### 2.3. Requirements

This is the normative part of the document.

It contains statements defining mandatory, recommended, and optional properties of NOC.

Each statement MUST be understandable independently, subject to its explicitly stated dependencies and scope.

### 2.4. Why?

An optional explanatory section.

Use it to describe:
- Architectural rationale.
- Historical context.
- Operational considerations.
- Security implications.
- Trade-offs behind a decision.

This section is informative, not normative.

Do not introduce additional obligations exclusively through explanatory prose.

## 3. Requirement Granularity

### 3.1. One responsibility per requirement

Each requirement document SHOULD address one cohesive responsibility or architectural concern.

Avoid mixing unrelated subjects, even when they belong to the same subsystem.

For example, database schema conventions, API authorization, and logging policy SHOULD NOT be combined into one document merely because they are all implemented by the same component.

### 3.2. Decomposition

A document SHOULD normally contain no more than five independent normative statements.

If a document contains too many independent requirements, split it into smaller documents and establish appropriate relationships between them.

Decomposition MUST preserve semantic coherence.

Do not split a single logical obligation into multiple documents without a meaningful reason.

### 3.3. Atomic requirements

Each normative statement SHOULD express one independently verifiable obligation.

Avoid combining multiple unrelated obligations using long sentences, multiple conjunctions, or extensive lists.

A requirement may contain several conditions when they are necessary parts of one logical obligation.

### 3.4. Avoid duplication

The same normative obligation MUST NOT be independently specified in multiple places.

When multiple documents depend on the same rule, maintain one authoritative requirement and reference it from the others.

## 4. Normative Language

Normative keywords MUST be used consistently.

The following terms have precise meanings.

### MUST

An absolute requirement.

Non-compliance means that the system does not conform to the specification.

### MUST NOT

An absolute prohibition.

### SHOULD

A strong recommendation.

A deviation is permitted only when there is a justified reason and the consequences have been considered.

### SHOULD NOT

A strong recommendation against a particular behavior.

Exceptions require justification.

### MAY

An explicitly permitted option.

It does not impose an obligation.

### 4.1. Formatting

Normative keywords MUST be written in bold.

Examples:

- **MUST**
- **MUST NOT**
- **SHOULD**
- **SHOULD NOT**
- **MAY**

Use these keywords only when their normative meaning is intended.

Avoid informal substitutes such as:
- must (without normative formatting)
- should probably
- ideally
- preferably
- is expected to

If a statement is mandatory, use **MUST**.

If it is advisory, use **SHOULD**.

If it is merely explanatory, do not introduce normative language.

## 5. Writing Quality

### 5.1. Clarity

Every requirement MUST be unambiguous.

Avoid:
- Subjective adjectives.
- Undefined terminology.
- Implicit assumptions.
- Unspecified units.
- Unspecified coordinate systems.
- Expressions such as "reasonable", "appropriate", "sufficient", or "fast" without measurable criteria.

Where a property can be measured, define its measurement method or reference the relevant specification.

### 5.2. Explicitness

Do not rely on knowledge that exists only in developers' heads.

If a behavior is important, specify it explicitly.

For example, do not merely require geographic coordinates to be stored consistently.

Specify the coordinate reference system, axis order, and units where these affect interoperability.

### 5.3. Terminology

Use consistent terminology throughout the requirements.

Prefer established NOC domain terminology.

When introducing a new term:
- Define it.
- Use it consistently.
- Avoid introducing synonyms for the same concept.

### 5.4. Examples

Examples MAY be included when they clarify a requirement.

Examples MUST NOT replace normative statements.

If an example is illustrative rather than exhaustive, make this explicit.

## 6. Technical and Architectural Requirements

### 6.1. Technology neutrality

Do not prescribe a particular implementation unless it is an intentional architectural decision.

For example:

Prefer:

"The system MUST provide an efficient mechanism for retrieving objects by their identifiers."

Avoid:

"The system MUST use Redis to cache object lookups."

The second statement is appropriate only if Redis is an intentional architectural constraint.

### 6.2. Explicit architectural decisions

Some technology choices are intentional and must be preserved.

Examples include:
- Canonical data representations.
- Supported protocols.
- Required database capabilities.
- Security boundaries.
- Interoperability standards.
- Geographic coordinate reference systems.

Such decisions SHOULD be documented as explicit architectural requirements, with their rationale where useful.

### 6.3. Standards

When a requirement depends on an external standard:

- Identify the standard explicitly.
- Include its official identifier.
- Specify the applicable version or edition when relevant.
- Avoid vague references to industry standards.
- Specify any NOC-specific restrictions or interpretations.

External standards SHOULD be referenced rather than copied wholesale into NOC requirements.

## 7. Dependencies and Relationships

Requirements should explicitly express dependencies where these affect their interpretation or applicability.

When creating a requirement:

1. Identify existing requirements that establish its prerequisites.
2. Identify requirements that depend on the new requirement.
3. Reuse existing requirements rather than duplicating their obligations.
4. Establish relationships using the relationship types supported by FRG.

Relationships MUST reflect actual semantic dependencies, not merely organizational proximity.

Do not create artificial dependencies to produce a more connected graph.

## 8. Evidence and Verification

### 8.1. Separation of concerns

Requirements define what must be achieved.

Evidence demonstrates what has actually been achieved.

Verification determines whether the evidence is sufficient to establish conformance.

These are separate responsibilities.

### 8.2. Verifiability

Requirements SHOULD be written so that their compliance can eventually be verified.

Where practical, prefer objectively observable properties.

A requirement SHOULD make clear:
- What must be true.
- Under which conditions it must be true.
- What constitutes a violation.

### 8.3. Verification methods

Evidence may eventually be obtained through:
- Automated tests.
- Static analysis.
- Configuration inspection.
- Source code inspection.
- Runtime observations.
- CI pipelines.
- Documentation reviews.
- Manual audits.

Do not prescribe a specific verification mechanism unless it is itself a requirement.

### 8.4. Evidence freshness

Evidence describes an observed state at a particular point in time.

It may become outdated when the implementation, configuration, or environment changes.

Evidence MUST NOT be treated as permanently valid merely because it was once collected.

### 8.5. No manually declared satisfaction

Authors MUST NOT introduce manually maintained compliance claims as substitutes for evidence.

Requirement satisfaction is derived from the available evidence and the applicable verification rules.

## 9. Document Organization

The NOC requirements repository is an organized specification, not a collection of development notes.

Documents SHOULD be grouped by responsibility and domain.

The organization SHOULD reflect the conceptual architecture of NOC rather than the current source-code directory structure.

A subsystem may have several independent requirement groups.

A requirement may apply across multiple subsystems.

Avoid:
- Duplicating the same requirement across directories.
- Organizing requirements exclusively by implementation modules.
- Creating excessively deep directory hierarchies.
- Using directories as substitutes for semantic relationships.

Indexes and overview documents SHOULD remain short.

Their purpose is to help readers navigate the requirements, not to repeat their contents.

## 10. Metadata and Identifiers

Every requirement document MUST contain the metadata required by the FRG repository schema.

Identifiers MUST be stable.

Once assigned, an identifier MUST NOT change merely because:
- The document is renamed.
- Its directory changes.
- Its title changes.
- Its contents are reorganized.

Do not invent new metadata fields or alternative identifier conventions.

Follow the existing FRG schema and repository conventions.

Metadata MUST describe the requirement and its identity, not its current implementation state.

## 11. Language and Translations

English is the canonical language of NOC requirements.

All normative statements MUST first be authored in English.

Translations MAY be provided for convenience.

Translations MUST preserve the normative meaning of the original requirement.

When a translation conflicts with the canonical English version, the English version takes precedence.

Do not introduce additional obligations, relaxations, or interpretations through translations.

## 12. Authoring Workflow

When creating or modifying requirements, follow this process.

### Step 1. Understand the subject

Identify the actual architectural, operational, or functional concern.

Do not immediately start writing.

Understand:
- The problem being addressed.
- The intended behavior.
- Relevant existing requirements.
- Existing architectural decisions.
- Known constraints and exceptions.

### Step 2. Search for existing requirements

Before creating a new document, search the existing requirements repository.

Determine whether:
- The requirement already exists.
- The subject is covered by a broader requirement.
- A new document would introduce duplication.
- Existing documents need refinement or decomposition.

Prefer extending or correcting an existing requirement over creating another document with overlapping responsibilities.

### Step 3. Define the scope

Identify the exact responsibility of the new document.

Determine which obligations belong here and which should be referenced elsewhere.

### Step 4. Draft normative statements

Write requirements using precise normative language.

Each statement MUST:
- Express a clear obligation or permission.
- Have a well-defined subject.
- Be unambiguous.
- Avoid unnecessary implementation details.
- Be independently understandable.
- Be potentially verifiable.

### Step 5. Establish relationships

Identify meaningful dependencies and references.

Ensure that the new document fits into the existing requirements graph.

### Step 6. Review

Review the document for:
- Clarity.
- Consistency.
- Completeness.
- Duplication.
- Appropriate granularity.
- Normative language.
- Technical accuracy.
- Verifiability.

### Step 7. Update indexes

Update relevant index documents and navigation references when required.

Keep indexes concise.

### Step 8. Validate

Run available FRG validation tools when applicable.

Check:
- Metadata validity.
- Identifier uniqueness.
- Reference integrity.
- Markdown validity.
- Graph consistency.
- Canonical language requirements.

Do not claim that a requirement is verified merely because its Markdown document passes validation.

## 13. Rules for AI Agents

AI agents working with NOC requirements MUST follow these additional rules.

### 13.1. Do not invent decisions

Never turn an assumption, suggestion, or commonly used industry practice into an established NOC requirement without confirmation.

When information is missing:
- Identify the gap.
- Ask for clarification when it affects normative meaning.
- Mark unresolved decisions explicitly in the working discussion.
- Do not silently choose an implementation.

### 13.2. Preserve established decisions

Before changing an existing requirement, understand its purpose and dependencies.

Do not weaken, remove, or reinterpret existing obligations without an explicit reason.

If a change affects other requirements, identify the impact and update the affected relationships or documents.

### 13.3. Do not over-engineer

Do not introduce additional requirements merely because they appear desirable.

The goal is to describe the actual intended NOC specification, not to create an idealized system unrelated to agreed product decisions.

### 13.4. Separate facts from proposals

Distinguish between:
- Established architectural decisions.
- Existing normative requirements.
- Proposed improvements.
- Unresolved questions.
- Implementation observations.

A proposal MUST NOT be presented as an accepted requirement.

### 13.5. Prefer small changes

Make focused changes to the requirements repository.

Avoid unrelated reorganization, renaming, or stylistic rewrites when addressing a specific requirement.

### 13.6. Maintain consistency

When creating a new requirement, inspect related documents and follow their established conventions.

Do not introduce a new writing style, terminology, or metadata convention without a reason.

### 13.7. Never confuse implementation with specification

Source code, tests, and existing behavior can provide evidence of the current implementation.

They do not automatically define the intended behavior.

When the implementation contradicts a requirement, identify the discrepancy rather than rewriting the requirement to match the code.

## 14. Definition of a Good Requirement

A good NOC requirement has the following characteristics:

- **Intentional:** It describes an agreed property of NOC.
- **Precise:** Its meaning is unambiguous.
- **Atomic:** It addresses one cohesive responsibility.
- **Necessary:** It captures a meaningful obligation or constraint.
- **Verifiable:** Its compliance can be evaluated.
- **Technology-conscious:** It does not unnecessarily constrain implementation.
- **Connected:** Its relationships with other requirements are explicit where necessary.
- **Maintainable:** It can evolve without destabilizing unrelated parts of the specification.

The purpose of this methodology is not to maximize the number of requirements.

The purpose is to build the smallest coherent specification that accurately describes the intended behavior, architecture, constraints, and quality expectations of NOC.
