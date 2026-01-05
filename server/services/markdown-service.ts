import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import type { MarkdownFile, MarkdownContent, FileTreeNode, Frontmatter } from '@/types';

export interface WriteOptions {
  frontmatter?: Frontmatter | null;
  content: string;
}

export class MarkdownService {
  async getFileTree(docsPath: string): Promise<FileTreeNode> {
    return this.buildTreeNode(docsPath, '');
  }

  private async buildTreeNode(basePath: string, relativePath: string): Promise<FileTreeNode> {
    const fullPath = path.join(basePath, relativePath);
    const stat = await fs.stat(fullPath);
    const name = relativePath ? path.basename(relativePath) : path.basename(basePath);

    if (stat.isFile()) {
      return {
        type: 'file',
        name,
        path: relativePath,
      };
    }

    // Directory
    const entries = await fs.readdir(fullPath);
    const children: FileTreeNode[] = [];

    for (const entry of entries) {
      // Skip hidden files and node_modules
      if (entry.startsWith('.') || entry === 'node_modules') {
        continue;
      }

      const entryPath = path.join(relativePath, entry);
      try {
        const childNode = await this.buildTreeNode(basePath, entryPath);
        children.push(childNode);
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return {
      type: 'directory',
      name,
      path: relativePath,
      children: children.sort((a, b) => {
        // Directories first, then files
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      }),
    };
  }

  async getMarkdownFiles(docsPath: string): Promise<MarkdownFile[]> {
    const files: MarkdownFile[] = [];
    await this.scanDirectory(docsPath, '', files);
    return files;
  }

  private async scanDirectory(basePath: string, relativePath: string, files: MarkdownFile[]): Promise<void> {
    const fullPath = path.join(basePath, relativePath);

    try {
      const entries = await fs.readdir(fullPath);

      for (const entry of entries) {
        if (entry.startsWith('.') || entry === 'node_modules') {
          continue;
        }

        const entryRelativePath = path.join(relativePath, entry);
        const entryFullPath = path.join(basePath, entryRelativePath);
        const stat = await fs.stat(entryFullPath);

        if (stat.isDirectory()) {
          await this.scanDirectory(basePath, entryRelativePath, files);
        } else if (entry.endsWith('.md')) {
          const content = await fs.readFile(entryFullPath, 'utf-8');
          const parsed = matter(content);
          const frontmatter = parsed.data as Frontmatter;

          files.push({
            path: entryRelativePath,
            name: entry,
            title: frontmatter.title || this.getTitleFromFilename(entry),
          });
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }

  async readMarkdownFile(filePath: string): Promise<MarkdownContent> {
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = matter(content);

    return {
      path: filePath,
      frontmatter: Object.keys(parsed.data).length > 0 ? (parsed.data as Frontmatter) : null,
      content: parsed.content,
    };
  }

  private getTitleFromFilename(filename: string): string {
    return filename
      .replace(/\.md$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  async writeMarkdownFile(filePath: string, options: WriteOptions): Promise<void> {
    let fileContent: string;

    if (options.frontmatter && Object.keys(options.frontmatter).length > 0) {
      // Use gray-matter to stringify with frontmatter
      fileContent = matter.stringify(options.content, options.frontmatter);
    } else {
      fileContent = options.content;
    }

    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(filePath, fileContent, 'utf-8');
  }

  async createFile(docsPath: string, relativePath: string, options: WriteOptions): Promise<void> {
    const fullPath = path.join(docsPath, relativePath);

    // Security check
    if (!fullPath.startsWith(docsPath)) {
      throw new Error('Invalid path: outside docs directory');
    }

    // Check if file already exists
    try {
      await fs.access(fullPath);
      throw new Error('File already exists');
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    await this.writeMarkdownFile(fullPath, options);
  }

  async deleteFile(docsPath: string, relativePath: string): Promise<void> {
    const fullPath = path.join(docsPath, relativePath);

    // Security check
    if (!fullPath.startsWith(docsPath)) {
      throw new Error('Invalid path: outside docs directory');
    }

    await fs.unlink(fullPath);
  }

  async renameFile(docsPath: string, oldRelativePath: string, newRelativePath: string): Promise<void> {
    const oldFullPath = path.join(docsPath, oldRelativePath);
    const newFullPath = path.join(docsPath, newRelativePath);

    // Security checks
    if (!oldFullPath.startsWith(docsPath) || !newFullPath.startsWith(docsPath)) {
      throw new Error('Invalid path: outside docs directory');
    }

    // Ensure target directory exists
    const newDir = path.dirname(newFullPath);
    await fs.mkdir(newDir, { recursive: true });

    await fs.rename(oldFullPath, newFullPath);
  }
}
