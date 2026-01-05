---
title: Contributing
description: How to contribute to Smart Docs
---

# Contributing

We welcome contributions to Smart Docs!

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Clone and Install

```bash
git clone https://github.com/hhopkins95/smart-docs.git
cd smart-docs
npm install
```

### Run in Development

```bash
npm run dev
```

This runs the CLI with `--dev` flag, enabling Next.js hot reload.

### Build

```bash
# Build CLI
npm run build:cli

# Build Next.js
npm run build

# Or build both
npm run build
```

## Project Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run build:cli` | Compile CLI TypeScript |
| `npm run lint` | Run ESLint |
| `npm start` | Start production server |

## Code Style

- TypeScript for all code
- Functional React components with hooks
- Tailwind CSS for styling
- ESLint for linting

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- API routes: `route.ts` in appropriate directory

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/my-fix
```

### 2. Make Changes

- Write clean, documented code
- Add types for new interfaces
- Update documentation if needed

### 3. Test Locally

```bash
npm run dev
# Open http://localhost:4500 and test your changes
```

### 4. Commit

```bash
git add .
git commit -m "feat: add my feature"
```

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `chore:` - Maintenance

### 5. Push and PR

```bash
git push -u origin feature/my-feature
```

Then open a pull request on GitHub.

## Areas for Contribution

### Good First Issues

- Improve error messages
- Add keyboard shortcuts
- Enhance mobile responsiveness
- Add more syntax highlighting languages

### Feature Ideas

- Search functionality
- Markdown preview side-by-side
- Export to PDF/HTML
- Git integration for version history
- Custom themes

### Documentation

- Fix typos
- Add examples
- Improve clarity
- Translate to other languages

## Questions?

Open an issue on GitHub or reach out to the maintainers.
