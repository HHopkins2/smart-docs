---
name: docs-sync
description: Analyze the codebase and update documentation to reflect current state
allowed_tools:
  - Glob
  - Grep
  - Read
  - Edit
  - Write
  - Bash
  - Task
  - TodoWrite
  - AskUserQuestion
---

# Documentation Sync Command

You are performing a documentation synchronization. Your goal is to analyze the current state of the codebase and update the documentation in `${SMART_DOCS_PATH}` to accurately reflect it.

## Phase 1: Codebase Analysis

First, thoroughly analyze the codebase to understand its current state:

1. **Project Structure**
   - Identify the main source directories
   - Find entry points (main files, index files, CLI entry)
   - Map the module/component structure

2. **Public API Surface**
   - Find exported functions, classes, and types
   - Identify REST/GraphQL endpoints if applicable
   - Note CLI commands and options
   - Document configuration options

3. **Key Patterns**
   - Identify architectural patterns in use
   - Note naming conventions
   - Find error handling patterns
   - Identify testing patterns

4. **Dependencies**
   - Check package.json or equivalent for key dependencies
   - Note any peer dependencies or required tools

## Phase 2: Documentation Audit

Read the existing documentation in `${SMART_DOCS_PATH}`:

1. **Inventory existing docs**
   - List all markdown files
   - Note their topics and coverage
   - Check frontmatter for completeness

2. **Identify gaps**
   - Features in code but not documented
   - API endpoints missing documentation
   - Configuration options not explained

3. **Identify stale content**
   - Documented features that no longer exist
   - Outdated API signatures or examples
   - Deprecated patterns still referenced
   - Version numbers or dependencies out of date

4. **Check accuracy**
   - Verify code examples still work
   - Confirm file paths mentioned exist
   - Validate command-line examples

## Phase 3: Plan Updates

Before making changes, create a todo list with:

1. **New documentation needed** - Files to create
2. **Updates required** - Existing files that need modification
3. **Removals** - Content to delete (deprecated features)
4. **Reorganization** - Structure changes if needed

Present this plan to the user and ask for confirmation before proceeding.

## Phase 4: Apply Updates

For each documentation update:

1. **Preserve frontmatter** - Keep existing `autoLoad`, `autoLoadPriority`, and other custom fields
2. **Maintain style** - Match the existing documentation tone and format
3. **Update incrementally** - Use Edit tool for targeted changes rather than full rewrites
4. **Add examples** - Include working code examples where helpful
5. **Cross-reference** - Update links between documents if structure changes

### Frontmatter Template

Ensure all docs have proper frontmatter:

```yaml
---
title: Clear, Descriptive Title
description: One-line summary for previews and search
---
```

For critical reference docs, suggest adding:

```yaml
autoLoad: true
autoLoadPriority: 5
agentRole: reference
```

## Phase 5: Verification

After updates:

1. List all changes made
2. Verify no broken internal links
3. Confirm code examples are syntactically valid
4. Summarize what was added/updated/removed

## Important Guidelines

- **Ask before major changes** - If you discover the docs need significant restructuring, ask the user first
- **Preserve custom content** - Don't remove user-written explanations or context
- **Be conservative** - When unsure if something is outdated, ask rather than delete
- **Note uncertainty** - If you can't verify something, flag it for user review
- **Keep it concise** - Update docs to be accurate, don't pad with unnecessary content

## Output Format

When complete, provide a summary:

```
## Documentation Sync Complete

### Added
- path/to/new-doc.md - Description

### Updated
- path/to/updated.md - What changed

### Removed
- path/to/old-doc.md - Why removed

### Flagged for Review
- path/to/uncertain.md - What needs human verification
```
