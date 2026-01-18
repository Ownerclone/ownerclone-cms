import { ElementType, ScriptElement, FormatRule } from '@/types/screenplay';

/**
 * Screenplay Auto-Formatter
 * Implements Fountain-style formatting rules
 */

export class ScreenplayFormatter {
  private static rules: FormatRule[] = [
    // Scene headings: INT./EXT./INT./EXT.
    {
      pattern: /^(INT\.|EXT\.|INT\.\/EXT\.|I\/E\.).*/i,
      elementType: 'scene_heading',
      transform: (text) => text.toUpperCase()
    },
    // Transitions: FADE IN:, CUT TO:, etc.
    {
      pattern: /^(FADE IN:|FADE OUT\.|CUT TO:|DISSOLVE TO:)$/i,
      elementType: 'transition',
      transform: (text) => text.toUpperCase()
    },
    // Character names: ALL CAPS on their own line
    {
      pattern: /^[A-Z\s]{2,}$/,
      elementType: 'character',
      transform: (text) => text.toUpperCase().trim()
    },
    // Parentheticals: (text in parens)
    {
      pattern: /^\(.*\)$/,
      elementType: 'parenthetical'
    }
  ];

  /**
   * Detect element type from text content and context
   */
  static detectElementType(
    text: string, 
    previousElement?: ScriptElement
  ): ElementType {
    const trimmed = text.trim();
    
    // Empty lines are action by default
    if (!trimmed) return 'action';

    // Check against formatting rules
    for (const rule of this.rules) {
      if (rule.pattern.test(trimmed)) {
        return rule.elementType;
      }
    }

    // Context-based detection
    if (previousElement?.type === 'character') {
      return 'dialogue';
    }

    if (previousElement?.type === 'dialogue' && trimmed.startsWith('(')) {
      return 'parenthetical';
    }

    // Default to action
    return 'action';
  }

  /**
   * Format text according to element type
   */
  static formatText(text: string, elementType: ElementType): string {
    const rule = this.rules.find(r => r.elementType === elementType);
    
    if (rule?.transform) {
      return rule.transform(text);
    }

    // Type-specific formatting
    switch (elementType) {
      case 'scene_heading':
        return text.toUpperCase();
      case 'character':
        return text.toUpperCase().trim();
      case 'transition':
        return text.toUpperCase();
      case 'dialogue':
      case 'action':
      case 'parenthetical':
      default:
        return text;
    }
  }

  /**
   * Parse raw text into structured elements
   */
  static parseScript(text: string): ScriptElement[] {
    const lines = text.split('\n');
    const elements: ScriptElement[] = [];
    let previousElement: ScriptElement | undefined;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const elementType = this.detectElementType(line, previousElement);
      const formattedContent = this.formatText(line, elementType);

      const element: ScriptElement = {
        id: `element-${i}-${Date.now()}`,
        type: elementType,
        content: formattedContent
      };

      elements.push(element);
      previousElement = element;
    }

    return elements;
  }

  /**
   * Convert structured elements back to text
   */
  static elementsToText(elements: ScriptElement[]): string {
    return elements.map(el => el.content).join('\n');
  }

  /**
   * Auto-format as user types
   */
  static autoFormatLine(
    currentLine: string,
    previousElement?: ScriptElement
  ): { content: string; type: ElementType } {
    const elementType = this.detectElementType(currentLine, previousElement);
    const content = this.formatText(currentLine, elementType);
    
    return { content, type: elementType };
  }

  /**
   * Handle special keyboard commands
   */
  static handleCommand(command: string, currentText: string): string {
    const commands: Record<string, string> = {
      'INT.': 'INT. ',
      'EXT.': 'EXT. ',
      'CUT TO:': 'CUT TO:',
      'FADE IN:': 'FADE IN:',
      'FADE OUT.': 'FADE OUT.'
    };

    return commands[command.toUpperCase()] || currentText;
  }

  /**
   * Get character names from script for autocomplete
   */
  static extractCharacterNames(elements: ScriptElement[]): string[] {
    const names = new Set<string>();
    
    elements.forEach(el => {
      if (el.type === 'character') {
        const name = el.content.split('(')[0].trim(); // Remove (V.O.) etc.
        names.add(name);
      }
    });

    return Array.from(names).sort();
  }
}

/**
 * Keyboard shortcuts for screenplay editor
 */
export const SCREENPLAY_SHORTCUTS = {
  TAB: 'nextElementType',        // Cycle through element types
  ENTER: 'newLine',               // Smart new line
  'CMD+B': 'bold',                // Bold (for action lines)
  'CMD+I': 'italic',              // Italic
  'CMD+U': 'underline',           // Underline
  'CMD+S': 'save',                // Save script
  'CMD+/': 'toggleComment',       // Add/remove /* */ comment
};

/**
 * Element cycling for TAB key
 */
export const ELEMENT_CYCLE: ElementType[] = [
  'action',
  'character',
  'dialogue',
  'parenthetical',
  'scene_heading',
  'transition'
];
