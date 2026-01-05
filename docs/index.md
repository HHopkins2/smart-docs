---
title: Smart Docs
description: Documentation folder manager with real-time editing
---

# Smart Docs

A lightweight documentation manager for viewing and editing markdown files with real-time updates.

## Features

- **Browse** - Navigate documentation with a file tree sidebar
- **View** - Render markdown with syntax highlighting and Mermaid diagrams
- **Edit** - Modify content and frontmatter in the browser
- **Real-time** - Changes sync automatically via file watching

## Quick Start

```bash
# Install globally
npm install -g @hhopkins/smart-docs

# Run on a docs folder
smart-docs ./docs

# Or with options
smart-docs ./docs --port 3000 --open
```

The app launches at `http://localhost:4500` (or next available port).

## Next Steps

- [Installation](getting-started/installation.md) - Detailed setup instructions
- [Usage](getting-started/usage.md) - CLI options and configuration
- [Features](features/viewing.md) - Learn what you can do
- [API Reference](api/overview.md) - REST API for integrations
