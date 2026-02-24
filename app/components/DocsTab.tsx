'use client';

import { useState, useEffect } from 'react';
import ReactMarkdownBase from 'react-markdown';
// Cast to any to avoid React 19 JSX type incompatibility
const ReactMarkdown = ReactMarkdownBase as any;
import { Prism as SyntaxHighlighterBase } from 'react-syntax-highlighter';
// Cast to any to avoid React 19 JSX type incompatibility
const SyntaxHighlighter = SyntaxHighlighterBase as any;
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import type { FileTreeNode, MarkdownContent, Frontmatter } from '@/types';
import { classifyVaultObject } from '@/types/vault';
import Mermaid from './Mermaid';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';

export default function DocsTab() {
  const [tree, setTree] = useState<FileTreeNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<MarkdownContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editFrontmatter, setEditFrontmatter] = useState<Frontmatter | null>(null);
  const [saving, setSaving] = useState(false);

  // Create file state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFilePath, setNewFilePath] = useState('');

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const objectClass = content && selectedFile
    ? classifyVaultObject(selectedFile, content.frontmatter)
    : null;

  const objectBadgeClass = objectClass
    ? {
      neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      green: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      amber: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    }[objectClass.tone]
    : '';

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      const response = await fetch('/api/docs/tree');
      const data = await response.json();
      setTree(data.tree);
    } catch (error) {
      console.error('Failed to fetch tree:', error);
      showToast('Failed to load file tree', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async (path: string) => {
    try {
      const response = await fetch(`/api/docs/content?path=${encodeURIComponent(path)}`);
      const data = await response.json();
      setContent(data);
      setSelectedFile(path);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      showToast('Failed to load file', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const startEditing = () => {
    if (content) {
      setEditContent(content.content);
      setEditFrontmatter(content.frontmatter ? { ...content.frontmatter } : null);
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditContent('');
    setEditFrontmatter(null);
  };

  const saveContent = async () => {
    if (!selectedFile) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/docs/content?path=${encodeURIComponent(selectedFile)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContent,
          frontmatter: editFrontmatter,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      // Refresh content
      await fetchContent(selectedFile);
      showToast('File saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save:', error);
      showToast('Failed to save file', 'error');
    } finally {
      setSaving(false);
    }
  };

  const createFile = async () => {
    if (!newFileName) return;

    const filePath = newFilePath
      ? `${newFilePath}/${newFileName}`
      : newFileName;

    // Ensure .md extension
    const finalPath = filePath.endsWith('.md') ? filePath : `${filePath}.md`;

    try {
      const response = await fetch('/api/docs/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: finalPath,
          content: '',
          frontmatter: { title: newFileName.replace('.md', '') },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create file');
      }

      await fetchTree();
      setShowCreateModal(false);
      setNewFileName('');
      setNewFilePath('');
      showToast('File created successfully', 'success');

      // Select the new file
      await fetchContent(finalPath);
    } catch (error: any) {
      console.error('Failed to create file:', error);
      showToast(error.message || 'Failed to create file', 'error');
    }
  };

  const deleteFile = async () => {
    if (!selectedFile) return;

    try {
      const response = await fetch(`/api/docs/content?path=${encodeURIComponent(selectedFile)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      await fetchTree();
      setContent(null);
      setSelectedFile(null);
      setShowDeleteConfirm(false);
      showToast('File deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete:', error);
      showToast('Failed to delete file', 'error');
    }
  };

  const updateFrontmatterField = (key: string, value: string) => {
    setEditFrontmatter(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateFrontmatterBool = (key: string, value: boolean) => {
    setEditFrontmatter(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const addFrontmatterField = () => {
    const key = prompt('Enter field name:');
    if (key) {
      setEditFrontmatter(prev => ({
        ...prev,
        [key]: '',
      }));
    }
  };

  const removeFrontmatterField = (key: string) => {
    setEditFrontmatter(prev => {
      if (!prev) return null;
      const { [key]: _, ...rest } = prev;
      return Object.keys(rest).length > 0 ? rest : null;
    });
  };

  const renderTree = (node: FileTreeNode) => {
    if (node.type === 'file') {
      return (
        <div
          key={node.path}
          className={`cursor-pointer px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 ${
            selectedFile === node.path ? 'bg-blue-100 dark:bg-blue-900' : ''
          }`}
          onClick={() => fetchContent(node.path)}
        >
          📄 {node.name}
        </div>
      );
    }

    return (
      <details key={node.path} open>
        <summary className="cursor-pointer px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800">
          📁 {node.name}
        </summary>
        <div className="ml-4">
          {node.children?.map(child => renderTree(child))}
        </div>
      </details>
    );
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Documentation</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Create new file"
            >
              + New
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {tree && renderTree(tree)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {content ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFile}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveContent}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startEditing}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6">
              {isEditing ? (
                <div className="space-y-4">
                  {/* Frontmatter editor */}
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Frontmatter</h4>
                      <button
                        onClick={addFrontmatterField}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        + Add field
                      </button>
                    </div>

                    {/* autoLoad toggle */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 mb-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Load</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Include in Claude Code context at session start</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateFrontmatterBool('autoLoad', !editFrontmatter?.autoLoad)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          editFrontmatter?.autoLoad ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        role="switch"
                        aria-checked={!!editFrontmatter?.autoLoad}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          editFrontmatter?.autoLoad ? 'translate-x-5' : ''
                        }`} />
                      </button>
                    </div>

                    {editFrontmatter && Object.keys(editFrontmatter).filter(k => k !== 'autoLoad').length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(editFrontmatter)
                          .filter(([key]) => key !== 'autoLoad')
                          .map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <label className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400">
                              {key}:
                            </label>
                            <input
                              type="text"
                              value={String(value || '')}
                              onChange={(e) => updateFrontmatterField(key, e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                            />
                            <button
                              onClick={() => removeFrontmatterField(key)}
                              className="text-red-500 hover:text-red-600 text-sm"
                              title="Remove field"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No additional frontmatter. Click "Add field" to add metadata.</p>
                    )}
                  </div>

                  {/* Content editor */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-[calc(100vh-400px)] min-h-[300px] p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                      placeholder="Write your markdown content here..."
                    />
                  </div>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {content.frontmatter && (
                    <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {content.frontmatter.title && (
                            <h1 className="mt-0">{content.frontmatter.title}</h1>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {objectClass && (
                            <span
                              className={`text-xs px-2 py-1 rounded whitespace-nowrap ${objectBadgeClass}`}
                              title={`Vault object type inferred from ${objectClass.source}`}
                            >
                              {objectClass.label}
                            </span>
                          )}
                          {content.frontmatter.autoLoad && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded whitespace-nowrap">
                              Auto Load
                            </span>
                          )}
                        </div>
                      </div>
                      {content.frontmatter.description && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {content.frontmatter.description}
                        </p>
                      )}
                    </div>
                  )}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const code = String(children).replace(/\n$/, '');

                        if (!inline && match?.[1] === 'mermaid') {
                          return <Mermaid chart={code} />;
                        }

                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {code}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {content.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a file to view its content
          </div>
        )}
      </div>

      {/* Create file modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Create New File</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">File Name</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="example.md"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Path (optional)</label>
                <input
                  type="text"
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  placeholder="folder/subfolder"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewFileName('');
                  setNewFilePath('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={createFile}
                disabled={!newFileName}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete File"
        message={`Are you sure you want to delete "${selectedFile}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive={true}
        onConfirm={deleteFile}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
