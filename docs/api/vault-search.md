---
title: Vault Search API (Scaffold)
description: Draft contract for semantic and metadata search across vault objects
---

# Vault Search API (Scaffold)

> Status: **TODO scaffold** (contract-first; endpoint not fully implemented)

## Endpoint

`GET /api/vault/search`

## Query params

- `q` (string, required): free-text query
- `objectType` (string, optional): object type filter
- `pathPrefix` (string, optional): restrict to folder subtree
- `limit` (number, optional): max results (default 20)

## Success response (200)

```json
{
  "query": "incident review",
  "results": [
    {
      "path": "docs/runbooks/postmortem-template.md",
      "title": "Postmortem Template",
      "objectType": "runbook",
      "score": 0.83,
      "snippet": "..."
    }
  ],
  "total": 1
}
```

## Notes

- Initial implementation can be lexical match + frontmatter filters.
- Semantic ranking/index integration can be layered in later.
