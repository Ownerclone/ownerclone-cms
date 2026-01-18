export interface CharacterRelationship {
  id: string;
  character_id: string;
  related_character_id: string;
  relationship_type: string; // 'friend', 'enemy', 'family', 'romantic', 'business', 'mentor', etc.
  description?: string;
  created_at: string;
}

export interface CharacterArc {
  id: string;
  character_id: string;
  arc_name: string;
  description: string;
  start_point: string;
  end_point: string;
  key_moments?: string[];
  created_at: string;
  updated_at: string;
}

export interface VoiceSample {
  id: string;
  character_id: string;
  sample_text: string;
  context?: string; // When/why they said this
  created_at: string;
}

export interface CharacterEnhanced {
  id: string;
  name: string;
  description: string;
  personality_traits: string[];
  voice_notes?: string;
  avatar_url?: string;
  created_at: string;
  // New fields
  relationships?: CharacterRelationship[];
  arcs?: CharacterArc[];
  voice_samples?: VoiceSample[];
  backstory?: string;
  goals?: string;
  conflicts?: string;
}
