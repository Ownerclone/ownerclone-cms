'use client';

import { ScriptElement } from '@/types/screenplay';

interface ScriptStatsProps {
  elements: ScriptElement[];
}

export default function ScriptStats({ elements }: ScriptStatsProps) {
  // Calculate statistics
  const totalCharacters = elements.reduce((sum, el) => sum + el.content.length, 0);
  const totalWords = elements.reduce((sum, el) => {
    return sum + el.content.split(/\s+/).filter(w => w.length > 0).length;
  }, 0);
  
  // Screenplay page estimation: ~55 lines per page
  const lineCount = elements.length;
  const estimatedPages = Math.ceil(lineCount / 55);
  
  // Dialogue lines count
  const dialogueLines = elements.filter(el => el.type === 'dialogue').length;
  
  // Character appearances
  const characterNames = new Set<string>();
  elements.forEach(el => {
    if (el.type === 'character') {
      const name = el.content.split('(')[0].trim();
      if (name) characterNames.add(name);
    }
  });

  return (
    <div className="flex items-center gap-6 text-xs text-gray-500">
      <div className="flex items-center gap-1">
        <span className="font-medium">{estimatedPages}</span>
        <span>pages</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium">{lineCount}</span>
        <span>lines</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium">{totalWords}</span>
        <span>words</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium">{dialogueLines}</span>
        <span>dialogue</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium">{characterNames.size}</span>
        <span>characters</span>
      </div>
    </div>
  );
}
