'use client';

import { X } from 'lucide-react';

interface ShortcutsHelpProps {
  onClose: () => void;
}

export default function ShortcutsHelp({ onClose }: ShortcutsHelpProps) {
  const shortcuts = [
    { key: 'TAB', action: 'Cycle element type or accept autocomplete' },
    { key: 'ENTER', action: 'Create new line (smart type detection)' },
    { key: 'BACKSPACE', action: 'Delete empty line' },
    { key: '⌘S / CTRL+S', action: 'Save script' },
    { key: '⌘K / CTRL+K', action: 'Show/hide shortcuts' },
    { key: '↑ / ↓', action: 'Navigate autocomplete suggestions' },
    { key: 'ESC', action: 'Close autocomplete' },
  ];

  const formatting = [
    { trigger: 'INT. or EXT.', result: 'Scene Heading (uppercase)' },
    { trigger: 'ALL CAPS text', result: 'Character Name (centered)' },
    { trigger: 'After character', result: 'Dialogue (centered, narrow)' },
    { trigger: '(text in parens)', result: 'Parenthetical (centered)' },
    { trigger: 'CUT TO:', result: 'Transition (right-aligned)' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shortcuts</h3>
            <div className="space-y-3">
              {shortcuts.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <kbd className="px-3 py-1 bg-gray-100 text-gray-700 rounded font-mono text-sm">
                    {shortcut.key}
                  </kbd>
                  <span className="text-gray-600 text-sm flex-1 ml-6">{shortcut.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-Formatting Rules */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Auto-Formatting</h3>
            <div className="space-y-3">
              {formatting.map((rule, i) => (
                <div key={i} className="py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {rule.trigger}
                    </span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-2">{rule.result}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Start typing a character name to see autocomplete</li>
              <li>• Characters in the current scene appear first</li>
              <li>• Auto-save happens every 10 seconds</li>
              <li>• Press TAB to cycle through element types</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
