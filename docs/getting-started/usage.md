---
title: Usage
description: How to use Smart Docs CLI
---

# Usage

## Basic Usage

```bash
smart-docs <docs-path> [options]
```

### Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `docs-path` | Path to documentation folder | `./docs` |

### Options

| Option | Description |
|--------|-------------|
| `--port, -p <port>` | Specify server port |
| `--open` | Open browser automatically |
| `--dev` | Run in development mode (hot reload) |

## Examples

```bash
# Basic - serve ./docs folder
smart-docs

# Specify a different folder
smart-docs ./documentation

# Custom port
smart-docs ./docs --port 3000

# Open browser automatically
smart-docs ./docs --open

# Development mode with auto-reload
smart-docs ./docs --dev

# Combine options
smart-docs ./my-docs --port 8080 --open --dev
```

## Port Selection

By default, Smart Docs starts on port 4500. If that port is busy, it automatically finds the next available port.

To specify a port explicitly:

```bash
smart-docs ./docs --port 3000
```

## Auto-creating Docs Folder

If the specified docs path doesn't exist, Smart Docs will create it:

```bash
smart-docs ./new-docs
# Output: 📁 Docs path doesn't exist: /path/to/new-docs
#         Creating directory...
```
