'use client';

import { useState, useEffect } from 'react';
import DocsTab from './components/DocsTab';
import type { ServerConfig } from '@/types';

export default function Home() {
  const [config, setConfig] = useState<ServerConfig | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to fetch config:', err));
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold">Smart Docs</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Documentation manager
          </p>
          {config && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {config.docsPath}
            </p>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        <DocsTab />
      </main>
    </div>
  );
}
