import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

// GET /api/characters - List all characters
export async function GET(request: NextRequest) {
  console.log('📥 GET /api/characters - Starting');
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Supabase GET error:', error);
      throw error;
    }

    console.log('✅ GET characters success:', data?.length, 'records');
    return NextResponse.json({ characters: data });
  } catch (error: any) {
    console.error('❌ GET /api/characters failed:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/characters - Create new character
export async function POST(request: NextRequest) {
  console.log('📥 POST /api/characters - Starting');
  try {
    const body = await request.json();
    console.log('📦 Request body:', JSON.stringify(body, null, 2));
    
    const { 
      name, 
      description, 
      personality_traits = [], 
      voice_notes,
      avatar_url 
    } = body;

    if (!name) {
      console.error('❌ Validation failed: name is required');
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Attempting to insert character:', { name, description, personality_traits });

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

    if (error) {
      console.error('❌ Supabase INSERT error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('✅ Character created successfully:', data);
    return NextResponse.json({ character: data }, { status: 201 });
  } catch (error: any) {
    console.error('❌ POST /api/characters failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error.details);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      { error: error.message || 'Failed to create character' },
      { status: 500 }
    );
  }
}
