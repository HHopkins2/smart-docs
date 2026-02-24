---
title: Document Publish Loop
type: workflow
status: active
updated_at: 2026-02-24
owners: ["docs-platform"]
tags: ["workflow", "publishing", "quality"]
related:
  - task-publish-vault-demo.md
  - skill-run-doc-quality-check.md
schema_version: 1
---

# Document Publish Loop

A repeatable process for drafting, validating, and publishing docs.

```mermaid
flowchart TD
  A[Draft change] --> B[Run quality check skill]
  B --> C{Checks pass?}
  C -- No --> D[Fix issues]
  D --> B
  C -- Yes --> E[Review + approve]
  E --> F[Merge + publish]
```

## Steps
1. Draft content in PARA context
2. Run quality checks
3. Resolve lint/links/frontmatter issues
4. Request review
5. Merge and publish
