---
title: Docs Tree API
description: API endpoint for listing documentation structure
---

# Docs Tree API

Get the hierarchical file tree of the documentation folder.

## Endpoint

```
GET /api/docs/tree
```

## Parameters

None.

## Response

```json
{
  "tree": {
    "type": "directory",
    "name": "docs",
    "path": "",
    "children": [
      {
        "type": "file",
        "name": "index.md",
        "path": "index.md"
      },
      {
        "type": "directory",
        "name": "guides",
        "path": "guides",
        "children": [
          {
            "type": "file",
            "name": "getting-started.md",
            "path": "guides/getting-started.md"
          }
        ]
      }
    ]
  }
}
```

## Tree Node Structure

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"file"` \| `"directory"` | Node type |
| `name` | string | File or folder name |
| `path` | string | Relative path from docs root |
| `children` | TreeNode[] | Child nodes (directories only) |

## Sorting

- Directories appear before files
- Items are sorted alphabetically within each group

## Filtering

The tree excludes:
- Hidden files (starting with `.`)
- `node_modules` directories

## Example Usage

### curl

```bash
curl http://localhost:4500/api/docs/tree
```

### JavaScript

```javascript
const response = await fetch('http://localhost:4500/api/docs/tree');
const { tree } = await response.json();

// Recursively list all files
function listFiles(node, files = []) {
  if (node.type === 'file') {
    files.push(node.path);
  } else if (node.children) {
    node.children.forEach(child => listFiles(child, files));
  }
  return files;
}

const allFiles = listFiles(tree);
console.log(allFiles);
// ['index.md', 'guides/getting-started.md', ...]
```

### Python

```python
import requests

response = requests.get('http://localhost:4500/api/docs/tree')
tree = response.json()['tree']

def list_files(node):
    if node['type'] == 'file':
        yield node['path']
    elif 'children' in node:
        for child in node['children']:
            yield from list_files(child)

files = list(list_files(tree))
```
