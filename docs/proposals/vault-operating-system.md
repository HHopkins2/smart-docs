---
title: Vault Operating System Proposal
description: Strategic proposal for evolving Smart Docs into a durable, AI-native information management platform
autoLoad: true
autoLoadPriority: 3
agentRole: instructions
status: draft
owner: platform
---

# Vault Operating System Proposal (v1)

## Why this proposal

Smart Docs already has strong primitives: markdown CRUD, frontmatter, real-time sync, and agent auto-load. The next step is to turn it into a **Vault Operating System** for teams and agents that need consistent, durable, and searchable knowledge.

This proposal defines:
- the concept model (what objects exist),
- the operational model (how data moves and is maintained),
- the product model (what users/agents see in UI + APIs + MCP),
- and a phased implementation plan.

---

## Current state (what exists now)

Smart Docs currently provides:
- docs folder browsing + editing,
- frontmatter support,
- live file watching,
- REST API for file tree/content,
- plugin support for agent context auto-load.

That is an excellent base. What is missing is a first-class operating framework for **PARA + tasks + skills + workflows + retrieval + governance**.

---

## Scope and design goals

### Goals
1. Keep markdown files as the source of truth.
2. Support both humans and agents as first-class operators.
3. Keep the system extensible without becoming abstract/bloated.
4. Make retrieval and maintenance measurable (observable).
5. Standardize definitions and maintenance playbooks.

### Non-goals (v1)
- Replacing git as primary content source.
- Building an all-in-one PM suite.
- Perfect ontology from day one.

---

## Concept model (canonical objects)

Your proposed objects are correct and close to complete:
- PARA buckets (`projects`, `areas`, `resources`, `archives`)
- tasks
- skills
- workflows

Recommended additions:
- **Lexicon**: canonical definitions for terms/taxonomy
- **Indexes**: generated navigation and retrieval surfaces
- **Decisions (ADRs)**: major architecture/operating decisions
- **Provenance**: who/what changed what + confidence/source
- **Policies**: style, metadata, and maintenance rules

### Canonical object taxonomy

```mermaid
flowchart TD
    Vault[Vault OS]

    Vault --> Knowledge[Knowledge Objects]
    Vault --> Execution[Execution Objects]
    Vault --> Governance[Governance Objects]
    Vault --> Retrieval[Retrieval Objects]

    Knowledge --> PARA[PARA Docs]
    Knowledge --> Lexicon[Lexicon]
    Knowledge --> Decisions[Decisions / ADRs]

    Execution --> Tasks[Tasks]
    Execution --> Workflows[Workflows]
    Execution --> Skills[Skills]

    Governance --> Policies[Policies & Style Guide]
    Governance --> Maintenance[Maintenance Guides]

    Retrieval --> Indexes[Indexes]
    Retrieval --> Metadata[Frontmatter Schema]
    Retrieval --> Search[QMD Search Index]
    Retrieval --> Provenance[Change Provenance]
```

---

## Layered architecture

```mermaid
graph TD
    A[Markdown Files + Frontmatter] --> B[Vault Domain Service]
    B --> C[API Layer REST]
    B --> D[MCP Server]

    A --> E[Indexer Pipeline]
    E --> F[QMD Hybrid Search]

    C --> G[Smart Docs UI]
    D --> H[Agents]
    F --> G
    F --> H

    I[Workflow Engine] --> D
    I --> C

    J[Observability] --> E
    J --> I
    J --> C
```

### Layer responsibilities
- **Content layer**: markdown + frontmatter + folder conventions.
- **Domain layer**: validated create/read/update/move/link operations.
- **Access layer**: REST for UI, MCP for agents.
- **Retrieval layer**: indexing + lexical/semantic search + filtering.
- **Execution layer**: workflows and skills acting on domain APIs.
- **Observability layer**: freshness, failures, drift, run health.

---

## Information lifecycle (operational model)

```mermaid
stateDiagram-v2
    [*] --> Capture
    Capture --> Classify
    Classify --> StorePARA: durable knowledge
    Classify --> CreateTask: action required
    Classify --> AttachWorkflow: repeatable process
    StorePARA --> Index
    CreateTask --> Index
    AttachWorkflow --> RunSkill
    RunSkill --> UpdateDocs
    UpdateDocs --> Index
    Index --> Discover
    Discover --> Consolidate
    Consolidate --> Archive
    Archive --> [*]
```

### Operational rules
1. Agents write through the domain/API boundary (not raw file writes by default).
2. Every durable file has frontmatter conforming to schema.
3. Tasks and workflows link back to source docs.
4. Indexing is async but status is visible in UI.
5. Stale/duplicate/orphaned docs are reviewed on cadence.

---

## Recommended folder contract (v1)

```text
docs/
  index.md
  proposals/
    vault-operating-system.md
  standards/
    lexicon.md
    frontmatter-schema.md
    style-guide.md
    maintenance-guide.md
  para/
    projects/
    areas/
    resources/
    archives/
  tasks/
    index.md
  workflows/
    index.md
    templates/
  skills/
    index.md
  decisions/
    ADR-0001-*.md
```

> Note: If PARA should live at repo root instead of `docs/para`, keep a single canonical location and link to it from docs. Avoid dual copies.

---

## Metadata standard (frontmatter v1)

Minimum required fields:
- `title`
- `type` (`project|area|resource|archive|task|workflow|skill|decision|lexicon|guide`)
- `status` (`draft|active|stable|archived`)
- `updated_at` (ISO timestamp)

Recommended fields:
- `tags`
- `owners`
- `related` (doc links)
- `source` (human/agent/import + provenance)
- `review_by` (maintenance date)

---

## UX model (special treatment in app)

The app should provide role-based views by doc type:
- **PARA View**: bucket navigation + health indicators
- **Task View**: actionable list, status, due windows
- **Workflow View**: templates, versions, run history
- **Skill View**: available skill docs and compatibility
- **Decision View**: ADR timeline and dependency graph
- **Lexicon View**: canonical term definitions + backlinks

---

## API and MCP expansion

### API additions
- `GET /api/vault/search`
- `GET /api/vault/index-status`
- `POST /api/vault/validate`
- `POST /api/vault/move`
- `POST /api/vault/link`

### MCP tool set (v1)
- `vault.search(query, filters)`
- `vault.get(path_or_id)`
- `vault.create(type, title, body, metadata)`
- `vault.update(path_or_id, patch)`
- `vault.move(path_or_id, bucket)`
- `vault.link(from, to, relation)`
- `vault.validate(path_or_id)`

---

## What to standardize as “framework-provided”

Yes — provide formal guides for all core concepts:
- when to create projects vs areas,
- where notes go,
- when a recurring process becomes a workflow,
- when to convert guidance into a skill wrapper,
- how to review and archive.

This should be distributed as:
1. **Lexicon** (definitions)
2. **Maintenance guide** (cadence/checklists)
3. **Style guide** (writing quality + mermaid conventions)
4. **Workflow templates** (execution standards)
5. **Skill wrappers** for high-frequency operations

---

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Ontology sprawl | confusing system | keep a strict lexicon + change control |
| Metadata inconsistency | poor search/classification | schema validation in API + CI |
| Agent drift | unsafe edits | default writes via MCP/API + provenance |
| Index staleness | retrieval misses | async queue + visible index health |
| Over-complex v1 | low adoption | phased rollout + smallest useful surface |

---

## Phased roadmap

### Phase 1 (1-2 weeks): standards + docs foundation
- Add lexicon, style guide, frontmatter schema, maintenance guide.
- Add this proposal and index links.
- Define canonical folder contract.

### Phase 2 (1-2 weeks): retrieval + validation
- Add validation endpoint and metadata linting.
- Add QMD indexing integration and status endpoint.

### Phase 3 (2-3 weeks): workflow/task/skill surfaces
- Add dedicated UI tabs/views for task/workflow/skill/decision objects.
- Add MCP tools with stable contracts.

### Phase 4 (ongoing): observability and governance hardening
- Add dashboards for freshness/drift/provenance.
- Add review cadence automation.

---

## Recommendation summary

You’re not overcomplicating it — you’re converging on the right abstraction.

The right v1 is:
- **markdown + frontmatter as truth**,
- **PARA + tasks + workflows + skills + decisions + lexicon** as canonical model,
- **REST + MCP + QMD** as access/retrieval stack,
- **clear maintenance guides** to keep it healthy over time.

That gives you a reusable foundation for second brains, business knowledge hubs, and agent-operable code/project documentation systems.
