// Screenplay format types based on Fountain spec
export type ElementType = 
  | 'scene_heading'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'
  | 'section'
  | 'synopsis'
  | 'note';

export interface ScriptElement {
  id: string;
  type: ElementType;
  content: string;
  metadata?: {
    sceneNumber?: string;
    isDualDialogue?: boolean;
    isCentered?: boolean;
  };
}

export interface Script {
  id: string;
  title: string;
  logline?: string;
  elements: ScriptElement[];
  status: 'draft' | 'review' | 'published';
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    genre?: string;
    tone?: string;
    targetPlatforms?: string[];
    seoKeywords?: string[];
  };
}

export interface Character {
  id: string;
  name: string;
  description: string;
  personalityTraits: string[];
  voiceNotes?: string; // For AI consistency
  avatarUrl?: string;
  createdAt: Date;
}

export interface ScriptVersion {
  id: string;
  scriptId: string;
  versionNumber: number;
  elements: ScriptElement[];
  createdAt: Date;
}

// Auto-formatting rules
export interface FormatRule {
  pattern: RegExp;
  elementType: ElementType;
  transform?: (text: string) => string;
}

// Editor state
export interface EditorState {
  currentScript: Script | null;
  currentElement: number;
  isGenerating: boolean;
  selectedCharacters: Character[];
}
