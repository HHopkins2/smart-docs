---
name: Documentation Organization
description: Use when creating, organizing, or working with documentation in a smart-docs managed folder. Provides patterns for structuring docs, using frontmatter, and leveraging auto-load features.
---

# Documentation Organization Patterns

When working with documentation in a smart-docs managed project, follow these patterns to ensure consistency and enable AI agent integration.

## Environment

The documentation folder path is available via `SMART_DOCS_PATH` environment variable.

## Directory Structure

Organize documentation hierarchically by audience and topic:

```
docs/
├── index.md                    # Overview and navigation
├── getting-started/            # Onboarding content
│   ├── installation.md
│   └── quickstart.md
├── guides/                     # Task-oriented guides
│   ├── common-tasks.md
│   └── advanced-usage.md
├── reference/                  # API and technical reference
│   ├── api.md
│   └── configuration.md
└── contributing/               # For contributors
    └── guidelines.md
```

**Conventions:**
- Use kebab-case for file and folder names
- One topic per file
- Index files for navigation within sections
- Keep nesting to 2-3 levels maximum

## Frontmatter Requirements

Every markdown file should have frontmatter with at minimum:

```yaml
---
title: Human-Readable Title
description: Brief summary for search and previews
---
```

### Auto-Load Configuration

For documents that should be automatically loaded into AI agent context:

```yaml
---
title: Code Style Guide
description: Formatting and style rules for this project
autoLoad: true
autoLoadPriority: 3
agentRole: instructions
---
```

**Field Reference:**

| Field | Type | Description |
|-------|------|-------------|
| `autoLoad` | boolean | Set `true` to inject at session start |
| `autoLoadPriority` | number (1-10) | Lower = loads first |
| `agentRole` | string | `reference`, `instructions`, or `example` |

### What to Auto-Load

**Good candidates for `autoLoad: true`:**
- Project conventions and style guides
- Architecture decision records (ADRs)
- API design guidelines
- Critical setup instructions
- Glossary of project-specific terms

**Avoid auto-loading:**
- Lengthy tutorials or walkthroughs
- Full API reference documentation
- Historical changelogs
- Content that changes frequently

## Writing for AI Agents

When writing documentation that will be consumed by AI agents:

1. **Be explicit** - State rules and conventions directly
2. **Use examples** - Show correct patterns alongside explanations
3. **Structure consistently** - Use headers, lists, and tables predictably
4. **Avoid ambiguity** - "Should" vs "must" matters
5. **Keep it current** - Outdated docs mislead agents

### Example: Good Agent-Friendly Doc

```markdown
---
title: API Response Format
autoLoad: true
agentRole: instructions
---

# API Response Format

All API endpoints MUST return responses in this format:

## Success Response

\`\`\`json
{
  "data": { /* response payload */ },
  "meta": {
    "timestamp": "ISO8601 date"
  }
}
\`\`\`

## Error Response

\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
\`\`\`

## Rules

- Never return raw arrays at the top level
- Always include `meta.timestamp`
- Error codes must be SCREAMING_SNAKE_CASE
```

## Cross-Referencing

Use relative paths for links between documents:

```markdown
See [Installation Guide](../getting-started/installation.md) for setup.
```

## File Operations

When creating or modifying docs programmatically, use the smart-docs API:

- `GET /api/docs/tree` - List all documents
- `GET /api/docs/content?path=<path>` - Read a document
- `PUT /api/docs/content?path=<path>` - Update a document
- `POST /api/docs/content` - Create a new document
- `DELETE /api/docs/content?path=<path>` - Delete a document
