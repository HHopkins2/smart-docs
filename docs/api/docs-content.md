---
title: Docs Content API
description: API endpoints for reading and writing documentation files
---

# Docs Content API

Read, create, update, and delete documentation files.

## Read File

### Endpoint

```
GET /api/docs/content?path=<relative-path>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | string | Yes | Relative path to file |

### Response

```json
{
  "path": "/absolute/path/to/file.md",
  "frontmatter": {
    "title": "My Document",
    "description": "A description"
  },
  "content": "# Markdown content\n\nBody text here..."
}
```

### Example

```bash
curl "http://localhost:4500/api/docs/content?path=guides/intro.md"
```

---

## Update File

### Endpoint

```
PUT /api/docs/content?path=<relative-path>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | query string | Yes | Relative path to file |

### Request Body

```json
{
  "content": "# Updated Content\n\nNew body text...",
  "frontmatter": {
    "title": "Updated Title",
    "description": "Updated description"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Markdown content (without frontmatter) |
| `frontmatter` | object \| null | No | YAML frontmatter fields |

### Response

```json
{
  "success": true
}
```

### Example

```bash
curl -X PUT "http://localhost:4500/api/docs/content?path=guides/intro.md" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "# Hello\n\nUpdated content.",
    "frontmatter": {"title": "Hello Guide"}
  }'
```

---

## Create File

### Endpoint

```
POST /api/docs/content
```

### Request Body

```json
{
  "path": "guides/new-guide.md",
  "content": "# New Guide\n\nContent here...",
  "frontmatter": {
    "title": "New Guide",
    "description": "A brand new guide"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | string | Yes | Relative path for new file |
| `content` | string | Yes | Markdown content |
| `frontmatter` | object \| null | No | YAML frontmatter fields |

### Response

```json
{
  "success": true
}
```

### Errors

| Status | Error | Cause |
|--------|-------|-------|
| 409 | File already exists | Path already has a file |

### Example

```bash
curl -X POST "http://localhost:4500/api/docs/content" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "guides/new-guide.md",
    "content": "# New Guide\n\nContent here...",
    "frontmatter": {"title": "New Guide"}
  }'
```

---

## Delete File

### Endpoint

```
DELETE /api/docs/content?path=<relative-path>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | query string | Yes | Relative path to file |

### Response

```json
{
  "success": true
}
```

### Example

```bash
curl -X DELETE "http://localhost:4500/api/docs/content?path=guides/old-guide.md"
```

---

## Security

All endpoints validate that the requested path is within the configured docs directory. Attempts to access files outside (e.g., using `../`) return a 403 Forbidden error.

```json
{
  "error": "Invalid path"
}
```
