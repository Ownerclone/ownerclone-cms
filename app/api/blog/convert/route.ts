import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { scriptId } = await request.json();

    if (!scriptId) {
      return NextResponse.json(
        { error: 'Script ID is required' },
        { status: 400 }
      );
    }

    // Get the script
    const { data: script, error: scriptError } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', scriptId)
      .single();

    if (scriptError || !script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      );
    }

    // Convert elements to screenplay text
    const elements = script.elements || [];
    const scriptText = elements
      .map((el: any) => el.content)
      .filter((content: string) => content.trim())
      .join('\n\n');

    // Call Claude to convert screenplay to blog post
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Convert this screenplay scene into an engaging blog post. The blog post should:
- Tell the story in narrative prose (not screenplay format)
- Be engaging and readable
- Capture the key moments and dialogue
- Be around 500-800 words
- Include a compelling title

Screenplay:
${scriptText}

Return ONLY a JSON object with this structure (no markdown, no code blocks):
{
  "title": "Blog post title",
  "content": "Full blog post content in markdown format",
  "excerpt": "Brief 1-2 sentence summary"
}`
      }]
    });

    // Parse Claude's response
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    let blogData;
    try {
      // Remove any markdown code blocks if present
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      blogData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Generate slug from title
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Create blog post
    const { data: post, error: createError } = await supabase
      .from('blog_posts')
      .insert({
        title: blogData.title,
        slug: slug,
        content: blogData.content,
        excerpt: blogData.excerpt,
        status: 'draft',
        source_script_id: scriptId,
        seo_metadata: {
          meta_title: blogData.title,
          meta_description: blogData.excerpt
        }
      })
      .select()
      .single();

    if (createError) throw createError;

    return NextResponse.json({ 
      success: true,
      post: post 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: error.message || 'Conversion failed' },
      { status: 500 }
    );
  }
}
