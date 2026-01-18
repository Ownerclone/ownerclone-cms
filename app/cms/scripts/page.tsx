'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, FileText, Clock, CheckCircle } from 'lucide-react';

interface Script {
  id: string;
  title: string;
  logline?: string;
  status: 'draft' | 'review' | 'published';
  created_at: string;
  updated_at: string;
}

export default function ScriptsListPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'review' | 'published'>('all');

  useEffect(() => {
    loadScripts();
  }, [filter]);

  const loadScripts = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/scripts'
        : `/api/scripts?status=${filter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setScripts(data.scripts || []);
    } catch (error) {
      console.error('Failed to load scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this script?')) return;

    try {
      await fetch(`/api/scripts/${id}`, { method: 'DELETE' });
      setScripts(scripts.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scripts</h1>
              <p className="text-gray-600 mt-1">
                Write screenplay-formatted content
              </p>
            </div>
            <Link
              href="/cms/scripts/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              New Script
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-6">
            {(['all', 'draft', 'review', 'published'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scripts list */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading scripts...
          </div>
        ) : scripts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No scripts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first screenplay
            </p>
            <Link
              href="/cms/scripts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Create Script
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {scripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScriptCard({ 
  script, 
  onDelete 
}: { 
  script: Script; 
  onDelete: (id: string) => void;
}) {
  const statusConfig = {
    draft: { color: 'gray', icon: Clock },
    review: { color: 'yellow', icon: Clock },
    published: { color: 'green', icon: CheckCircle },
  };

  const config = statusConfig[script.status];
  const StatusIcon = config.icon;

  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    green: 'bg-green-100 text-green-700',
  }[config.color];

  return (
    <Link href={`/cms/scripts/${script.id}`} className="block">
      <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {script.title}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${colorClasses}`}>
                <StatusIcon className="w-3 h-3" />
                {script.status}
              </span>
            </div>
            {script.logline && (
              <p className="text-gray-600 mb-3">{script.logline}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>
                Updated {new Date(script.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(script.id);
            }}
            className="text-gray-400 hover:text-red-600 transition-colors ml-4"
          >
            Delete
          </button>
        </div>
      </div>
    </Link>
  );
}
