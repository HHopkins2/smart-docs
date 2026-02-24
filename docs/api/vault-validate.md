---
title: Vault Validate API (Scaffold)
description: Draft contract for validating vault frontmatter/schema rules
---

# Vault Validate API (Scaffold)

> Status: **TODO scaffold** (contract-first; endpoint not fully implemented)

## Endpoint

`POST /api/vault/validate`

## Request body

```json
{
  "path": "docs/projects/smart-docs.md",
  "frontmatter": {
    "objectType": "project",
    "schemaVersion": "vault.v1"
  },
  "content": "# Smart Docs"
}
```

## Success response (200)

```json
{
  "valid": true,
  "errors": [],
  "warnings": []
}
```

## Notes

- Should validate required fields for managed object types.
- Should return machine-readable error codes for UI/API clients.
