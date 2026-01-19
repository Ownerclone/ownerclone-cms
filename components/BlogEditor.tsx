'use client';

import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Save, Eye, Code } from 'lucide-react';

interface BlogEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialExcerpt?: string;
  initialSeoMetadata?: any;
  onSave?: (data: any) => void;
  autoSave?: boolean;
}

export default function BlogEditor({
  initialTitle = '',
  initialContent = '',
  initialExcerpt = '',
  initialSeoMetadata = {},
  onSave,
  autoSave = true
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [metaTitle, setMetaTitle] = useState(initialSeoMetadata.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(initialSeoMetadata.meta_description || '');
  const [keywords, setKeywords] = useState<string[]>(initialSeoMetadata.keywords || []);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave({
        title,
        content,
        excerpt,
        seo_metadata: {
          meta_title: metaTitle,
          meta_description: metaDescription,
          keywords
        }
      });
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="border-b px-6 py-3 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50"
          >
            {showPreview ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {content.split(/\s+/).filter(w => w.length > 0).length} words
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          {!showPreview ? (
            <>
              {/* Title */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog Post Title"
                className="w-full text-4xl font-bold mb-6 focus:outline-none"
              />

              {/* Excerpt */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (Summary)
                </label>
                <TextareaAutosize
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the post..."
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  minRows={2}
                />
              </div>

              {/* Content */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Markdown supported)
                </label>
                <TextareaAutosize
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post here... You can use **bold**, *italic*, ## headings, etc."
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                  minRows={20}
                />
              </div>

              {/* SEO Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>

                <div className="space-y-4">
                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={title || 'SEO title (60 chars max)'}
                      maxLength={60}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {metaTitle.length}/60 characters
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <TextareaAutosize
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Brief description for search engines (160 chars max)"
                      maxLength={160}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      minRows={2}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {metaDescription.length}/160 characters
                    </p>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        placeholder="Add keyword..."
                        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={addKeyword}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Preview Mode */
            <div className="prose max-w-none">
              <h1>{title || 'Untitled Post'}</h1>
              {excerpt && (
                <p className="text-xl text-gray-600 italic border-l-4 border-blue-500 pl-4">
                  {excerpt}
                </p>
              )}
              <div className="whitespace-pre-wrap">{content}</div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t px-6 py-2 bg-gray-50 text-xs text-gray-600">
        {autoSave && <span className="text-green-600">Auto-save enabled</span>}
      </div>
    </div>
  );
}
