'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import BlogEditor from '@/components/BlogEditor';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  seo_metadata: any;
  status: string;
}

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    try {
      const res = await fetch('/api/blog/' + resolvedParams.id);
      const data = await res.json();
      setPost(data.post);
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const res = await fetch('/api/blog/' + resolvedParams.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Save failed');

      alert('Post saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save post');
    }
  };

  const handlePublish = async () => {
    if (!confirm('Publish this post?')) return;

    try {
      const res = await fetch('/api/blog/' + resolvedParams.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' })
      });

      if (!res.ok) throw new Error('Publish failed');

      alert('Post published!');
      router.push('/cms/blogposts');
    } catch (error) {
      console.error('Publish failed:', error);
      alert('Failed to publish post');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post not found</h2>
          <Link href="/cms/blogposts" className="text-blue-600 hover:underline">
            Back to posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/cms/blogposts"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
                <p className="text-sm text-gray-500">Status: {post.status}</p>
              </div>
            </div>
            {post.status !== 'published' && (
              <button
                onClick={handlePublish}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <BlogEditor
          initialTitle={post.title}
          initialContent={post.content}
          initialExcerpt={post.excerpt}
          initialSeoMetadata={post.seo_metadata}
          onSave={handleSave}
          autoSave={true}
        />
      </div>
    </div>
  );
}
