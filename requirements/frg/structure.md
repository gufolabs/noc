
# FRG Requirement Structure

## Scope

Organization and decomposition of requirement documents
inside the FRG graph.

## Requirements

Requirement documents **SHOULD** contain a small and cohesive set of related requirements.

A requirement document **SHOULD NOT** be split into multiple documents when the split only makes navigation harder.

When a requirement document contains multiple independent areas of responsibility, it **SHOULD** be converted into a requirement directory with separate requirement documents.

A requirement document **SHOULD** normally contain no more than five independent normative statements unless keeping them together improves understanding.

When the amount of independent requirements exceeds this limit, the requirements **SHOULD** be grouped into a dedicated requirement subtree.

## Why?

A good requirement structure keeps the graph understandable for humans and tools.

Overly large documents become difficult to maintain, while excessive fragmentation makes the requirement graph harder to navigate.