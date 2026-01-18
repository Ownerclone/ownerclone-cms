'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';
import ScreenplayEditor from '@/components/editor/ScreenplayEditor';
import { ScriptElement } from '@/types/screenplay';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ScriptEditorPage({ params }: PageProps) {
  const router = useRouter();
  const [script, setScript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [title, setTitle] = useState('');
  const [logline, setLogline] = useState('');
  const [status, setStatus] = useState<'draft' | 'review' | 'published'>('draft');

  useEffect(() => {
    loadScript();
  }, [params.id]);

  const loadScript = async () => {
    try {
      const res = await fetch(`/api/scripts/${params.id}`);
      const data = await res.json();
      
      if (data.script) {
        setScript(data.script);
        setTitle(data.script.title);
        setLogline(data.script.logline || '');
        setStatus(data.script.status);
      }
    } catch (error) {
      console.error('Failed to load script:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveElements = async (elements: ScriptElement[]) => {
    try {
      await fetch(`/api/scripts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elements })
      });
    } catch (error) {
      console.error('Failed to save elements:', error);
      throw error;
    }
  };

  const handleUpdateMetadata = async () => {
    try {
      await fetch(`/api/scripts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, logline, status })
      });
      setShowSettings(false);
      loadScript();
    } catch (error) {
      console.error('Failed to update metadata:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading script...</div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Script not found</p>
          <Link href="/cms/scripts" className="text-blue-600 hover:underline">
            Back to Scripts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/cms/scripts"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {script.title}
            </h1>
            {script.logline && (
              <p className="text-sm text-gray-600">{script.logline}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="border-b bg-gray-50 px-6 py-4">
          <div className="max-w-2xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logline
              </label>
              <textarea
                value={logline}
                onChange={(e) => setLogline(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateMetadata}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <ScreenplayEditor
          scriptId={params.id}
          initialElements={script.elements || []}
          onSave={handleSaveElements}
          autoSave={true}
        />
      </div>
    </div>
  );
}
