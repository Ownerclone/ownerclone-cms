'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewScriptPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [logline, setLogline] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          logline: logline || null,
          elements: [{
            id: 'element-initial',
            type: 'action',
            content: ''
          }]
        })
      });

      const data = await res.json();
      
      if (data.script) {
        router.push(`/cms/scripts/${data.script.id}`);
      }
    } catch (error) {
      console.error('Failed to create script:', error);
      alert('Failed to create script');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Back button */}
        <Link 
          href="/cms/scripts"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scripts
        </Link>

        <div className="bg-white rounded-lg border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            New Script
          </h1>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter script title"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Logline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logline (optional)
              </label>
              <textarea
                value={logline}
                onChange={(e) => setLogline(e.target.value)}
                placeholder="A one-sentence summary of your script"
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Screenplay Formatting
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Auto-formatting as you type</li>
                <li>• TAB to cycle element types</li>
                <li>• ENTER for new lines</li>
                <li>• Type INT. or EXT. for scene headings</li>
                <li>• ALL CAPS for character names</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleCreate}
                disabled={creating || !title.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {creating ? 'Creating...' : 'Create Script'}
              </button>
              <Link
                href="/cms/scripts"
                className="px-6 py-3 border rounded-lg hover:bg-gray-50 font-medium text-gray-700"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
