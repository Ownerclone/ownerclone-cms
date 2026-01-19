'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ScriptElement, ElementType } from '@/types/screenplay';
import { ScreenplayFormatter, ELEMENT_CYCLE } from '@/lib/screenplay/formatter';
import { Save, RotateCcw, Keyboard } from 'lucide-react';
import ShortcutsHelp from '@/components/ShortcutsHelp';
import ScriptStats from '@/components/ScriptStats';

interface Character {
  id: string;
  name: string;
  description: string;
  personality_traits: string[];
  voice_notes?: string;
  avatar_url?: string;
  created_at: string;
}

interface ScreenplayEditorProps {
  scriptId?: string;
  initialElements?: ScriptElement[];
  onSave?: (elements: ScriptElement[]) => void;
  autoSave?: boolean;
}

export default function ScreenplayEditor({ 
  scriptId,
  initialElements = [],
  onSave,
  autoSave = true 
}: ScreenplayEditorProps) {
  const [elements, setElements] = useState<ScriptElement[]>(initialElements);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [sceneCharacters, setSceneCharacters] = useState<Set<string>>(new Set());
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [selectedAutocomplete, setSelectedAutocomplete] = useState(0);
  const textareaRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map());
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  useEffect(() => {
    const charNames = new Set<string>();
    let inCurrentScene = false;
    
    for (const element of elements) {
      if (element.type === 'scene_heading') {
        charNames.clear();
        inCurrentScene = true;
      }
      
      if (element.type === 'character' && inCurrentScene) {
        const name = element.content.split('(')[0].trim();
        if (name) charNames.add(name);
      }
    }
    
    setSceneCharacters(charNames);
  }, [elements]);

  const loadCharacters = async () => {
    try {
      const res = await fetch('/api/characters');
      const data = await res.json();
      setCharacters(data.characters || []);
    } catch (error) {
      console.error('Failed to load characters:', error);
    }
  };

  useEffect(() => {
    if (!autoSave || !onSave) return;

    const timer = setInterval(() => {
      handleSave();
    }, 10000);

    return () => clearInterval(timer);
  }, [elements, autoSave, onSave]);

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(elements);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getCharacterSuggestions = (input: string): string[] => {
    if (!input) return [];
    
    const inputLower = input.toLowerCase();
    const suggestions: string[] = [];
    
    sceneCharacters.forEach(name => {
      if (name.toLowerCase().startsWith(inputLower)) {
        suggestions.push(name);
      }
    });
    
    characters.forEach(char => {
      if (char.name.toLowerCase().startsWith(inputLower) && !sceneCharacters.has(char.name)) {
        suggestions.push(char.name);
      }
    });
    
    return [...new Set(suggestions)];
  };

  const updateElement = (index: number, content: string) => {
    const previousElement = index > 0 ? elements[index - 1] : undefined;
    const currentElement = elements[index];
    
    if (currentElement.type === 'character' || 
        (previousElement?.type === 'dialogue' && content.length > 0 && content === content.toUpperCase())) {
      const suggestions = getCharacterSuggestions(content);
      if (suggestions.length > 0) {
        setAutocompleteOptions(suggestions);
        setShowAutocomplete(true);
        setSelectedAutocomplete(0);
      } else {
        setShowAutocomplete(false);
      }
    } else {
      setShowAutocomplete(false);
    }
    
    const formatted = ScreenplayFormatter.autoFormatLine(content, previousElement);

    const newElements = [...elements];
    newElements[index] = {
      ...newElements[index],
      content: formatted.content,
      type: formatted.type
    };

    setElements(newElements);
  };

  const acceptAutocomplete = (index: number, suggestion: string) => {
    const newElements = [...elements];
    newElements[index] = {
      ...newElements[index],
      content: suggestion,
      type: 'character'
    };
    setElements(newElements);
    setShowAutocomplete(false);
    
    setTimeout(() => {
      const ref = textareaRefs.current.get(index);
      if (ref) {
        ref.focus();
        ref.setSelectionRange(suggestion.length, suggestion.length);
      }
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (showAutocomplete) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedAutocomplete((prev) => 
          Math.min(prev + 1, autocompleteOptions.length - 1)
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedAutocomplete((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        if (autocompleteOptions.length > 0) {
          e.preventDefault();
          acceptAutocomplete(index, autocompleteOptions[selectedAutocomplete]);
          return;
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAutocomplete(false);
        return;
      }
    }

    if (e.key === 'Tab' && !showAutocomplete) {
      e.preventDefault();
      const currentType = elements[index].type;
      const currentIndex = ELEMENT_CYCLE.indexOf(currentType);
      const nextType = ELEMENT_CYCLE[(currentIndex + 1) % ELEMENT_CYCLE.length];
      
      const newElements = [...elements];
      newElements[index] = {
        ...newElements[index],
        type: nextType,
        content: ScreenplayFormatter.formatText(newElements[index].content, nextType)
      };
      setElements(newElements);
      return;
    }

    if (e.key === 'Enter' && !showAutocomplete) {
      e.preventDefault();
      
      const currentElement = elements[index];
      let newElementType: ElementType = 'action';
      
      if (currentElement.type === 'character') {
        newElementType = 'dialogue';
      } else if (currentElement.type === 'dialogue') {
        newElementType = 'action';
      } else if (currentElement.type === 'parenthetical') {
        newElementType = 'dialogue';
      }
      
      const newElement: ScriptElement = {
        id: 'element-' + Date.now().toString(),
        type: newElementType,
        content: ''
      };

      const newElements = [...elements];
      newElements.splice(index + 1, 0, newElement);
      setElements(newElements);

      setTimeout(() => {
        const nextRef = textareaRefs.current.get(index + 1);
        if (nextRef) nextRef.focus();
      }, 0);
      return;
    }

    if (e.key === 'Backspace' && !elements[index].content && elements.length > 1) {
      e.preventDefault();
      const newElements = elements.filter((_, i) => i !== index);
      setElements(newElements);
      
      setTimeout(() => {
        const prevRef = textareaRefs.current.get(Math.max(0, index - 1));
        if (prevRef) {
          prevRef.focus();
          prevRef.setSelectionRange(prevRef.value.length, prevRef.value.length);
        }
      }, 0);
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setShowShortcuts(true);
      return;
    }
  };

  const getElementStyle = (type: ElementType): string => {
    const baseStyle = 'px-4 py-2 resize-none focus:outline-none transition-colors';
    
    switch (type) {
      case 'scene_heading':
        return baseStyle + ' w-full font-bold uppercase text-lg';
      case 'character':
        return baseStyle + ' w-full font-bold uppercase text-center';
      case 'dialogue':
        return baseStyle + ' block mx-auto w-[400px]';
      case 'parenthetical':
        return baseStyle + ' block mx-auto w-[300px] italic text-gray-600 text-center';
      case 'transition':
        return baseStyle + ' w-full text-right font-bold uppercase';
      case 'action':
      default:
        return baseStyle + ' w-full';
    }
  };

  const addNewElement = () => {
    const newElement: ScriptElement = {
      id: 'element-' + Date.now().toString(),
      type: 'action',
      content: ''
    };
    setElements([...elements, newElement]);
    
    setTimeout(() => {
      const lastRef = textareaRefs.current.get(elements.length);
      if (lastRef) lastRef.focus();
    }, 0);
  };

  useEffect(() => {
    if (elements.length === 0) {
      setElements([{
        id: 'element-initial',
        type: 'action',
        content: ''
      }]);
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b bg-gray-50">
        {/* Top row - Buttons */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>

            <button
              onClick={() => setShowShortcuts(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50"
            >
              <Keyboard className="w-4 h-4" />
              Shortcuts
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <kbd className="px-2 py-1 bg-gray-200 rounded">TAB</kbd>
            <span>Change type / Autocomplete</span>
            <kbd className="px-2 py-1 bg-gray-200 rounded">ENTER</kbd>
            <span>New line</span>
            <kbd className="px-2 py-1 bg-gray-200 rounded">⌘S</kbd>
            <span>Save</span>
          </div>
        </div>

        {/* Bottom row - Stats */}
        <div className="px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ScriptStats elements={elements} />
            
            <div className="text-sm text-gray-600">
              {elements.length} elements
            </div>
            
            {sceneCharacters.size > 0 && (
              <div className="text-sm text-gray-500">
                In scene: {Array.from(sceneCharacters).join(', ')}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Line {currentElementIndex + 1} of {elements.length}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto py-12">
          {elements.map((element, index) => (
            <div key={element.id} className="relative group">
              <div className="absolute left-0 top-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity -ml-20 w-16 text-right">
                {element.type}
              </div>

              <TextareaAutosize
                ref={(ref) => {
                  if (ref) textareaRefs.current.set(index, ref);
                }}
                value={element.content}
                onChange={(e) => updateElement(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setCurrentElementIndex(index)}
                placeholder={
                  element.type === 'action' ? 'Action...' :
                  element.type === 'character' ? 'CHARACTER NAME' :
                  element.type === 'dialogue' ? 'Dialogue...' :
                  element.type === 'scene_heading' ? 'INT./EXT. LOCATION - TIME' :
                  'Type here...'
                }
                className={getElementStyle(element.type)}
                minRows={1}
              />
              
              {showAutocomplete && index === currentElementIndex && autocompleteOptions.length > 0 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[200px]">
                  {autocompleteOptions.map((option, i) => (
                    <button
                      key={option}
                      onClick={() => acceptAutocomplete(index, option)}
                      className={'w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors' + (i === selectedAutocomplete ? ' bg-blue-100' : '')}
                    >
                      {option}
                      {sceneCharacters.has(option) && (
                        <span className="ml-2 text-xs text-blue-600">(in scene)</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addNewElement}
            className="mx-4 mt-4 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded border-2 border-dashed border-gray-300"
          >
            + Add element
          </button>
        </div>
      </div>

      {autoSave && (
        <div className="border-t px-6 py-1 bg-gray-50 text-xs text-green-600 text-center">
          Auto-save enabled
        </div>
      )}

      {showShortcuts && (
        <ShortcutsHelp onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}
