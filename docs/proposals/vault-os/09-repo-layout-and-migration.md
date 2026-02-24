---
title: Repo Layout Split (System Docs vs Vault Content)
description: Concrete repository structure and migration plan that preserves current plugin location
status: draft
---

# Repo Layout Split: System Docs vs Vault-Shaped Content

## Decision summary

1. **Keep the Claude plugin where it is today** under `plugins/smart-docs/**`.
2. Introduce a clear documentation split:
   - `docs/system/**` for product/framework/system documentation
   - `docs/vault/**` for vault-shaped operational content (PARA + object docs)
3. Keep this as a docs-first migration plan; code moves can follow after agreement.

## Why this split

Current docs mix two concerns:
- system docs that describe the Smart Docs product itself,
- vault content that demonstrates or operates a vault model.

The split makes authoring and governance clearer:
- system docs can evolve with product releases,
- vault content can follow vault lifecycle rules (task/workflow/decision review loops).

## Proposed repository structure (target)

```text
smart-docs/
├── app/
├── server/
├── plugins/
│   └── smart-docs/                 # keep existing plugin location
├── docs/
│   ├── system/                     # product/framework docs about Smart Docs
│   │   ├── index.md
│   │   ├── getting-started/
│   │   ├── features/
│   │   ├── development/
│   │   ├── api/
│   │   └── proposals/
│   │       └── vault-os/
│   └── vault/                      # vault-shaped content (real or demo vault)
│       ├── index.md
│       ├── para/
│       │   ├── projects/
│       │   ├── areas/
│       │   ├── resources/
│       │   └── archives/
│       ├── objects/
│       │   ├── tasks/
│       │   ├── workflows/
│       │   ├── skills/
│       │   ├── decisions/
│       │   └── lexicon/
│       └── guides/
└── ...
```

## Content contract by root

### `docs/system/**`
Use for:
- product docs,
- app/API specs,
- implementation proposals,
- developer architecture and contribution docs.

Not for:
- active task/workflow/decision objects owned by a vault process.

### `docs/vault/**`
Use for:
- PARA-managed content,
- object docs (`task`, `workflow`, `skill`, `decision`, `lexicon`),
- operating guides tied to vault execution.

This root should follow the metadata and lifecycle contracts from:
- `04-information-model.md`
- `05-operating-guides.md`

## Migration notes (docs-only plan)

### Phase 0 — ratify layout contract (now)
- Approve this structure in proposal docs.
- Keep runtime behavior unchanged.

### Phase 1 — move existing docs into split roots
Suggested mapping:

| Current path | Target path |
|---|---|
| `docs/getting-started/**` | `docs/system/getting-started/**` |
| `docs/features/**` | `docs/system/features/**` |
| `docs/development/**` | `docs/system/development/**` |
| `docs/api/**` | `docs/system/api/**` |
| `docs/proposals/**` | `docs/system/proposals/**` |
| `docs/vault-demo/**` | `docs/vault/**` *(or `docs/vault/demo/**` if keeping demo marker)* |

### Phase 2 — align links and loader defaults
- Update internal markdown links after moves.
- Set default docs path for system browsing to `docs/system` where appropriate.
- Set vault demos/presets to resolve against `docs/vault`.

### Phase 3 — optional runtime refinements
- Add explicit selector in UI/API for `system` vs `vault` roots.
- Add validation profile defaults by root (strict object validation in `docs/vault`).

## Plugin location and context policy

This proposal **does not** move plugin files.

Plugin remains:
- `plugins/smart-docs/.claude-plugin/plugin.json`
- `plugins/smart-docs/hooks/hooks.json`
- `plugins/smart-docs/commands/**`

Context policy should continue to use `smart-docs.config.json` and frontmatter controls from `03-plugin-and-mcp-context.md`.

## Risks and mitigations

- **Risk:** broken links from path migration  
  **Mitigation:** scripted path rewrite + link checker pass.
- **Risk:** confusion during mixed-layout transition  
  **Mitigation:** temporary compatibility period with clear deprecation note.
- **Risk:** accidental mixing of system and vault content  
  **Mitigation:** root-level README + lint/validation rules by path.

## Done criteria

- Proposal suite explicitly documents layout split and plugin immobility.
- Concrete target tree exists in docs.
- Migration phases and path mapping are documented.
- No runtime/code changes required for this proposal commit.
