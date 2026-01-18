import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

// GET /api/characters - List all characters
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ characters: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/characters - Create new character
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      personality_traits = [], 
      voice_notes,
      avatar_url 
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('characters')
      .insert({
        name,
        description,
        personality_traits,
        voice_notes,
        avatar_url
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ character: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
