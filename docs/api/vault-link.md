---
title: Vault Link API (Scaffold)
description: Draft contract for explicit links between vault objects
---

# Vault Link API (Scaffold)

> Status: **TODO scaffold** (contract-first; endpoint not fully implemented)

## Endpoint

`POST /api/vault/link`

## Request body

```json
{
  "from": "docs/projects/smart-docs.md",
  "to": "docs/specs/vault-scaffold.md",
  "relation": "implements"
}
```

## Success response (200)

```json
{
  "linked": true,
  "edge": {
    "from": "docs/projects/smart-docs.md",
    "to": "docs/specs/vault-scaffold.md",
    "relation": "implements"
  }
}
```

## Notes

- Storage model TBD (inline frontmatter links vs sidecar graph).
- Keep response stable for MCP/app clients.
