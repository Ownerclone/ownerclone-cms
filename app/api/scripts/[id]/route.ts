import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/scripts/[id] - Get single script
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ script: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/scripts/[id] - Update script
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    const { title, logline, elements, status, metadata } = body;

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (logline !== undefined) updates.logline = logline;
    if (elements !== undefined) updates.elements = elements;
    if (status !== undefined) updates.status = status;
    if (metadata !== undefined) updates.metadata = metadata;

    const { data, error } = await supabase
      .from('scripts')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ script: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/scripts/[id] - Delete script
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { error } = await supabase
      .from('scripts')
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
