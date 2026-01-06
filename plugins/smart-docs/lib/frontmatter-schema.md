# Smart Docs Extended Frontmatter Schema

This document describes the frontmatter fields recognized by the smart-docs plugin for AI agent integration.

## Standard Fields

These fields are used by smart-docs for display and metadata:

```yaml
---
title: Document Title
description: Brief description of the document
---
```

## Auto-Load Fields

These fields control automatic injection of documentation into AI agent context.

### `autoLoad`

**Type:** `boolean`
**Default:** `false`

When `true`, this document will be automatically loaded into the AI agent's context at session start.

```yaml
---
title: API Guidelines
autoLoad: true
---
```

### `autoLoadPriority`

**Type:** `number` (1-10)
**Default:** `10`

Controls the order in which auto-loaded documents appear. Lower numbers load first.

```yaml
---
title: Critical Setup Instructions
autoLoad: true
autoLoadPriority: 1
---
```

### `agentRole`

**Type:** `"reference" | "instructions" | "example"`
**Default:** `"reference"`

Hints to the AI agent how this document should be used:

- `reference` - Factual information to consult when relevant
- `instructions` - Rules or guidelines the agent should follow
- `example` - Patterns or templates to emulate

```yaml
---
title: Code Style Guide
autoLoad: true
agentRole: instructions
---
```

## Complete Example

```yaml
---
title: API Design Standards
description: Core principles for designing REST APIs in this project
autoLoad: true
autoLoadPriority: 2
agentRole: instructions
---

# API Design Standards

All REST APIs in this project should follow these conventions...
```

## Usage

1. Set the `SMART_DOCS_PATH` environment variable to your docs folder path
2. Add `autoLoad: true` to documents you want automatically loaded
3. Start Claude Code - the plugin will inject marked documents at session start

## Best Practices

- **Be selective** - Only mark essential reference docs as `autoLoad: true`
- **Use priorities** - Put foundational docs at priority 1-3, specific guidelines at 4-7
- **Keep it concise** - Auto-loaded docs consume context; prefer summaries over full docs
- **Use `agentRole`** - Helps the agent understand how to apply the information
