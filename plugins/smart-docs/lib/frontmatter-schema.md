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

## Default Context Policy (Vault-First Operations)

In vault-managed environments, the default auto-loaded context should include an operational instruction that prefers Vault CLI/MCP actions over ad-hoc direct file mutations.

### Policy Language (recommended)

Use explicit directive wording in an `agentRole: instructions` document:

```markdown
When operating in this repository, prefer Vault CLI or Vault MCP commands for create/update/delete workflows.
Do not perform ad-hoc direct file mutations when an equivalent Vault command exists.
If no Vault command exists for a task, state that explicitly and then use the minimal safe file edit.
```

### Example Auto-Loaded Policy Doc

```yaml
---
title: Vault Operations Policy
description: Operational guardrails for repository mutations
autoLoad: true
autoLoadPriority: 1
agentRole: instructions
---
```

```markdown
# Vault Operations Policy

- MUST prefer Vault CLI/MCP commands for operational changes
- SHOULD avoid manual edits for Vault-managed resources
- MAY use direct file edits only when Vault CLI/MCP lacks equivalent support
```

## Best Practices

- **Be selective** - Only mark essential reference docs as `autoLoad: true`
- **Use priorities** - Put foundational docs at priority 1-3, specific guidelines at 4-7
- **Keep it concise** - Auto-loaded docs consume context; prefer summaries over full docs
- **Use `agentRole`** - Helps the agent understand how to apply the information
- **Encode operational policy early** - Put Vault-first instruction docs at priority `1-2` so they appear before task-specific references
