---
title: Vault Index Status API (Scaffold)
description: Draft contract for search index health and freshness
---

# Vault Index Status API (Scaffold)

> Status: **TODO scaffold** (contract-first; endpoint not fully implemented)

## Endpoint

`GET /api/vault/index-status`

## Success response (200)

```json
{
  "state": "idle",
  "documentsIndexed": 142,
  "lastIndexedAt": "2026-02-24T19:45:00.000Z",
  "queueDepth": 0,
  "errors": []
}
```

## Notes

- Useful for surfacing stale-index indicators in app UI.
- `state` examples: `idle | indexing | degraded | error`.
