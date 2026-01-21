import { createClient } from '@supabase/supabase-js';

// For server-side API routes, we need to handle env vars differently
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Add validation to help debug
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? 'present' : 'MISSING',
    key: supabaseAnonKey ? 'present' : 'MISSING'
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type-safe database queries
export type Database = {
  public: {
    Tables: {
      scripts: {
        Row: {
          id: string;
          title: string;
          logline: string | null;
          elements: any[];
          status: 'draft' | 'review' | 'published';
          created_at: string;
          updated_at: string;
          metadata: Record<string, any>;
        };
        Insert: Omit<Database['public']['Tables']['scripts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['scripts']['Insert']>;
      };
      characters: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          personality_traits: string[];
          voice_notes: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['characters']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['characters']['Insert']>;
      };
      script_characters: {
        Row: {
          script_id: string;
          character_id: string;
        };
        Insert: Database['public']['Tables']['script_characters']['Row'];
        Update: Partial<Database['public']['Tables']['script_characters']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          seo_metadata: Record<string, any>;
          status: 'draft' | 'published';
          source_script_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
    };
  };
};
