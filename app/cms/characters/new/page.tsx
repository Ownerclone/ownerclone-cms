'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function NewCharacterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [traits, setTraits] = useState<string[]>([]);
  const [currentTrait, setCurrentTrait] = useState('');
  const [voiceNotes, setVoiceNotes] = useState('');
  const [creating, setCreating] = useState(false);

  const addTrait = () => {
    if (currentTrait.trim() && !traits.includes(currentTrait.trim())) {
      setTraits([...traits, currentTrait.trim()]);
      setCurrentTrait('');
    }
  };

  const removeTrait = (trait: string) => {
    setTraits(traits.filter(t => t !== trait));
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('Please enter a character name');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name,
          description: description || null,
          personality_traits: traits,
          voice_notes: voiceNotes || null
        })
      });

      const data = await res.json();
      
      if (data.character) {
        router.push('/cms/characters');
      }
    } catch (error) {
      console.error('Failed to create character:', error);
      alert('Failed to create character');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Back button */}
        <Link 
          href="/cms/characters"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Characters
        </Link>

        <div className="bg-white rounded-lg border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            New Character
          </h1>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Character name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the character"
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Personality Traits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personality Traits
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTrait}
                  onChange={(e) => setCurrentTrait(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrait())}
                  placeholder="Add a trait..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addTrait}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {traits.map((trait) => (
                  <span
                    key={trait}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                  >
                    {trait}
                    <button
                      onClick={() => removeTrait(trait)}
                      className="hover:text-purple-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Voice Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Notes (for AI consistency)
              </label>
              <textarea
                value={voiceNotes}
                onChange={(e) => setVoiceNotes(e.target.value)}
                placeholder="How does this character speak? Speech patterns, catchphrases, tone..."
                rows={4}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                These notes help AI maintain consistent character voice across scripts
              </p>
            </div>

            {/* Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">
                Character Database
              </h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Characters are loaded into AI context when writing</li>
                <li>• Voice notes ensure consistent dialogue</li>
                <li>• Personality traits guide character behavior</li>
                <li>• Use in screenplay editor and content generation</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleCreate}
                disabled={creating || !name.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {creating ? 'Creating...' : 'Create Character'}
              </button>
              <Link
                href="/cms/characters"
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
