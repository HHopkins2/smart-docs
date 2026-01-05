import type { ServerConfig } from '@/types';

export function getServerConfig(): ServerConfig {
  const docsPath = process.env.SMART_DOCS_PATH;

  if (!docsPath) {
    throw new Error('Server configuration missing. Make sure to start via the CLI.');
  }

  return {
    docsPath,
  };
}
