#!/usr/bin/env bun

import { readdir, readFile } from "node:fs/promises";
import path, { join, relative } from "node:path";

type AgentRole = "reference" | "instructions" | "example";
type ContextMode = "minimal" | "standard" | "deep";

interface Frontmatter {
  title?: string;
  description?: string;
  autoLoad?: boolean;
  autoLoadPriority?: number;
  agentRole?: AgentRole;
  [key: string]: unknown;
}

interface AgentContextConfig {
  mode?: ContextMode;
  allowRoles?: AgentRole[];
  denyPaths?: string[];
  maxDocuments?: number;
}

interface SmartDocsConfig {
  agentContext?: AgentContextConfig;
}

interface ResolvedAgentContextConfig {
  mode: ContextMode;
  allowRoles: Set<AgentRole>;
  denyPaths: string[];
  maxDocuments: number;
}

interface DocFile {
  path: string;
  relativePath: string;
  frontmatter: Frontmatter;
  content: string;
}

const MODE_DEFAULTS: Record<ContextMode, Omit<ResolvedAgentContextConfig, "mode">> = {
  minimal: {
    allowRoles: new Set<AgentRole>(["instructions"]),
    denyPaths: [],
    maxDocuments: 5,
  },
  standard: {
    allowRoles: new Set<AgentRole>(["instructions", "reference"]),
    denyPaths: [],
    maxDocuments: 20,
  },
  deep: {
    allowRoles: new Set<AgentRole>(["instructions", "reference", "example"]),
    denyPaths: [],
    maxDocuments: 50,
  },
};

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

function isContextMode(value: unknown): value is ContextMode {
  return value === "minimal" || value === "standard" || value === "deep";
}

function isAgentRole(value: unknown): value is AgentRole {
  return value === "reference" || value === "instructions" || value === "example";
}

function matchesDenyPath(relativePath: string, denyPatterns: string[]): boolean {
  const normalizedPath = relativePath.replace(/\\/g, "/");

  return denyPatterns.some((pattern) => {
    const normalizedPattern = pattern.replace(/^\.\//, "").replace(/\\/g, "/");

    if (normalizedPattern.endsWith("/**")) {
      const prefix = normalizedPattern.slice(0, -3).replace(/\/$/, "");
      return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`);
    }

    return normalizedPath === normalizedPattern;
  });
}

async function loadAgentContextConfig(cwd: string): Promise<ResolvedAgentContextConfig> {
  const configPath = join(cwd, "smart-docs.config.json");

  let parsed: SmartDocsConfig | null = null;

  try {
    const raw = await readFile(configPath, "utf-8");
    parsed = JSON.parse(raw) as SmartDocsConfig;
  } catch {
    parsed = null;
  }

  const mode: ContextMode = isContextMode(parsed?.agentContext?.mode)
    ? parsed.agentContext.mode
    : "standard";

  const defaults = MODE_DEFAULTS[mode];

  const allowRoles = new Set<AgentRole>(defaults.allowRoles);
  const configuredRoles = parsed?.agentContext?.allowRoles;
  if (Array.isArray(configuredRoles)) {
    const validRoles = configuredRoles.filter(isAgentRole);
    if (validRoles.length > 0) {
      allowRoles.clear();
      for (const role of validRoles) allowRoles.add(role);
    }
  }

  const denyPaths = Array.isArray(parsed?.agentContext?.denyPaths)
    ? parsed!.agentContext!.denyPaths!.filter((value): value is string => typeof value === "string")
    : defaults.denyPaths;

  const rawMaxDocuments = parsed?.agentContext?.maxDocuments;
  const maxDocuments =
    typeof rawMaxDocuments === "number" && Number.isFinite(rawMaxDocuments) && rawMaxDocuments > 0
      ? Math.floor(rawMaxDocuments)
      : defaults.maxDocuments;

  return {
    mode,
    allowRoles,
    denyPaths,
    maxDocuments,
  };
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

  const contextConfig = await loadAgentContextConfig(process.cwd());
  const resolvedDocsPath = path.resolve(process.cwd(), docsPath);

  // Find all markdown files
  const markdownFiles = await findMarkdownFiles(resolvedDocsPath);

  // Load and filter auto-load files
  const docFiles: DocFile[] = [];

  let addedContext = "";

  for (const filePath of markdownFiles) {
    const doc = await loadDocFile(filePath, resolvedDocsPath);
    if (!doc || doc.frontmatter.autoLoad !== true) continue;

    const role = doc.frontmatter.agentRole || "reference";
    if (!contextConfig.allowRoles.has(role)) continue;
    if (matchesDenyPath(doc.relativePath, contextConfig.denyPaths)) continue;

    docFiles.push(doc);
  }

  // Sort by priority (lower = first), then by path
  docFiles.sort((a, b) => {
    const priorityA = a.frontmatter.autoLoadPriority ?? 10;
    const priorityB = b.frontmatter.autoLoadPriority ?? 10;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return a.relativePath.localeCompare(b.relativePath);
  });

  const selectedDocs = docFiles.slice(0, contextConfig.maxDocuments);

  // Output nothing if no auto-load docs
  if (selectedDocs.length === 0) {
    process.exit(0);
  }

  // Output auto-loaded documentation
  addedContext += "<auto-loaded-documentation> \n";
  addedContext += "The following documentation has been automatically loaded from the project's docs folder. \n";
  addedContext += `Source: ${docsPath}\n`;
  addedContext += `Context mode: ${contextConfig.mode}\n`;

  for (const doc of selectedDocs) {
    const title = doc.frontmatter.title || doc.relativePath;
    const role = doc.frontmatter.agentRole || "reference";

    addedContext += `## ${title}\n`;
    addedContext += `<!-- path: ${doc.relativePath} | role: ${role} -->\n`;

    if (doc.frontmatter.description) {
      addedContext += `> ${doc.frontmatter.description}\n`;
    }

    addedContext += doc.content;
    addedContext += "\n---\n";
  }

  addedContext += "</auto-loaded-documentation>";

  if (addedContext.length > 0) {
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "SessionStart",
          additionalContext: addedContext,
        },
      }),
    );
  }
}

main().catch(() => process.exit(1));
