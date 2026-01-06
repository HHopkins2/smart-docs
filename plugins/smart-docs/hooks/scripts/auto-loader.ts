#!/usr/bin/env bun

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

interface Frontmatter {
  title?: string;
  description?: string;
  autoLoad?: boolean;
  autoLoadPriority?: number;
  agentRole?: "reference" | "instructions" | "example";
  [key: string]: unknown;
}

interface DocFile {
  path: string;
  relativePath: string;
  frontmatter: Frontmatter;
  content: string;
}

/**
 * Parse YAML frontmatter from markdown content
 * Simple parser that handles basic key: value pairs
 */
function parseFrontmatter(content: string): { frontmatter: Frontmatter | null; body: string } {
  if (!content.startsWith("---")) {
    return { frontmatter: null, body: content };
  }

  const endIndex = content.indexOf("---", 3);
  if (endIndex === -1) {
    return { frontmatter: null, body: content };
  }

  const yamlBlock = content.slice(3, endIndex).trim();
  const body = content.slice(endIndex + 3).trim();

  const frontmatter: Frontmatter = {};

  for (const line of yamlBlock.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value: unknown = line.slice(colonIndex + 1).trim();

    // Parse boolean values
    if (value === "true") value = true;
    else if (value === "false") value = false;
    // Parse numbers
    else if (/^\d+$/.test(value as string)) value = parseInt(value as string, 10);
    // Remove quotes from strings
    else if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

/**
 * Recursively find all markdown files in a directory
 */
async function findMarkdownFiles(dir: string, basePath: string = dir): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip hidden directories and node_modules
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        files.push(...(await findMarkdownFiles(fullPath, basePath)));
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return files;
}

/**
 * Load and parse a markdown file
 */
async function loadDocFile(filePath: string, basePath: string): Promise<DocFile | null> {
  try {
    const content = await readFile(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);

    return {
      path: filePath,
      relativePath: relative(basePath, filePath),
      frontmatter: frontmatter || {},
      content: body,
    };
  } catch {
    return null;
  }
}

/**
 * Main entry point
 */
async function main() {
  const docsPath = process.env.SMART_DOCS_PATH;

  if (!docsPath) {
    // Silent exit if not configured - this is expected in non-smart-docs projects
    process.exit(0);
  }

  // Find all markdown files
  const markdownFiles = await findMarkdownFiles(docsPath);

  // Load and filter auto-load files
  const docFiles: DocFile[] = [];

  for (const filePath of markdownFiles) {
    const doc = await loadDocFile(filePath, docsPath);
    if (doc && doc.frontmatter.autoLoad === true) {
      docFiles.push(doc);
    }
  }

  // Sort by priority (lower = first), then by path
  docFiles.sort((a, b) => {
    const priorityA = a.frontmatter.autoLoadPriority ?? 10;
    const priorityB = b.frontmatter.autoLoadPriority ?? 10;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return a.relativePath.localeCompare(b.relativePath);
  });

  // Output nothing if no auto-load docs
  if (docFiles.length === 0) {
    process.exit(0);
  }

  // Output auto-loaded documentation
  console.log("<auto-loaded-documentation>");
  console.log("The following documentation has been automatically loaded from the project's docs folder.");
  console.log(`Source: ${docsPath}\n`);

  for (const doc of docFiles) {
    const title = doc.frontmatter.title || doc.relativePath;
    const role = doc.frontmatter.agentRole || "reference";

    console.log(`## ${title}`);
    console.log(`<!-- path: ${doc.relativePath} | role: ${role} -->`);

    if (doc.frontmatter.description) {
      console.log(`> ${doc.frontmatter.description}\n`);
    }

    console.log(doc.content);
    console.log("\n---\n");
  }

  console.log("</auto-loaded-documentation>");
}

main().catch(() => process.exit(1));
