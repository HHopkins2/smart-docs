import * as chokidar from 'chokidar';
import * as path from 'path';
import { EventEmitter } from 'events';
import type { ServerConfig, FileChangeEvent, FileEventType } from '@/types';

export class FileSystemWatcher extends EventEmitter {
  private watcher: chokidar.FSWatcher | null = null;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    super();
    this.config = config;
  }

  start() {
    this.watcher = chokidar.watch(['**/*.md'], {
      cwd: this.config.docsPath,
      ignoreInitial: true,
      ignored: ['**/node_modules/**', '**/.git/**'],
    });

    this.watcher.on('all', (event: string, relativePath: string) => {
      const fileEvent: FileChangeEvent = {
        type: this.mapEventType(event),
        path: path.join(this.config.docsPath, relativePath),
      };

      this.emit('change', fileEvent);
    });

    console.log('👀 File watching started for docs');
  }

  private mapEventType(event: string): FileEventType {
    switch (event) {
      case 'add':
      case 'addDir':
        return 'add';
      case 'change':
        return 'change';
      case 'unlink':
      case 'unlinkDir':
        return 'unlink';
      default:
        return 'change';
    }
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    console.log('👋 File watching stopped');
  }
}
