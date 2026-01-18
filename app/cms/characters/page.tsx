'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Users, User } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  description: string;
  personality_traits: string[];
  voice_notes?: string;
  avatar_url?: string;
  created_at: string;
}

export default function CharactersListPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const res = await fetch('/api/characters');
      const data = await res.json();
      setCharacters(data.characters || []);
    } catch (error) {
      console.error('Failed to load characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this character?')) return;

    try {
      await fetch(`/api/characters/${id}`, { method: 'DELETE' });
      setCharacters(characters.filter(c => c.id !== id));
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
              <h1 className="text-3xl font-bold text-gray-900">Characters</h1>
              <p className="text-gray-600 mt-1">
                Build your character database for AI consistency
              </p>
            </div>
            <Link
              href="/cms/characters/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              New Character
            </Link>
          </div>
        </div>
      </div>

      {/* Characters grid */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading characters...
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No characters yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create characters for your scripts and AI-generated content
            </p>
            <Link
              href="/cms/characters/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Create Character
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CharacterCard({ 
  character, 
  onDelete 
}: { 
  character: Character; 
  onDelete: (id: string) => void;
}) {
  return (
    <Link href={`/cms/characters/${character.id}`} className="block">
      <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow h-full">
        <div className="flex items-start gap-4 mb-4">
          {character.avatar_url ? (
            <img
              src={character.avatar_url}
              alt={character.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {character.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {character.description}
            </p>
          </div>
        </div>

        {character.personality_traits.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {character.personality_traits.slice(0, 3).map((trait, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
              >
                {trait}
              </span>
            ))}
            {character.personality_traits.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{character.personality_traits.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-xs text-gray-500">
            Created {new Date(character.created_at).toLocaleDateString()}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(character.id);
            }}
            className="text-sm text-gray-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Link>
  );
}
