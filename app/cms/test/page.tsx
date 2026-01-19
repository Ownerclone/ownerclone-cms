'use client';

import { Plus, Save } from 'lucide-react';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Icon Test</h1>
      <div className="flex gap-4">
        <Plus className="w-8 h-8 text-blue-600" />
        <Save className="w-8 h-8 text-green-600" />
      </div>
      <p className="mt-4">If you see two icons above, lucide-react is working!</p>
    </div>
  );
}
