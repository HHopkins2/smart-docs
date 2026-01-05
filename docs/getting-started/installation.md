---
title: Installation
description: How to install Smart Docs
---

# Installation

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

## Install from npm

```bash
# Global installation (recommended)
npm install -g @hhopkins/smart-docs

# Or use npx without installing
npx @hhopkins/smart-docs ./docs
```

## Install from source

```bash
# Clone the repository
git clone https://github.com/hhopkins95/smart-docs.git
cd smart-docs

# Install dependencies
npm install

# Build the CLI
npm run build:cli

# Run locally
node bin/cli.mjs ./docs --dev
```

## Verify Installation

```bash
# Check version
smart-docs --version

# Run with a docs folder
smart-docs ./my-docs
```

You should see output like:

```
🚀 Starting Smart Docs...
📂 Docs: /path/to/my-docs
🌐 Server: http://localhost:4500
⚙️  Mode: Production
```
