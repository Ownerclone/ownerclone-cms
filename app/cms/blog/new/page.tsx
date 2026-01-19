'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/BlogEditor';
import { Sparkles } from 'lucide-react';

interface Script {
  id: string;
  title: string;
  logline?: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [converting, setConverting] = useState(false);
  const [showScriptSelect, setShowScriptSelect] = useState(false);

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = async () => {
    try {
      const res = await fetch('/api/scripts');
      const data = await res.json();
      setScripts(data.scripts || []);
    } catch (error) {
      console.error('Failed to load scripts:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Save failed');

      const result = await res.json();
      router.push('/cms/blog/' + result.post.id);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save post');
    }
  };

  const handleConvertScript = async () => {
    if (!selectedScript) return;

    setConverting(true);
    try {
      const res = await fetch('/api/blog/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId: selectedScript })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Conversion failed');
      }

      const result = await res.json();
      router.push('/cms/blog/' + result.post.id);
    } catch (error: any) {
      console.error('Conversion failed:', error);
      alert('Failed to convert script: ' + error.message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowScriptSelect(!showScriptSelect)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Sparkles className="w-4 h-4" />
              Convert from Script with AI
            </button>
          </div>

          {showScriptSelect && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a script to convert
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedScript}
                  onChange={(e) => setSelectedScript(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a script...</option>
                  {scripts.map((script) => (
                    <option key={script.id} value={script.id}>
                      {script.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleConvertScript}
                  disabled={!selectedScript || converting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {converting ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Converting...
                    </span>
                  ) : 'Convert with AI'}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                AI will transform your screenplay into an engaging blog post
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <BlogEditor onSave={handleSave} autoSave={false} />
      </div>
    </div>
  );
}
