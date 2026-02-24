---
title: Adopt Frontmatter Schema v1 for Typed Vault Objects
type: decision
status: stable
updated_at: 2026-02-24
owners: ["docs-platform", "platform-architecture"]
tags: ["adr", "metadata", "schema"]
related:
  - ../para/projects/customer-onboarding-revamp.md
  - lexicon-vault-objects.md
schema_version: 1
---

# Decision: Adopt Frontmatter Schema v1 for Typed Vault Objects

## Context
Operational docs are hard to automate when metadata is inconsistent.

## Decision
Use a shared v1 frontmatter baseline:

- Required: `title`, `type`, `status`, `updated_at`
- Recommended: `owners`, `tags`, `related`, `review_by`, `schema_version`

## Consequences
- Easier automation for indexing/routing
- Better cross-linking between task/workflow/skill docs
- Slight authoring overhead offset by reliability gains
