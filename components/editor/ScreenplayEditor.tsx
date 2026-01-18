'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ScriptElement, ElementType } from '@/types/screenplay';
import { ScreenplayFormatter, ELEMENT_CYCLE } from '@/lib/screenplay/formatter';
import { Save, RotateCcw, FileText } from 'lucide-react';

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
  const textareaRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map());

  // Auto-save every 10 seconds
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

  const updateElement = (index: number, content: string) => {
    const previousElement = index > 0 ? elements[index - 1] : undefined;
    const formatted = ScreenplayFormatter.autoFormatLine(content, previousElement);

    const newElements = [...elements];
    newElements[index] = {
      ...newElements[index],
      content: formatted.content,
      type: formatted.type
    };

    setElements(newElements);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    // TAB: Cycle element type
    if (e.key === 'Tab') {
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

    // ENTER: Create new line
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const newElement: ScriptElement = {
        id: `element-${Date.now()}`,
        type: 'action',
        content: ''
      };

      const newElements = [...elements];
      newElements.splice(index + 1, 0, newElement);
      setElements(newElements);

      // Focus next element
      setTimeout(() => {
        const nextRef = textareaRefs.current.get(index + 1);
        if (nextRef) nextRef.focus();
      }, 0);
      return;
    }

    // BACKSPACE on empty line: Delete line
    if (e.key === 'Backspace' && !elements[index].content && elements.length > 1) {
      e.preventDefault();
      const newElements = elements.filter((_, i) => i !== index);
      setElements(newElements);
      
      // Focus previous element
      setTimeout(() => {
        const prevRef = textareaRefs.current.get(Math.max(0, index - 1));
        if (prevRef) {
          prevRef.focus();
          prevRef.setSelectionRange(prevRef.value.length, prevRef.value.length);
        }
      }, 0);
      return;
    }

    // CMD/CTRL + S: Save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
      return;
    }
  };

  const getElementStyle = (type: ElementType): string => {
    const baseStyle = 'px-4 py-2 w-full resize-none focus:outline-none transition-colors';
    
    switch (type) {
      case 'scene_heading':
        return `${baseStyle} font-bold uppercase text-lg`;
      case 'character':
        return `${baseStyle} font-bold uppercase text-center`;
      case 'dialogue':
        return `${baseStyle} max-w-2xl mx-auto`;
      case 'parenthetical':
        return `${baseStyle} max-w-xl mx-auto italic text-gray-600`;
      case 'transition':
        return `${baseStyle} text-right font-bold uppercase`;
      case 'action':
      default:
        return `${baseStyle}`;
    }
  };

  const addNewElement = () => {
    const newElement: ScriptElement = {
      id: `element-${Date.now()}`,
      type: 'action',
      content: ''
    };
    setElements([...elements, newElement]);
    
    setTimeout(() => {
      const lastRef = textareaRefs.current.get(elements.length);
      if (lastRef) lastRef.focus();
    }, 0);
  };

  // Initialize with one empty element if none exist
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
      {/* Toolbar */}
      <div className="border-b px-6 py-3 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
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
          
          <div className="text-sm text-gray-600">
            {elements.length} elements
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <kbd className="px-2 py-1 bg-gray-200 rounded">TAB</kbd>
          <span>Change type</span>
          <kbd className="px-2 py-1 bg-gray-200 rounded">ENTER</kbd>
          <span>New line</span>
          <kbd className="px-2 py-1 bg-gray-200 rounded">⌘S</kbd>
          <span>Save</span>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto py-12">
          {elements.map((element, index) => (
            <div key={element.id} className="relative group">
              {/* Element type indicator */}
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
            </div>
          ))}

          {/* Add element button */}
          <button
            onClick={addNewElement}
            className="mx-4 mt-4 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded border-2 border-dashed border-gray-300"
          >
            + Add element
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t px-6 py-2 bg-gray-50 text-xs text-gray-600 flex items-center justify-between">
        <div>
          Line {currentElementIndex + 1} of {elements.length}
        </div>
        <div className="flex items-center gap-2">
          {autoSave && (
            <span className="text-green-600">Auto-save enabled</span>
          )}
        </div>
      </div>
    </div>
  );
}
