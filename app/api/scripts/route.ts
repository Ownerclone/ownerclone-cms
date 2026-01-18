import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import { Script } from '@/types/screenplay';

// GET /api/scripts - List all scripts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('scripts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ scripts: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/scripts - Create new script
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, logline, elements = [], metadata = {} } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('scripts')
      .insert({
        title,
        logline,
        elements,
        metadata,
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ script: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
