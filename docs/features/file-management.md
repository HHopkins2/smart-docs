---
title: File Management
description: Creating, deleting, and organizing documentation files
---

# File Management

Smart Docs lets you manage your documentation structure directly from the UI.

## Creating Files

### From the UI

1. Click **+ New** in the sidebar header
2. Enter a filename (e.g., `my-doc.md`)
3. Optionally specify a path (e.g., `guides/advanced`)
4. Click **Create**

The `.md` extension is added automatically if not provided.

### File Location

- **No path**: Created in the docs root
- **With path**: Created in the specified subdirectory (created if it doesn't exist)

### Initial Content

New files are created with:
- A `title` frontmatter field (derived from filename)
- Empty content body

## Deleting Files

1. Select the file you want to delete
2. Click the **Delete** button in the toolbar
3. Confirm the deletion in the dialog

**Warning**: Deletion is permanent. The file is removed from disk immediately.

## Organizing Files

### Folder Structure

Create folders by specifying paths when creating files:

```
guides/getting-started.md
guides/advanced/configuration.md
api/endpoints.md
```

### Moving Files

Currently, moving files between folders requires:
1. Creating a new file in the target location
2. Copying content from the old file
3. Deleting the old file

Or use your file system / code editor for bulk moves.

### Renaming Files

Similar to moving, renaming requires creating a new file with the desired name and deleting the old one.

## Best Practices

### File Naming

- Use lowercase with hyphens: `getting-started.md`
- Be descriptive: `api-authentication.md` not `auth.md`
- Keep names short but meaningful

### Folder Organization

```
docs/
├── index.md              # Landing page
├── getting-started/      # Onboarding content
├── guides/               # How-to guides
├── reference/            # API/technical reference
└── examples/             # Code examples
```

### Frontmatter Standards

Consistent frontmatter helps with organization:

```yaml
---
title: Page Title
description: Brief summary for SEO/previews
category: guides
order: 1
---
```
