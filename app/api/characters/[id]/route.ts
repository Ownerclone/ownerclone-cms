import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/characters/[id] - Get single character
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ character: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/characters/[id] - Update character
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    const { name, description, personality_traits, voice_notes, avatar_url } = body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (personality_traits !== undefined) updates.personality_traits = personality_traits;
    if (voice_notes !== undefined) updates.voice_notes = voice_notes;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const { data, error } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ character: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/characters/[id] - Delete character
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
