---
title: Run Doc Quality Check
type: skill
status: active
updated_at: 2026-02-24
owners: ["docs-platform"]
tags: ["skill", "automation", "quality"]
related:
  - workflow-doc-publish-loop.md
schema_version: 1
---

# Run Doc Quality Check

Reusable agent/human procedure to validate docs quality before merge.

## Inputs
- Changed markdown files
- Link checker
- Frontmatter validator

## Outputs
- Pass/fail summary
- Actionable issue list grouped by severity

## Contract
- Block on broken links or missing required fields
- Warn on missing recommended metadata
