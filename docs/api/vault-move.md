---
title: Vault Move API (Scaffold)
description: Draft contract for moving docs while preserving references
---

# Vault Move API (Scaffold)

> Status: **TODO scaffold** (contract-first; endpoint not fully implemented)

## Endpoint

`POST /api/vault/move`

## Request body

```json
{
  "fromPath": "docs/notes/todo.md",
  "toPath": "docs/tasks/todo.md",
  "updateLinks": true
}
```

## Success response (200)

```json
{
  "moved": true,
  "fromPath": "docs/notes/todo.md",
  "toPath": "docs/tasks/todo.md",
  "linksUpdated": 4
}
```

## Notes

- Initial implementation can wrap existing rename behavior.
- Link rewrite can start as best-effort and improve iteratively.
