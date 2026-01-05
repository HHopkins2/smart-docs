import type { ServerConfig } from '@/types';
import { FileSystemWatcher } from './file-watcher';
import { MarkdownService } from './markdown-service';

// Singleton instances
let watcher: FileSystemWatcher | null = null;
let markdownService: MarkdownService | null = null;
let serverConfig: ServerConfig | null = null;

let initialized = false;

export function initializeServices(config: ServerConfig) {
  if (initialized) {
    return;
  }

  serverConfig = config;
  watcher = new FileSystemWatcher(config);
  markdownService = new MarkdownService();

  // Start file watching
  watcher.start();

  initialized = true;
  console.log('✅ Services initialized');
}

export function getServices() {
  if (!initialized) {
    // Auto-initialize on first call
    try {
      const { getServerConfig } = require('../config');
      const config = getServerConfig();
      initializeServices(config);
    } catch (error) {
      throw new Error('Services not initialized and failed to auto-initialize: ' + error);
    }
  }

  return {
    watcher: watcher!,
    markdownService: markdownService!,
    config: serverConfig!,
  };
}

export function shutdownServices() {
  if (watcher) {
    watcher.stop();
  }
  initialized = false;
  console.log('👋 Services shutdown');
}
