/**
 * Server configuration
 */
export interface ServerConfig {
  docsPath: string;
}

/**
 * Generic frontmatter for markdown files
 */
export interface Frontmatter {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Markdown file metadata
 */
export interface MarkdownFile {
  /** Relative path to docs root */
  path: string;
  /** Filename */
  name: string;
  /** Title from frontmatter or filename */
  title: string;
}

/**
 * Markdown file with parsed content
 */
export interface MarkdownContent {
  path: string;
  frontmatter: Frontmatter | null;
  content: string;
}

/**
 * Node in a file tree structure
 */
export interface FileTreeNode {
  type: 'file' | 'directory';
  name: string;
  path: string;
  children?: FileTreeNode[];
}

/**
 * File change event types
 */
export type FileEventType = 'add' | 'change' | 'unlink';

/**
 * File change event from watcher
 */
export interface FileChangeEvent {
  type: FileEventType;
  path: string;
}
