---
title: API Overview
description: REST API for programmatic documentation access
---

# API Overview

Smart Docs exposes a REST API for reading and writing documentation programmatically.

## Base URL

```
http://localhost:<port>/api
```

The port defaults to 4500 or the next available port.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/config` | Get server configuration |
| GET | `/docs/tree` | Get file tree structure |
| GET | `/docs/content` | Read a file |
| PUT | `/docs/content` | Update a file |
| POST | `/docs/content` | Create a file |
| DELETE | `/docs/content` | Delete a file |
| GET (scaffold) | `/vault/search` | Search vault objects |
| POST (scaffold) | `/vault/validate` | Validate vault metadata/content |
| GET (scaffold) | `/vault/index-status` | Check index health/freshness |
| POST (scaffold) | `/vault/move` | Move object with optional link updates |
| POST (scaffold) | `/vault/link` | Create explicit relation between objects |

## Response Format

All responses are JSON:

```json
{
  "data": { ... },
  "error": "Error message if failed"
}
```

## Error Handling

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 400 | Bad request (missing parameters) |
| 403 | Forbidden (path traversal attempt) |
| 404 | File not found |
| 409 | Conflict (file already exists) |
| 500 | Server error |

## Use Cases

### Claude Plugin Integration

The API enables AI agents to:
- Search documentation by listing files
- Read specific documents
- Update documentation based on code changes
- Create new documentation

### CI/CD Integration

Automate documentation tasks:
- Validate all docs render correctly
- Check for broken internal links
- Generate documentation indexes

### Custom Tooling

Build tools that:
- Sync docs with external systems
- Convert between formats
- Batch update frontmatter

## Next Steps

- [Docs Tree API](docs-tree.md) - List all documentation files
- [Docs Content API](docs-content.md) - Read, write, and delete files
- [Vault Search API (Scaffold)](vault-search.md)
- [Vault Validate API (Scaffold)](vault-validate.md)
- [Vault Index Status API (Scaffold)](vault-index-status.md)
- [Vault Move API (Scaffold)](vault-move.md)
- [Vault Link API (Scaffold)](vault-link.md)
